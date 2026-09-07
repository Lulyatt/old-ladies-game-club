import { blogPosts } from "@/data/blogPosts";

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export function getAllBlogPosts() {
  return blogPosts;
}
