import { scrypt, randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { promisify } from 'util';

const asyncScrypt = promisify(scrypt);

export class PasswordManager {
  static async toHash(password: string) {
    // const salt = randomBytes(8).toString('hex');
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  }

  static async compare(suppliedPassword: string, storedPassword: string) {
    const match = await bcrypt.compare(suppliedPassword, storedPassword);

    return match;
  }
}
