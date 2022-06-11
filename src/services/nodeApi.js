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
    file: {
      name: "",
      ext: "",
      path: "",
      content: "",
      stat: {},
    },
  };

  try {
    const buffer = await fsProm.readFile(filePath);
    result.file.content = buffer.toString("utf8");
    result.file.stat = await fsProm.stat(filePath);
    result.file.name = path.basename(filePath);
  } catch (e) {
    console.log(e);
    throw(e)
  }

  return result;
}
