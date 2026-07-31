export default function robots() {
  return {
    rules: [
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: [
          "/",
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
          "/blog/*",
        ],
        disallow: [
          "/admin",
          "/algo",
          "/audit",
          "/ib",
          "/login",
          "/market",
          "/partner",
          "/performance",
          "/portfolio",
          "/profile",
          "/signup",
          "/trade",
        ],
      },
    ],
    sitemap: "https://apexalpha.fun/sitemap.xml",
  };
}
