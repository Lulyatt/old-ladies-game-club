import ForumThreadPage from "@/components/forum-thread-page";

export const metadata = {
  title: "Forum thread | The Old Ladies Game Club",
  description: "Club forum discussion.",
};

export default async function ForumThreadRoutePage({ params }) {
  const { threadId } = await params;

  return <ForumThreadPage threadId={threadId} />;
}
