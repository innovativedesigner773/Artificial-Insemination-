import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { 
  Trophy, 
  Download, 
  Calendar, 
  Award,
  Star,
  ExternalLink
} from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

interface Certificate {
  id: string
  courseTitle: string
  courseThumbnail: string
  issuedDate: string
  score: number
  certificateCode: string
  skills: string[]
}

export function CertificateList() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading certificates
    setTimeout(() => {
      // Sample certificates - in real app this would come from API
      setCertificates([
        {
          id: 'cert-1',
          courseTitle: 'Introduction to AI Techniques',
          courseThumbnail: 'https://images.unsplash.com/photo-1758653500348-5944e186ab1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHN2ZXRlcmluYXJ5JTIwZWR1Y2F0aW9uJTIwbWVkaWNhbHxlbnwxfHx8fDE3NTg4NzQ3OTl8MA&ixlib=rb-4.1.0&q=80&w=400',
          issuedDate: '2024-01-15',
          score: 94,
          certificateCode: 'AI-BASIC-2024-001',
          skills: ['Basic AI Procedures', 'Reproductive Anatomy', 'Equipment Safety']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const downloadCertificate = (certificateId: string) => {
    // In real app, this would download the actual certificate
    console.log('Downloading certificate:', certificateId)
  }

  const viewCertificate = (certificateId: string) => {
    // In real app, this would open certificate in new window
    console.log('Viewing certificate:', certificateId)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <Trophy className="h-8 w-8 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Certificates</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Showcase your achievements and demonstrate your expertise in artificial insemination techniques
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{certificates.length}</div>
            <div className="text-sm text-gray-600">Certificates Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {certificates.length > 0 
                ? Math.round(certificates.reduce((sum, cert) => sum + cert.score, 0) / certificates.length)
                : 0
              }%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {certificates.reduce((sum, cert) => sum + cert.skills.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Skills Demonstrated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {certificates.length > 0 ? '2024' : '-'}
            </div>
            <div className="text-sm text-gray-600">Latest Achievement</div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates */}
      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-500 mb-6">
              Complete courses and pass assessments to earn your first certificate
            </p>
            <Button>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <ImageWithFallback
                  src={certificate.courseThumbnail}
                  alt={certificate.courseTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Trophy className="h-3 w-3 mr-1" />
                    Certified
                  </Badge>
                </div>
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{certificate.score}%</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{certificate.courseTitle}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Issued {formatDate(certificate.issuedDate)}</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Certificate ID</div>
                  <div className="text-xs font-mono bg-gray-100 rounded px-2 py-1">
                    {certificate.certificateCode}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Skills Demonstrated</div>
                  <div className="flex flex-wrap gap-1">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => viewCertificate(certificate.id)}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadCertificate(certificate.id)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {certificates.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Keep Learning!</h3>
            <p className="text-gray-600 mb-4">
              Continue your education journey and earn more certificates to showcase your expertise
            </p>
            <Button>
              Explore More Courses
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}