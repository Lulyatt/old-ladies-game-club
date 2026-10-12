import AccountStat from "@/components/account-stat";
import ProfilePortrait from "@/components/profile-portrait";

export default function AccountProfileHeader({
  username,
  avatarSrc,
  avatarAlt,
  fallbackInitial,
  memberSince,
  reviewCount,
  forumPostCount,
  onLogout,
  loggingOut,
}) {
  return (
    <section className="card-raised box-border w-full min-w-0 max-w-full overflow-hidden p-4 md:p-8">
      <div className="flex w-full min-w-0 max-w-full flex-col items-center gap-4 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-start md:gap-8">
        <ProfilePortrait
          src={avatarSrc}
          alt={avatarAlt}
          fallbackInitial={fallbackInitial}
        />

        <div className="w-full min-w-0 max-w-full text-center md:text-left">
          <h1 className="text-xl font-bold break-words md:text-3xl">{username}</h1>

          <div
            className="mx-auto mt-4 h-0.5 w-full max-w-md border-b-2 md:mx-0"
            style={{
              borderBottomColor: "oklch(0.82 0 0)",
              boxShadow: "0 1px 0 oklch(0.96 0 0)",
            }}
            aria-hidden
          />

          <div className="mt-4 flex w-full min-w-0 max-w-full flex-col items-stretch gap-3 md:mt-5 md:max-w-lg md:grid md:grid-cols-3 md:gap-6">
            <AccountStat label="Member since" value={memberSince} />
            <AccountStat label="Reviews" value={reviewCount} />
            <AccountStat label="Forum posts" value={forumPostCount} />
          </div>
        </div>

        <div className="w-full min-w-0 max-w-full shrink-0 md:w-auto md:justify-self-end">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 md:w-auto"
          >
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </div>
    </section>
  );
}
