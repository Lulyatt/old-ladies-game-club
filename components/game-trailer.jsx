"use client";

export default function GameTrailer({ movie, steamStoreUrl }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-border">
      <video
        controls
        playsInline
        preload="metadata"
        poster={movie.thumbnail}
        className="aspect-video w-full bg-black object-cover"
      >
        <source src={movie.hls_h264} type="application/x-mpegURL" />
      </video>
      <figcaption className="border-t border-border px-3 py-2 text-sm">
        <p className="font-medium">{movie.name}</p>
        {steamStoreUrl ? (
          <a
            href={steamStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Watch on Steam if video does not play
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}
