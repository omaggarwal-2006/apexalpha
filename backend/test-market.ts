import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function test() {
  try {
    const quote = await yahooFinance.quote('BTC-USD');
    console.log('BTC-USD Quote Success:', quote.regularMarketPrice);
  } catch (err) {
    console.error('Test Failed:', err);
  }
}
test();
