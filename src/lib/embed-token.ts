// HMAC-SHA256 signing and verification for embed tokens.
//
// Tokens prove an embed URL was minted by our server for a specific bot
// and locked origin. Without EMBED_TOKEN_SECRET, tokens cannot be forged.
//
// Format: <base64url-payload>.<base64url-signature>
// Payload: { botId, lockedOrigin } — no expiry (see PLAN.md, Layer 2).

import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/lib/env';

export interface EmbedTokenPayload {
  readonly botId: string;
  readonly lockedOrigin: string;
}

const toBase64Url = (input: Buffer): string => {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const fromBase64Url = (input: string): Buffer => {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLength), 'base64');
};

const sign = (payloadBase64: string): string => {
  const hmac = createHmac('sha256', env.embedTokenSecret);
  hmac.update(payloadBase64);
  return toBase64Url(hmac.digest());
};

/**
 * Signs an embed token payload and returns the token string.
 * The returned token is safe to include in a URL query parameter.
 */
export const signEmbedToken = (payload: EmbedTokenPayload): string => {
  const payloadJson = JSON.stringify(payload);
  const payloadBase64 = toBase64Url(Buffer.from(payloadJson, 'utf8'));
  const signatureBase64 = sign(payloadBase64);
  return `${payloadBase64}.${signatureBase64}`;
};

/**
 * Verifies an embed token and returns the payload if valid, null if not.
 * Never throws — invalid tokens return null so callers can reject safely
 * without leaking information about which check failed.
 */
export const verifyEmbedToken = (token: string): EmbedTokenPayload | null => {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }

  const [payloadBase64, providedSignature] = parts;
  if (payloadBase64 === undefined || providedSignature === undefined) {
    return null;
  }

  const expectedSignature = sign(payloadBase64);
  const providedBuffer = fromBase64Url(providedSignature);
  const expectedBuffer = fromBase64Url(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payloadJson = fromBase64Url(payloadBase64).toString('utf8');
    const parsed: unknown = JSON.parse(payloadJson);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('botId' in parsed) ||
      !('lockedOrigin' in parsed) ||
      typeof (parsed as EmbedTokenPayload).botId !== 'string' ||
      typeof (parsed as EmbedTokenPayload).lockedOrigin !== 'string'
    ) {
      return null;
    }

    return {
      botId: (parsed as EmbedTokenPayload).botId,
      lockedOrigin: (parsed as EmbedTokenPayload).lockedOrigin,
    };
  } catch {
    return null;
  }
};