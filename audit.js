async function checkMeta(url) {
  const r = await fetch(url);
  const html = await r.text();
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'NO TITLE';
  const descMatch = html.match(/name="description"[^>]*content="([^"]+)"/);
  const desc = descMatch ? descMatch[1] : 'NO DESC';
  const adsense = html.includes('ca-pub-3740887631837879') ? 'YES' : 'NO';
  const adscript = html.includes('adsbygoogle.js') ? 'YES' : 'NO';
  const disclaimer = html.includes('disclaimer') || html.includes('Disclaimer') || html.includes('DISCLAIMER') ? 'YES' : 'NO';
  const path = url.replace('https://apexalpha.fun', '') || '/';
  console.log(path);
  console.log('  Title: ' + title.substring(0,70));
  console.log('  Desc: ' + desc.substring(0,90));
  console.log('  AdSense Meta: ' + adsense + ' | Script: ' + adscript + ' | Disclaimer: ' + disclaimer);
  console.log('');
}

async function main() {
  const pages = [
    'https://apexalpha.fun',
    'https://apexalpha.fun/blog',
    'https://apexalpha.fun/blog/candlestick-patterns',
    'https://apexalpha.fun/about',
    'https://apexalpha.fun/privacy',
    'https://apexalpha.fun/disclaimer',
    'https://apexalpha.fun/terms',
    'https://apexalpha.fun/contact',
  ];
  for (const p of pages) await checkMeta(p);
}
main().catch(console.error);
