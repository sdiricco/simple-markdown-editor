import * as markdown from "./markdown";

export function parse(data = { content: null, path: null }) {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      content: null,
    },
  };
  try {
    console.log("exec markdown.parse()");
    console.log(data);
    result.data.content = markdown.parse(data);
    console.log("result parse", result.data.content);
  } catch (e) {
    console.log(e.message);
    result.error = true;
    result.errorMessage = e.message;
  }
  return result;
}
