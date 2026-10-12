import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

function defaultUsername(user) {
  return user.displayName || user.email?.split("@")[0] || "Club Member";
}

export async function ensureUserProfile(user) {
  if (!user?.uid) {
    throw new Error("Cannot create a profile without a signed-in user.");
  }

  const profileRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const profile = {
    username: defaultUsername(user),
    avatarId: "default",
    email: user.email ?? null,
    createdAt: serverTimestamp(),
  };

  await setDoc(profileRef, profile);

  const created = await getDoc(profileRef);
  return created.data();
}
