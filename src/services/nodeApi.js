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
      value: "",
      stat: {},
    },
  };

  try {
    const buffer = await fsProm.readFile(filePath);
    result.file.value = buffer.toString("utf8");
    result.file.stat = await fsProm.stat(filePath);
    result.file.name = path.basename(filePath);
    result.file.path = filePath;
    result.file.ext = path.extname(filePath)
  } catch (e) {
    console.log(e);
    throw(e)
  }

  return result;
}

//save file
export async function saveFile({filePath = null, value = null}){
  console.log("SAVE FILE ARGS");
  console.log("filePath", filePath);
  console.log("value", value);
  const result = {
    success: false,
  };
  try {
    await fsProm.writeFile(filePath, value);
    result.success = true;
  } catch (e) {
    console.log(e)
    throw(e)
  }

  return result;
}