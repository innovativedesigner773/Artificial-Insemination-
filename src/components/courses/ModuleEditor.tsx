import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Card, CardContent } from '../ui/card'
import { toast } from 'sonner'
import { firestoreService } from '../../utils/firebase/database'
import { 
  Save,
  X,
  FileText,
  Upload,
  Trash2
} from 'lucide-react'
import type { Module, UploadedFile } from '../../types'

interface ModuleEditorProps {
  courseId: string
  module?: Module | null
  onSaved: (module: Module) => void
  onCancel: () => void
}

export function ModuleEditor({ courseId, module, onSaved, onCancel }: ModuleEditorProps) {
  const [formData, setFormData] = useState({
    title: module?.title || '',
    description: module?.description || '',
  })
  const [attachments, setAttachments] = useState<UploadedFile[]>(module?.attachments || [])
  const [loading, setLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Module title is required')
      return
    }

    try {
      setLoading(true)
      
      const moduleData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        lessons: module?.lessons || [],
        attachments: attachments
      }

      let savedModule: Module
      
      if (module) {
        // Update existing module
        savedModule = await firestoreService.updateModule(courseId, module.id, moduleData)
      } else {
        // Create new module
        savedModule = await firestoreService.createModule(courseId, moduleData)
      }

      onSaved(savedModule)
    } catch (error) {
      console.error('Failed to save module:', error)
      toast.error('Failed to save module')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingFiles(true)
      
      for (const file of Array.from(files)) {
        const base64Data = await firestoreService.convertFileToBase64(file)
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        }
        
        setAttachments(prev => [...prev, uploadedFile])
      }
      
      toast.success('Files uploaded successfully')
    } catch (error) {
      console.error('Failed to upload files:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFiles(false)
    }
  }

  const handleRemoveAttachment = (fileId: string) => {
    setAttachments(prev => prev.filter(file => file.id !== fileId))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Module Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter module title"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Module Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this module covers"
              className="w-full min-h-[100px]"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Attachments */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Module Materials
              </h3>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingFiles}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingFiles}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingFiles ? 'Uploading...' : 'Add Files'}
                </Button>
              </div>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Attached files:</p>
                {attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024).toFixed(1)} KB • {file.type}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {attachments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No files attached yet</p>
                <p className="text-xs">Upload documents, images, or other materials for this module</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.title.trim()}
          className="bg-primary-green hover:bg-secondary-green"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {module ? 'Update Module' : 'Create Module'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
