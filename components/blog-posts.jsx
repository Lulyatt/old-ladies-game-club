import BlogCard from "@/components/blog-card";

export default function BlogPosts({ blogPosts }) {
  return (
    <section className="w-full md:py-2">
      <h2 className="text-center text-base font-bold md:text-2xl">Blog Posts</h2>
      <p className="mx-auto mt-1 hidden max-w-md text-center text-sm text-muted-foreground md:block">
        Read the latest from the club.
      </p>

      <div className="mt-4 flex w-full snap-x snap-mandatory snap-always gap-4 overflow-x-auto pb-2 scroll-ps-[calc(50%-100px)] scroll-pe-[calc(50%-100px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-5 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:snap-none md:scroll-ps-0 md:scroll-pe-0">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
