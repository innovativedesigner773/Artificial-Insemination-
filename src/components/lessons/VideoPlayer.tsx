import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Card } from '../ui/card'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings
} from 'lucide-react'
import { api } from '../../services/api'
import type { Lesson } from '../../types'

interface VideoPlayerProps {
  lesson: Lesson
  courseId: string
  onProgress: (progress: number) => void
  onComplete: () => void
}

export function VideoPlayer({ lesson, courseId, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const languages = [
    'Afrikaans',
    'English',
    'IsiNdebele',
    'IsiXhosa',
    'IsiZulu',
    'Sesotho',
    'Sepedi',
    'Setswana',
    'SiSwati',
    'Tshivenda',
    'Xitsonga'
  ] as const
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    const available = languages.find(l => lesson.videoSources && lesson.videoSources[l as keyof typeof lesson.videoSources])
    return available || 'English'
  })
  
  const resolveVideoUrl = (): { type: 'file' | 'youtube'; url: string } | null => {
    const perLang = lesson.videoSources && lesson.videoSources[selectedLanguage as keyof typeof lesson.videoSources]
    const url = perLang || lesson.videoUrl || ''
    if (!url) return null
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
    if (ytMatch) {
      return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` }
    }
    return { type: 'file', url }
  }

  const source = resolveVideoUrl()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleVideoEnd)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  useEffect(() => {
    // Track progress
    if (duration > 0) {
      const progressPercent = (currentTime / duration) * 100
      onProgress(progressPercent)
      
      // Update backend progress every 30 seconds or on significant milestones
      if (hasStarted && (Math.floor(currentTime) % 30 === 0 || progressPercent >= 90)) {
        updateProgress(Math.floor(currentTime))
      }
    }
  }, [currentTime, duration, hasStarted])

  const updateProgress = async (timeSpent: number) => {
    try {
      await api.updateProgress(courseId, lesson.id, {
        completed: (currentTime / duration) >= 0.9,
        timeSpent
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    onComplete()
    updateProgress(Math.floor(duration))
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
      if (!hasStarted) setHasStarted(true)
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const skip = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  return (
    <Card className="overflow-hidden">
      <div 
        className="relative bg-black group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {source && source.type === 'youtube' ? (
          <iframe
            className="w-full aspect-video"
            src={`${source.url}?rel=0&modestbranding=1`}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={source ? source.url : ''}
            className="w-full aspect-video"
            poster="https://images.unsplash.com/photo-1581092583537-40568be4efa5?w=800&h=450&fit=crop"
            onClick={togglePlay}
            controls={false}
          />
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button
              size="lg"
              onClick={togglePlay}
              className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30"
            >
              <Play className="h-8 w-8 ml-1" fill="white" />
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/30 rounded cursor-pointer mb-4"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/20 text-white border-none rounded px-2 py-1 text-sm"
              >
                {languages
                  .filter(l => (lesson.videoSources && lesson.videoSources[l as keyof typeof lesson.videoSources]) || lesson.videoUrl)
                  .map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
              </select>

              <select
                value={playbackRate}
                onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                className="bg-white/20 text-white border-none rounded px-2 py-1 text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              <Button
                size="sm"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{lesson.title}</h3>
        <p className="text-gray-600 text-sm mb-4">
          Learn about the fundamental concepts and practical applications covered in this lesson.
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Duration: {lesson.duration} minutes
          </div>
          <div className="text-sm text-gray-500">
            Progress: {Math.round((currentTime / duration) * 100) || 0}%
          </div>
        </div>
      </div>
    </Card>
  )
}