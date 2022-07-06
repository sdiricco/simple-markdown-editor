import * as markdown from "./markdown";

export function parse(data = { path: null, value: null }) {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      value: null,
      toc: null
    },
  };
  try {
    console.log("exec markdown.parse()");
    result.data.value = markdown.parse(data);
    result.data.toc = markdown.toc(data.value);
  } catch (e) {
    console.log(e.message);
    result.error = true;
    result.errorMessage = e.message;
  }
  return result;
}