import crypto from "crypto";

const SECRET_KEY = Buffer.from(
  process.env.NOTE_ENCRYPTION_SECRET_KEY,
  "base64"
);
const IV = Buffer.from(process.env.NOTE_ENCRYPTION_IV, "base64");

export const encryptNote = (note) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
  let encrypted = cipher.update(note, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptNote = (encryptedNote) => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
  let decrypted = decipher.update(encryptedNote, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
