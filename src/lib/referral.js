// Shared referral helpers: API base, code normalisation, share links.

export const API_BASE = (
  import.meta.env?.VITE_API_BASE_URL || 'https://dotvests-backend.onrender.com'
).replace(/\/+$/, '');

export const SITE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'https://dotvests.com';

// Must stay in sync with backend utils/referralCode.js
const ALPHABET = '34679ACDEFGHJKMNPQRTUVWXY';
const BODY_LENGTH = 5;

/**
 * "dv-7k3q9", " 7K3Q9 ", "DV 7K3Q9" -> "DV-7K3Q9". Returns null if unusable.
 */
export function normaliseCode(raw) {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!cleaned) return null;
  const body = cleaned.startsWith('DV') ? cleaned.slice(2) : cleaned;
  if (body.length !== BODY_LENGTH) return null;
  for (const ch of body) if (!ALPHABET.includes(ch)) return null;
  return 'DV-' + body;
}

/** Reads ?ref=CODE from the current URL and returns the normalised code. */
export function refFromUrl() {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return normaliseCode(params.get('ref') || '');
  } catch {
    return null;
  }
}

export function shareLink(code) {
  return `${SITE_URL}/?ref=${encodeURIComponent(code)}`;
}

export const SHARE_MESSAGE = (code) =>
  `I just joined the DotVests waitlist — fractional, tokenised access to African assets. Join with my code ${code}: ${shareLink(code)}`;

/** Clipboard copy with a document.execCommand fallback for older browsers. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON body */
  }
  return { res, data };
}

export async function fetchLeaderboard(limit = 25) {
  const { res, data } = await request(`/api/waitlist/leaderboard?limit=${limit}`);
  if (!res.ok || !data.success) throw new Error(data.message || 'Could not load the leaderboard.');
  return data;
}

export async function fetchStanding(code) {
  const { res, data } = await request(`/api/waitlist/referral/${encodeURIComponent(code)}`);
  if (!res.ok || !data.success) throw new Error(data.message || 'Could not find that referral code.');
  return data.data;
}

export async function validateCode(code) {
  const { res, data } = await request('/api/waitlist/validate-referral', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ referral_code: code })
  });
  if (!res.ok) throw new Error(data.message || 'Could not validate that code.');
  return data;
}
