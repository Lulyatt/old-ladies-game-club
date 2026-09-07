import AllBlogRow from "@/components/all-blog-row";
import { getAllBlogPosts } from "@/lib/get-blog-post";

export const metadata = {
  title: "Blog | The Old Ladies Game Club",
  description: "Read the latest from the club.",
};

export default function BlogPage() {
  const blogPosts = getAllBlogPosts();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 snap-none px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-muted-foreground">Read the latest from the club.</p>

      <div className="mt-8 w-full min-w-0 overflow-hidden">
        <div
          className="mb-2 hidden min-w-0 grid-cols-[7rem_minmax(0,2.5fr)_minmax(0,0.8fr)_auto] gap-4 text-xs font-medium uppercase tracking-wide text-muted-foreground md:grid"
          aria-hidden
        >
          
        </div>

        <div>
          {blogPosts.map((post) => (
            <AllBlogRow key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
