import { marked } from "marked";
import hljs from "highlight.js";
import { nativeImage } from "electron";
import path from "path";

let basePath = "";

const renderer = {
  image(href = "", title = "", text = "") {
    const imagePath = path.join(basePath, href) || "";
    const imageNative = nativeImage.createFromPath(imagePath);
    return `<img src="${imageNative.toDataURL()}" alt="${text}">`;
  },
  link(href = "", title = "", text = "") {
    return `<a href="${href}" alt="${text}" target="_blank">${text}</a>`;
  },
};

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: "hljs language-",
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

marked.use({ renderer });


export function parse(data = {value: null, path: null}) {
  try {
    if (data.path && data.path !== '') {
      basePath = path.dirname(data.path)
    }
    return marked.parse(data.value);
  } catch (e) {
    throw(e)
  }

}
