import * as bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';

const SALT_ROUNDS = 10;

export const auth = {
  hashPassword: async (plain: string): Promise<string> =>
    bcrypt.hash(plain, SALT_ROUNDS),

  verifyPassword: async (plain: string, hash: string): Promise<boolean> =>
    bcrypt.compare(plain, hash),

  // A 6-digit numeric code, zero-padded, for email verification / reset.
  generateCode: (): string => String(randomInt(0, 1_000_000)).padStart(6, '0'),
};
