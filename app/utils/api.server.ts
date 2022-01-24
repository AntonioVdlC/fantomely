import crypto from "crypto";

export function generatePublicKey() {
  return crypto.randomBytes(32).toString("hex");
}
