"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AccountProfileHeader from "@/components/account-profile-header";
import AccountReviewsSection from "@/components/account-reviews-section";
import { ensureUserProfile } from "@/lib/ensure-user-profile";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/get-user-profile";
import { fetchReviewsByUserId } from "@/lib/reviews";

const PLACEHOLDER_FORUM_POSTS = 0;

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [firestoreProfile, setFirestoreProfile] = useState(null);
  const [profileError, setProfileError] = useState("");
  const [profileReady, setProfileReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setFirestoreProfile(null);
      setProfileError("");
      setProfileReady(true);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setProfileReady(false);
      setProfileError("");

      try {
        const profile = await ensureUserProfile(user);
        if (!cancelled) {
          setFirestoreProfile(profile);
        }
      } catch (error) {
        if (!cancelled) {
          setProfileError(error.message);
        }
      } finally {
        if (!cancelled) {
          setProfileReady(true);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setReviews([]);
      setReviewsError("");
      setReviewsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadReviews() {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const userReviews = await fetchReviewsByUserId(user.uid);
        if (!cancelled) {
          setReviews(userReviews);
        }
      } catch (error) {
        if (!cancelled) {
          setReviewsError(error.message);
        }
      } finally {
        if (!cancelled) {
          setReviewsLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      await signOut(auth);
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  }

  if (!authReady || (user && !profileReady)) {
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
    firestoreProfile,
    reviewCount: reviews.length,
    forumPostCount: PLACEHOLDER_FORUM_POSTS,
  });

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 snap-none px-4 py-6 md:px-6 md:py-16">
      {profileError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {profileError}
        </p>
      ) : null}

      {reviewsError ? (
        <p className="mb-4 text-sm text-destructive" role="alert">
          {reviewsError}
        </p>
      ) : null}

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

      <AccountReviewsSection reviews={reviews} loading={reviewsLoading} />
    </main>
  );
}
