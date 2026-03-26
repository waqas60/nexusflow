import bcrypt from "bcrypt";
export async function generatePasswordHash(password: string) {
  return await bcrypt.hash(password, 10);
}
