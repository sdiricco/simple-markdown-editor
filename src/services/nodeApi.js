import fsProm from "fs/promises";
import fs from "fs";
import path from "path"

//check if path exsits
export async function exsistPath(p = "") {
  return fsProm
    .access(p, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

//read file and return an Object with more information
export async function readFile(filePath = "") {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      file: {
        name: "",
        ext: "",
        path: "",
        content: "",
        stat: {},
      },
    },
  };

  try {
    const buffer = await fsProm.readFile(filePath);
    result.data.file.content = buffer.toString("utf8");
    result.data.file.stat = await fsProm.stat(filePath);
    result.data.file.name = path.basename(filePath);
  } catch (e) {
    result.error = true;
    result.errorMessage = e.message
  };

  return result;
}
