"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AccountProfileHeader from "@/components/account-profile-header";
import AccountReviewsSection from "@/components/account-reviews-section";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/get-user-profile";
import { getUserReviews } from "@/lib/get-user-reviews";

const PLACEHOLDER_FORUM_POSTS = 0;

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const reviews = getUserReviews();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await signOut(auth);
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  if (!authReady) {
    return (
      <main className="mx-auto max-w-5xl flex-1 snap-none px-6 py-16">
        <p className="text-sm text-muted-foreground">Loading your account…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-5xl flex-1 snap-none px-6 py-16">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="mt-4 text-muted-foreground">
          You need to be logged in to view your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  const profile = getUserProfile(user, {
    reviewCount: reviews.length,
    forumPostCount: PLACEHOLDER_FORUM_POSTS,
    avatarId: "default",
  });

  return (
    <main className="mx-auto max-w-5xl flex-1 snap-none px-6 py-10 md:py-16">
      <AccountProfileHeader
        username={profile.username}
        avatarSrc={profile.avatarSrc}
        avatarAlt={profile.avatarAlt}
        fallbackInitial={profile.fallbackInitial}
        memberSince={profile.memberSince}
        reviewCount={profile.reviewCount}
        forumPostCount={profile.forumPostCount}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <AccountReviewsSection reviews={reviews} />
    </main>
  );
}
