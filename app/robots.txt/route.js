export const dynamic = 'force-dynamic';

export async function GET() {
  const body = `User-agent: Mediapartners-Google
Allow: /

User-agent: Googlebot
Allow: /

User-agent: *
Allow: /
Allow: /about
Allow: /contact
Allow: /terms
Allow: /disclaimer
Allow: /privacy
Allow: /cookies
Allow: /trust
Allow: /news
Allow: /learn
Allow: /blog
Allow: /blog/

Disallow: /admin
Disallow: /algo
Disallow: /audit
Disallow: /ib
Disallow: /login
Disallow: /market
Disallow: /partner
Disallow: /performance
Disallow: /portfolio
Disallow: /profile
Disallow: /signup
Disallow: /trade

Sitemap: https://apexalpha.fun/sitemap.xml`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
  });
}
