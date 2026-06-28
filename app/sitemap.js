export default async function sitemap() {
  const baseUrl = "https://www.apexalpha.fun";

  // Public pages and static blog paths specified by AdSense requirements
  const publicRoutes = [
    "",
    "/about",
    "/contact",
    "/terms",
    "/disclaimer",
    "/privacy",
    "/cookies",
    "/trust",
    "/news",
    "/learn",
    "/blog",
    "/blog/candlestick-charts-guide",
    "/blog/risk-management-in-trading",
    "/blog/trading-psychology-rules",
    "/blog/what-is-order-flow-trading",
    "/blog/what-is-paper-trading",
  ];

  return publicRoutes.map((route) => {
    // Define priorities for crawling relevance
    let priority = 0.5;
    if (route === "") {
      priority = 1.0;
    } else if (route === "/blog" || route === "/learn") {
      priority = 0.8;
    } else if (route.startsWith("/blog/")) {
      priority = 0.7;
    }

    // Define change frequencies
    let changeFrequency = "monthly";
    if (route === "" || route === "/blog" || route === "/news") {
      changeFrequency = "daily";
    } else if (route.startsWith("/blog/")) {
      changeFrequency = "weekly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency,
      priority,
    };
  });
}
