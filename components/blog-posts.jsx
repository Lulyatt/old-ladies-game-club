import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function BlogPosts({ blogPosts }) {
  return (
    <section className="py-6 text-center sm:py-12">
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-[#f5f0e8] p-6 shadow-lg sm:p-10">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Blog Post
        </p>
        <p className="mt-1 text-lg font-semibold">{blogPosts.date}</p>

        <div className="mt-6 flex flex-col items-center gap-6 sm:mt-8 sm:gap-8">
          <img
            src={blogPosts.coverImage}
            alt={`${blogPosts.title} cover art`}
            className="w-full max-w-[200px] rounded-lg border border-border sm:max-w-xs"
          />
          <div className="flex max-w-xl flex-col items-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{blogPosts.title}</h2>

            <p className="mt-2 text-sm text-muted-foreground">{blogPosts.author}</p>

            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              {blogPosts.description}
            </p>

            <Link
              href={`/blog/${blogPosts.slug}`}
              className={cn(buttonVariants(), "mt-6")}
            >
              View blog post
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
