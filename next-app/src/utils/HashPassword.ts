import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function isPasswordCorrect(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);
  return isPasswordCorrect;
}
