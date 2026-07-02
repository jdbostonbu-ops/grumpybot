// Layer 3 embed enforcement helpers.
//
// Pure functions for parsing Referer headers, detecting localhost origins,
// and comparing origins for strict equality. Used by GET /embed/[botSlug]
// and POST /api/embed/ask to decide whether a request is allowed.
//
// No database access, no session reads, no request-handling logic — just
// URL parsing and comparison. The routes that call these functions are
// responsible for translating the results into responses and log writes.

/**
 * Extracts the origin (scheme + host + port) from a Referer header value.
 * Returns null if the header is missing, malformed, or not a parseable URL.
 *
 * The origin is what the web spec calls the tuple that identifies a "site":
 *   https://example.com:443/path?query#hash  →  https://example.com
 *
 * Callers use the returned origin string to compare against the token's
 * lockedOrigin. A null return means the Referer could not be trusted at
 * all — the route should treat this as MISSING_REFERER and reject.
 */
export const extractRefererOrigin = (refererHeader: string | null): string | null => {
  if (refererHeader === null || refererHeader === '') {
    return null;
  }

  try {
    const parsed = new URL(refererHeader);
    return parsed.origin;
  } catch {
    return null;
  }
};

/**
 * Returns true if the origin string represents a localhost URL —
 * either `http://localhost:<port>` or `http://127.0.0.1:<port>`.
 *
 * Uses exact hostname match against the parsed URL's host, NOT a
 * startsWith check on the string. A startsWith check would let
 * `http://localhost.evil.com` bypass, which is a real subdomain
 * takeover risk.
 *
 * Only http:// is treated as localhost. https://localhost is not
 * a real deployment pattern and gets rejected like any other origin
 * mismatch — this avoids ambiguity around self-signed certs.
 */
export const isLocalhostOrigin = (origin: string): boolean => {
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== 'http:') {
      return false;
    }
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

/**
 * Strict origin equality check.
 *
 * Both inputs are compared as-is after being re-parsed through URL,
 * which normalizes port defaults and trailing slashes. This is
 * intentionally NOT a fuzzy match — subdomain differences, protocol
 * differences, and port differences all fail.
 *
 * Returns false if either origin is malformed.
 */
export const originsMatch = (a: string, b: string): boolean => {
  try {
    const parsedA = new URL(a);
    const parsedB = new URL(b);
    return parsedA.origin === parsedB.origin;
  } catch {
    return false;
  }
};