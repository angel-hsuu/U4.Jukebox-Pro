import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(username, password) {
  const hashed = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, hashed]
  );
  return user;
}

export async function getUserByUsernameAndPassword(username, password) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const {
    rows: [user],
  } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return user;
}
