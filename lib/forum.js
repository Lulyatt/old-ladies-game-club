import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getAvatarById } from "@/data/avatars";
import { formatForumDate } from "@/lib/format-forum-date";
import { db } from "@/lib/firebase";

function mapAuthorFields(data) {
  const username = data.authorUsername ?? "Club Member";
  const avatarId = data.avatarId ?? "default";
  const avatar = getAvatarById(avatarId);
  const avatarSrc = data.authorPhotoURL || avatar.src || null;

  return {
    authorId: data.authorId,
    authorUsername: username,
    avatarSrc,
    avatarAlt: `${username}'s profile picture`,
    fallbackInitial: username.charAt(0).toUpperCase(),
  };
}

export function mapThreadListItem(id, data) {
  return {
    id,
    title: data.title ?? "",
    bodyPreview: (data.body ?? "").slice(0, 160),
    replyCount: data.replyCount ?? 0,
    lastActivityLabel: formatForumDate(data.updatedAt ?? data.createdAt),
    ...mapAuthorFields(data),
  };
}

export function mapThreadDetail(id, data) {
  return {
    id,
    title: data.title ?? "",
    body: data.body ?? "",
    createdAtLabel: formatForumDate(data.createdAt),
    replyCount: data.replyCount ?? 0,
    likeCount: data.likeCount ?? 0,
    ...mapAuthorFields(data),
  };
}

export function mapReply(id, data) {
  return {
    id,
    body: data.body ?? "",
    createdAtLabel: formatForumDate(data.createdAt),
    likeCount: data.likeCount ?? 0,
    ...mapAuthorFields(data),
  };
}

export async function fetchForumThreads() {
  const threadsQuery = query(
    collection(db, "forumThreads"),
    orderBy("updatedAt", "desc"),
  );
  const snapshot = await getDocs(threadsQuery);

  return snapshot.docs.map((entry) =>
    mapThreadListItem(entry.id, entry.data()),
  );
}

export async function fetchForumThread(threadId) {
  const threadRef = doc(db, "forumThreads", threadId);
  const snapshot = await getDoc(threadRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapThreadDetail(snapshot.id, snapshot.data());
}

export async function fetchForumReplies(threadId) {
  const repliesQuery = query(
    collection(db, "forumThreads", threadId, "replies"),
    orderBy("createdAt", "asc"),
  );
  const snapshot = await getDocs(repliesQuery);

  return snapshot.docs.map((entry) => mapReply(entry.id, entry.data()));
}

export async function fetchForumPostCountByUserId(userId) {
  const threadsQuery = query(
    collection(db, "forumThreads"),
    where("authorId", "==", userId),
  );
  const threadsSnapshot = await getDocs(threadsQuery);

  const repliesQuery = query(
    collectionGroup(db, "replies"),
    where("authorId", "==", userId),
  );
  const repliesSnapshot = await getDocs(repliesQuery);

  return threadsSnapshot.size + repliesSnapshot.size;
}

export async function fetchForumLikeState(userId, threadId, replyIds = []) {
  if (!userId) {
    return { threadLiked: false, replyLiked: {} };
  }

  const threadLikeRef = doc(db, "forumThreads", threadId, "likes", userId);
  const threadLikeSnapshot = await getDoc(threadLikeRef);

  const replyLiked = {};

  await Promise.all(
    replyIds.map(async (replyId) => {
      const replyLikeRef = doc(
        db,
        "forumThreads",
        threadId,
        "replies",
        replyId,
        "likes",
        userId,
      );
      const replyLikeSnapshot = await getDoc(replyLikeRef);
      replyLiked[replyId] = replyLikeSnapshot.exists();
    }),
  );

  return {
    threadLiked: threadLikeSnapshot.exists(),
    replyLiked,
  };
}

export async function toggleForumThreadLike({ user, threadId }) {
  if (!user?.uid) {
    throw new Error("You must be logged in to like posts.");
  }

  const threadRef = doc(db, "forumThreads", threadId);
  const likeRef = doc(db, "forumThreads", threadId, "likes", user.uid);

  const liked = await runTransaction(db, async (transaction) => {
    const threadSnapshot = await transaction.get(threadRef);

    if (!threadSnapshot.exists()) {
      throw new Error("This thread no longer exists.");
    }

    const likeSnapshot = await transaction.get(likeRef);

    if (likeSnapshot.exists()) {
      transaction.delete(likeRef);
      transaction.update(threadRef, { likeCount: increment(-1) });
      return false;
    }

    transaction.set(likeRef, { createdAt: serverTimestamp() });
    transaction.update(threadRef, { likeCount: increment(1) });
    return true;
  });

  const updatedThread = await getDoc(threadRef);
  const likeCount = updatedThread.data()?.likeCount ?? 0;

  return { liked, likeCount };
}

export async function toggleForumReplyLike({ user, threadId, replyId }) {
  if (!user?.uid) {
    throw new Error("You must be logged in to like posts.");
  }

  const replyRef = doc(db, "forumThreads", threadId, "replies", replyId);
  const likeRef = doc(
    db,
    "forumThreads",
    threadId,
    "replies",
    replyId,
    "likes",
    user.uid,
  );

  const liked = await runTransaction(db, async (transaction) => {
    const replySnapshot = await transaction.get(replyRef);

    if (!replySnapshot.exists()) {
      throw new Error("This reply no longer exists.");
    }

    const likeSnapshot = await transaction.get(likeRef);

    if (likeSnapshot.exists()) {
      transaction.delete(likeRef);
      transaction.update(replyRef, { likeCount: increment(-1) });
      return false;
    }

    transaction.set(likeRef, { createdAt: serverTimestamp() });
    transaction.update(replyRef, { likeCount: increment(1) });
    return true;
  });

  const updatedReply = await getDoc(replyRef);
  const likeCount = updatedReply.data()?.likeCount ?? 0;

  return { liked, likeCount };
}

export async function createForumThread({ user, username, avatarId, title, body }) {
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();

  if (!trimmedTitle) {
    throw new Error("Please add a title for your thread.");
  }

  if (!trimmedBody) {
    throw new Error("Please write something before posting.");
  }

  const docRef = await addDoc(collection(db, "forumThreads"), {
    title: trimmedTitle,
    body: trimmedBody,
    authorId: user.uid,
    authorUsername: username,
    avatarId: avatarId ?? "default",
    authorPhotoURL: user.photoURL || "",
    replyCount: 0,
    likeCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function createForumReply({
  user,
  username,
  avatarId,
  threadId,
  body,
}) {
  const trimmedBody = body.trim();

  if (!trimmedBody) {
    throw new Error("Please write a reply before posting.");
  }

  const threadRef = doc(db, "forumThreads", threadId);
  const replyRef = doc(collection(db, "forumThreads", threadId, "replies"));

  await runTransaction(db, async (transaction) => {
    const threadSnapshot = await transaction.get(threadRef);

    if (!threadSnapshot.exists()) {
      throw new Error("This thread no longer exists.");
    }

    transaction.set(replyRef, {
      body: trimmedBody,
      authorId: user.uid,
      authorUsername: username,
      avatarId: avatarId ?? "default",
      authorPhotoURL: user.photoURL || "",
      likeCount: 0,
      createdAt: serverTimestamp(),
    });

    transaction.update(threadRef, {
      replyCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  });

  return replyRef.id;
}
