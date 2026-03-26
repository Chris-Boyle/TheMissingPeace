import type { Testimonial } from "@/content/testimonials";

type VideoTestimonialCardProps = {
  testimonial: Testimonial;
};

function isEmbeddableVideoUrl(videoUrl: string) {
  return (
    videoUrl.includes("youtube.com/embed/") ||
    videoUrl.includes("player.vimeo.com/video/")
  );
}

export function VideoTestimonialCard({
  testimonial,
}: VideoTestimonialCardProps) {
  if (!testimonial.video) {
    return null;
  }

  const { video } = testimonial;

  return (
    <article className="overflow-hidden rounded-[1.9rem] border border-[#dfd1c1] bg-[#fffaf5] shadow-[0_20px_55px_rgba(109,75,54,0.1)]">
      <div className="aspect-video bg-[#eadcca]">
        {isEmbeddableVideoUrl(video.videoUrl) ? (
          <iframe
            src={video.videoUrl}
            title={`Video testimonial from ${testimonial.reviewerName}`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            controls
            playsInline
            preload="metadata"
            poster={video.thumbnail}
            aria-label={`Video testimonial from ${testimonial.reviewerName}. ${video.thumbnailAlt}`}
            className="h-full w-full object-cover"
          >
            <source src={video.videoUrl} />
            Your browser does not support embedded video playback.
          </video>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="inline-flex items-center gap-3 rounded-full border border-[#eadbcf] bg-[#fffdf9] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6a52]">
          <span className="h-2 w-2 rounded-full bg-[#d5a54a]" aria-hidden="true" />
          Video Testimonial
        </div>
        <blockquote className="text-lg leading-8 text-[#57453a]">
          <p>&ldquo;{video.caption}&rdquo;</p>
        </blockquote>
        <footer className="border-t border-[#eadbcf] pt-4">
          <p className="text-base font-semibold text-[#6d4b36]">
            {testimonial.reviewerName}
          </p>
          <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#8c6a52]">
            {testimonial.reviewSource} Review
          </p>
          {video.summary ? (
            <p className="mt-3 text-sm leading-6 text-[#6a5447]">
              {video.summary}
            </p>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
