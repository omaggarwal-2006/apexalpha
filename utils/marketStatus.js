/**
 * NSE Market Status — Pure utility module
 * 
 * Determines if the National Stock Exchange of India is currently open
 * based on IST (UTC+5:30), weekday, and a provided holiday list.
 * 
 * Isomorphic: works on both server and client.
 */

// ─── Official NSE Holidays 2026 ───────────────────────────
// Source: NSE circular — Trading holidays for Calendar Year 2026
export const NSE_HOLIDAYS_2026 = [
  '2026-01-26', // Republic Day
  '2026-02-17', // Mahashivratri (tentative)
  '2026-03-10', // Holi
  '2026-03-30', // Id-Ul-Fitr (Ramzan Eid) (tentative)
  '2026-04-02', // Ram Navami
  '2026-04-03', // Good Friday
  '2026-04-14', // Dr. Ambedkar Jayanti
  '2026-05-01', // Maharashtra Day
  '2026-06-06', // Eid-Ul-Adha (Bakri Id) (tentative)
  '2026-07-06', // Muharram (tentative)
  '2026-08-15', // Independence Day
  '2026-08-26', // Janmashtami (tentative)
  '2026-09-04', // Milad-Un-Nabi (tentative)
  '2026-10-02', // Mahatma Gandhi Jayanti
  '2026-10-20', // Dussehra
  '2026-10-21', // Dussehra (additional)
  '2026-11-09', // Diwali (Laxmi Puja)
  '2026-11-10', // Diwali (Balipratipada)
  '2026-11-19', // Guru Nanak Jayanti
  '2026-12-25', // Christmas
];

// ─── Constants ────────────────────────────────────────────
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+5:30 in milliseconds

const MARKET_OPEN_HOUR   = 9;
const MARKET_OPEN_MINUTE = 15;
const MARKET_CLOSE_HOUR  = 15;
const MARKET_CLOSE_MINUTE = 30;

const PRE_MARKET_OPEN_HOUR   = 9;
const PRE_MARKET_OPEN_MINUTE = 0;

// ─── Helpers ──────────────────────────────────────────────

/**
 * Returns the current Date converted to IST regardless of the system timezone.
 * @returns {Date} A Date object representing the current IST time
 */
function getISTDate(now = new Date()) {
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  return new Date(utcMs + IST_OFFSET_MS);
}

/**
 * Formats a Date to 'YYYY-MM-DD' string for holiday comparison.
 * @param {Date} date 
 * @returns {string}
 */
function toDateString(date) {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Converts hours and minutes to total minutes since midnight for easy comparison.
 */
function toMinutes(hours, minutes) {
  return hours * 60 + minutes;
}

// ─── Main API ─────────────────────────────────────────────

/**
 * Checks if the NSE is currently open.
 * 
 * @param {string[]} [holidayList=NSE_HOLIDAYS_2026] — Array of 'YYYY-MM-DD' holiday dates
 * @param {Date}     [now]                           — Override current time (useful for testing)
 * @returns {boolean} `true` if NSE is currently in regular trading hours
 */
export function isNSEOpen(holidayList = NSE_HOLIDAYS_2026, now = new Date()) {
  const ist = getISTDate(now);
  const dayOfWeek = ist.getDay(); // 0 = Sunday, 6 = Saturday

  // Weekend check
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;

  // Holiday check
  const dateStr = toDateString(ist);
  if (holidayList.includes(dateStr)) return false;

  // Time check: 9:15 AM – 3:30 PM IST
  const currentMinutes = toMinutes(ist.getHours(), ist.getMinutes());
  const openMinutes    = toMinutes(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE);
  const closeMinutes   = toMinutes(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE);

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Returns a detailed market session descriptor for UI rendering.
 * 
 * @param {string[]} [holidayList=NSE_HOLIDAYS_2026]
 * @param {Date}     [now]
 * @returns {{ isOpen: boolean, session: string, label: string, nextEvent: string, timeUntilNextEvent: number }}
 * 
 * Session values:
 *  - 'PRE_MARKET'  — 9:00 AM – 9:15 AM IST
 *  - 'OPEN'        — 9:15 AM – 3:30 PM IST
 *  - 'POST_MARKET' — 3:30 PM – 4:00 PM IST
 *  - 'CLOSED'      — Outside trading hours / weekend / holiday
 *  - 'HOLIDAY'     — Recognized NSE holiday
 */
export function getMarketSession(holidayList = NSE_HOLIDAYS_2026, now = new Date()) {
  const ist = getISTDate(now);
  const dayOfWeek = ist.getDay();
  const dateStr = toDateString(ist);
  const currentMinutes = toMinutes(ist.getHours(), ist.getMinutes());

  const openMinutes      = toMinutes(MARKET_OPEN_HOUR, MARKET_OPEN_MINUTE);
  const closeMinutes     = toMinutes(MARKET_CLOSE_HOUR, MARKET_CLOSE_MINUTE);
  const preMarketMinutes = toMinutes(PRE_MARKET_OPEN_HOUR, PRE_MARKET_OPEN_MINUTE);
  const postMarketEnd    = toMinutes(16, 0); // 4:00 PM

  // Holiday
  if (holidayList.includes(dateStr)) {
    return {
      isOpen: false,
      session: 'HOLIDAY',
      label: 'Holiday',
      nextEvent: 'Next trading day opens at 9:15 AM IST',
      timeUntilNextEvent: null,
    };
  }

  // Weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isOpen: false,
      session: 'CLOSED',
      label: 'Weekend',
      nextEvent: 'Monday 9:15 AM IST',
      timeUntilNextEvent: null,
    };
  }

  // Pre-market: 9:00 – 9:15
  if (currentMinutes >= preMarketMinutes && currentMinutes < openMinutes) {
    const minutesLeft = openMinutes - currentMinutes;
    return {
      isOpen: false,
      session: 'PRE_MARKET',
      label: 'Pre-Market',
      nextEvent: 'Market opens',
      timeUntilNextEvent: minutesLeft,
    };
  }

  // Regular trading: 9:15 – 15:30
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const minutesLeft = closeMinutes - currentMinutes;
    return {
      isOpen: true,
      session: 'OPEN',
      label: 'Market Open',
      nextEvent: 'Market closes',
      timeUntilNextEvent: minutesLeft,
    };
  }

  // Post-market: 15:30 – 16:00
  if (currentMinutes >= closeMinutes && currentMinutes < postMarketEnd) {
    return {
      isOpen: false,
      session: 'POST_MARKET',
      label: 'Post-Market',
      nextEvent: 'Session ends',
      timeUntilNextEvent: postMarketEnd - currentMinutes,
    };
  }

  // Closed (before 9 AM or after 4 PM)
  if (currentMinutes < preMarketMinutes) {
    return {
      isOpen: false,
      session: 'CLOSED',
      label: 'Closed',
      nextEvent: 'Pre-market at 9:00 AM IST',
      timeUntilNextEvent: preMarketMinutes - currentMinutes,
    };
  }

  return {
    isOpen: false,
    session: 'CLOSED',
    label: 'Closed',
    nextEvent: 'Next session at 9:15 AM IST',
    timeUntilNextEvent: null,
  };
}
