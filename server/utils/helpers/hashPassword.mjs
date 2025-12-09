import bcrypt from "bcrypt";

const saltRound = 10;

export const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(saltRound);
  return bcrypt.hashSync(password, salt);
};

export const compareHashedPassword = async (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};