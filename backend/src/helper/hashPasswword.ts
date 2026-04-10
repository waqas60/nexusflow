import bcrypt from "bcrypt";
export async function generatePasswordHash(password: string) {
  return await bcrypt.hash(password, 10);
}
export async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}
