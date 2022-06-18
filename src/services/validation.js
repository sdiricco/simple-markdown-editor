import * as nodeApi from "./nodeApi";
import { ValidationError } from "./errors";
import path from "path"

export async function validateArgs(
  args = [],
  { multipleArgs = false, type = "path" } = {}
) {
  let result = {
    data: {
      success: true,
      validation: true,
    },
  };
  //if the app was opened wit multiple files
  if (args.length > 1 && !multipleArgs) {
    throw new ValidationError("multiple args not permitted", {
      details: `args: ${args.length}, ${args.join(", ")}`,
    });
  }
  if (type !== "path") {
    throw new ValidationError(`Only type = path is implemented`);
  }
  if (type === "path") {
    for (const p of args) {
      const validPath = await nodeApi.exsistPath(p);
      if (!validPath) {
        throw new ValidationError(`${p} is not a valid path`);
      }
      const validMarkdown = path.extname(p) !== '.md' || path.extname(p) !== '.markdown';
      console.log("validMarkdown", validMarkdown);
      if (!validMarkdown) {
        throw new ValidationError(`${p} is not a markdown file`);
      }
    }
  }
  return result;
}

export async function validateFile(filePath = "") {
  let result = {
    data: {
      success: true,
      validation: true,
    },
  };
  const validPath = await nodeApi.exsistPath(filePath);
  if (!validPath) {
    throw new ValidationError(`${filePath} is not a valid path`);
  }
  return result
}

export async function validateFiles(
  filePaths = [],
  { multipleFile = false } = {}
) {
  let result = {
    data: {
      success: true,
      validation: true,
    },
  };
  if (filePaths.length > 1 && !multipleFile) {
    throw new ValidationError("multiple files not permitted", {
      details: `files: ${filePaths.length}, ${filePaths.join(", ")}`,
    });
  }
  for (const p of filePaths) {
    const validPath = await nodeApi.exsistPath(p);
    if (!validPath) {
      throw new ValidationError(`${p} is not a valid path`);
    }
  }
  return result;
}
