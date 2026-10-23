import { VideoMedia } from './ui.jsx'

// §3.16 Video.medium (YouTube embed in the original): 680x397 frame, 1px #93aeff, padding 16; 16:9 placeholder, no embed.
export default function Video({ slot = 'company.video.0' }) {
  return (
    <section className="p-6">
      <div className="mx-auto w-full max-w-[680px] border border-cobalt-30 p-2 md:p-4">
        <VideoMedia slot={slot} tone="dark" className="aspect-video w-full border border-cobalt-30" />
      </div>
    </section>
  )
}
