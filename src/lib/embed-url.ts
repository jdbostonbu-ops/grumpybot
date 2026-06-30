// Canonicalize and validate an embed lock URL.
// One bot locks to exactly one page URL. This turns a raw user-entered string
// into a single canonical form so save-time and check-time always agree, or
// returns null if the input is not a valid lock URL.
//
// Rules (see PLAN.md embed-security section):
// - must be https (http and other schemes rejected)
// - localhost / loopback hosts rejected
// - host compared exactly (no www stripping or adding)
// - query string and fragment dropped
// - trailing slash dropped; a trailing /index.html or /index.htm dropped
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

export const canonicalizeEmbedUrl = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (LOOPBACK_HOSTS.has(host)) {
    return null;
  }

  let path = url.pathname;
  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'/index.html'.length);
  } else if (path.endsWith('/index.htm')) {
    path = path.slice(0, -'/index.htm'.length);
  }
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  const portPart = url.port === '' ? '' : `:${url.port}`;
  return `https://${host}${portPart}${path}`;
};