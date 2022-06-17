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
  langPrefix: "hljs language-", // highlight.js css expects a top-level 'hljs' class.
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

marked.use({ renderer });

/**
 *
 * @param {String} content markdown input
 * @returns {String} html content
 */
export function markdownToHtml(content = "") {
  console.log("Parsing markdown");
  return marked.parse(content);
}

/**
 *
 * @param {String} p
 * @returns {void}
 */
export function setFilePath(p = "") {
  console.log("path set to", p);
  basePath = path.dirname(p);
}
