import { SITE_URL, getBlogPosts } from "./_shared/blog-helpers.js";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");
  const posts = await getBlogPosts(context.env);
  const post = id ? posts.find(function (p) { return p.id === id; }) : null;

  const target = post ? SITE_URL + "/blog/" + post.slug : SITE_URL + "/blog.html";
  return Response.redirect(target, 301);
}
