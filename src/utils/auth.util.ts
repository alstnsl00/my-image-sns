import * as bcrypt from 'bcrypt';

const SALT_ROUND = 8;

async function createHashedPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUND);
}

async function compareWithHash(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

async function validateWithWord(password: string): Promise<string> {
  const validatePass = /^.*(?=.{8,15})(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[~`!?@#$%^&*()-+=]).*$/;
  if (!validatePass.test(password)) {
    return 'regError';
  }
  return password;
}

export { createHashedPassword, compareWithHash, validateWithWord };
