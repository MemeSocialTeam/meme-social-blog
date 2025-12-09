import bcrypt from "bcrypt";

const saltRound = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRound);
  return await bcrypt.hash(password, salt);
};

export const compareHashedPassword = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};