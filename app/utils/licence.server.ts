import fs from "fs/promises";
import path from "path";

import { marked } from "marked";

import sanitize from "sanitize-html";

export async function readLicence() {
  const licence = await fs.readFile(path.join(__dirname, "../", "LICENCE.md"));
  const html = marked(sanitize(licence.toString()));

  return html;
}
