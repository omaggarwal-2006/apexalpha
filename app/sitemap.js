import { BLOG_POSTS } from "@/lib/blogData";

export default async function sitemap() {
  const baseUrl = "https://apexalpha.fun";

  // Public static routes
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/terms",
    "/disclaimer",
    "/privacy",
    "/cookies",
    "/trust",
    "/faq",
    "/news",
    "/learn",
    "/blog",
  ];

  const staticEntries = staticRoutes.map((route) => {
    let priority = 0.5;
    if (route === "") priority = 1.0;
    else if (route === "/blog" || route === "/learn" || route === "/news" || route === "/faq") priority = 0.9;
    else if (route.startsWith("/blog/")) priority = 0.8;

    let changeFrequency = "monthly";
    if (route === "" || route === "/blog" || route === "/news") changeFrequency = "daily";
    else if (route.startsWith("/blog/")) changeFrequency = "weekly";

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency,
      priority,
    };
  });

  // Dynamic blog entries from BLOG_POSTS dataset (all 30 comprehensive articles)
  const dynamicBlogEntries = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...dynamicBlogEntries];
}
