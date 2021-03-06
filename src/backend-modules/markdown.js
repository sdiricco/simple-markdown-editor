import { marked } from "marked";
import hljs from "highlight.js";
import { nativeImage } from "electron";
import path from "path";
import markdownToc from 'markdown-toc-unlazy'

function isUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

let basePath = "";
let headings = []

const renderer = {
  image(href = "", title = "", text = "") {
    const imagePath = path.join(basePath, href) || "";
    const imageNative = nativeImage.createFromPath(imagePath);
    return `<img src="${imageNative.toDataURL()}" alt="${text}">`;
  },
  link(href = "", title = "", text = "") {
    return `<a href="${href}" alt="${text}" ${isUrl(href) ? "target='_blank'" : ''} >${text}</a>`;
  },
  heading(text, level){
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    const duplicateIndex = headings.map(({ text }) => text).indexOf(escapedText)
    let duplicateText = undefined
    if (duplicateIndex === -1) {
      headings.push({
        text: escapedText,
        count: 0
      })
    } else {
      headings[duplicateIndex].count++
      duplicateText = `${escapedText}-${headings[duplicateIndex].count}`
    }
    const id = `${duplicateText || escapedText}`
    return `<h${level} name="${id}" id="${id}">${text}</h${level}>\n`
  }
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
    headings = [];
    return marked.parse(data.value);
  } catch (e) {
    throw(e)
  }
}

export function toc(data){
  return markdownToc(data).json
}

