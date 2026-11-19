import ForumLikeButton from "@/components/forum-like-button";
import ProfilePortrait from "@/components/profile-portrait";

export default function ForumPost({
  authorUsername,
  avatarSrc,
  avatarAlt,
  fallbackInitial,
  createdAtLabel,
  body,
  title,
  threadId,
  replyId = null,
  likeCount = 0,
  liked = false,
  user = null,
  onLikeChanged,
}) {
  return (
    <article className="card-raised min-w-0 p-4 md:p-5">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        <ProfilePortrait
          src={avatarSrc}
          alt={avatarAlt}
          fallbackInitial={fallbackInitial}
        />
        <div className="min-w-0 flex-1">
          {title ? <h2 className="text-lg font-bold break-words">{title}</h2> : null}
          <p className="mt-1 text-xs text-muted-foreground">
            {authorUsername} • {createdAtLabel}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
          {threadId ? (
            <ForumLikeButton
              user={user}
              threadId={threadId}
              replyId={replyId}
              likeCount={likeCount}
              liked={liked}
              onChanged={onLikeChanged}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
