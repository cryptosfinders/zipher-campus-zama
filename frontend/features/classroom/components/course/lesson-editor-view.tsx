'use client'

import { useEffect, useState } from 'react'

import { CaseSensitive, Text } from 'lucide-react'
import { toast } from 'sonner'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { normalizeYouTubeEmbedUrl } from '@/lib/media'
import { useEthereumAccount } from '@/hooks/use-ethereum-account'
import { cn } from '@/lib/utils'

interface LessonEditorViewProps {
  lesson: Doc<'lessons'>
}

export const LessonEditorView = ({ lesson }: LessonEditorViewProps) => {
  const [title, setTitle] = useState(lesson.title)
  const [description, setDescription] = useState(lesson.description)
  const [videoUrl, setVideoUrl] = useState(lesson.youtubeUrl)

  const { mutate: update, pending } = useApiMutation(api.lessons.update)
  const { address } = useEthereumAccount()

  useEffect(() => {
    setTitle(lesson.title)
    setDescription(lesson.description)
    setVideoUrl(lesson.youtubeUrl)
  }, [lesson])

  const embedPreview = normalizeYouTubeEmbedUrl(videoUrl)

  const handleSave = () => {
    if (!address) {
      toast.error('Connect your wallet to save updates.')
      return
    }

    update({
      lessonId: lesson._id,
      title,
      description,
      youtubeUrl: videoUrl,
      address
    })

    toast.success('Lesson updated')
  }

  return (
    <div
      className={cn(
        'space-y-6 rounded-2xl border border-border',
        'bg-background/40 backdrop-blur-xl shadow-sm p-6'
      )}
    >
      {/* Title Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
          <CaseSensitive className="h-4 w-4" /> Lesson Title
        </label>
        <Input
          placeholder="Lesson title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11"
        />
      </div>

      {/* YouTube Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">
          YouTube Video URL
        </label>
        <Input
          placeholder="https://www.youtube.com/watch?v=xxxx"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="h-11"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Paste any YouTube watch/share/embed link.
          We convert it automatically.
        </p>
      </div>

      {/* Embed Preview */}
      <AspectRatio ratio={16 / 9}>
        {embedPreview ? (
          <iframe
            src={embedPreview}
            width="100%"
            height="100%"
            className="rounded-lg border border-border"
            title="Lesson video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div
            className="
              flex h-full w-full items-center justify-center
              rounded-xl bg-muted/30 border border-dashed border-border
              text-sm text-muted-foreground
            "
          >
            Enter a valid YouTube URL to preview the video
          </div>
        )}
      </AspectRatio>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
          <Text className="h-4 w-4" /> Description
        </label>
        <Input
          placeholder="Short description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-11"
        />
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={pending}
        className="w-full h-11 text-base font-semibold bg-[#F7C948] text-black hover:bg-[#f5c12f]"
      >
        {pending ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}
