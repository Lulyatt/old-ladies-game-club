"use client";

export default function GameTrailer({ movie }) {
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
      
    </figure>
  );
}
