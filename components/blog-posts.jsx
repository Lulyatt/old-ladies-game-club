import BlogCard from "@/components/blog-card";

export default function BlogPosts({ blogPosts }) {
  return (
    <section className="md:py-6">
      <h2 className="section-label text-base font-bold md:text-2xl">Blog Posts</h2>
      <p className="section-subtitle hidden text-xs md:block md:text-sm">
        Read the latest from the club.
      </p>

      <div className="mt-4 flex flex-col items-center gap-8 px-8 md:mt-5 md:grid md:w-full md:grid-cols-3 md:gap-4 md:px-0">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
