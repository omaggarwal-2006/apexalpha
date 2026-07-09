export default async function sitemap() {
  const baseUrl = "https://apexalpha.fun";

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
    "/blog/candlestick-patterns",
    "/blog/risk-management",
    "/blog/sharpe-ratio",
    "/blog/position-sizing",
    "/blog/market-heuristics",
    "/blog/order-book-trading",
    "/blog/paper-trading-simulation",
    "/blog/portfolio-optimization",
    "/blog/algorithmic-backtesting",
    "/blog/options-delta-gamma",
    "/blog/market-microstructure",
    "/blog/behavioral-finance",
    "/blog/quantitative-execution",
    "/blog/statistical-arbitrage",
    "/blog/risk-parity-model",
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
