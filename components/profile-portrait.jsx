export default function ProfilePortrait({ src, alt, fallbackInitial }) {
  return (
    <div className="profile-portrait-frame shrink-0">
      <div className="profile-portrait-oval overflow-hidden bg-muted">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground md:text-3xl"
            aria-hidden={Boolean(fallbackInitial)}
          >
            {fallbackInitial}
          </div>
        )}
      </div>
    </div>
  );
}
