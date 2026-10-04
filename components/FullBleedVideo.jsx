export default function FullBleedVideo() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-ink" aria-label="Film">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </section>
  );
}
