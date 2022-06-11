import { ipcRenderer } from "electron";

//ELECTRON
//show electron dialog message
export async function showMessage(message) {
  return await ipcRenderer.invoke("message:box", message);
}
export async function showError(message) {
  return await ipcRenderer.invoke("error:box", message);
}
//save file to file system
export async function saveFile(file = { path: "", content: "" }) {
  return await ipcRenderer.invoke("save:file", file);
}
//save as file to file system
export async function saveDialog(data = { content: "", options: {} }) {
  return await ipcRenderer.invoke("saveas:file", data);
}
//set app title
export async function setTitle(title = "") {
  return await ipcRenderer.invoke("app:settitle", title);
}
//notify electron main that the edit file is changed
export async function fileChanged(value) {
  return await ipcRenderer.invoke("file:changed", value);
}
//notify electron main that the dom is correctly loaded
export async function domLoaded() {
  return await ipcRenderer.invoke("dom:loaded");
}

export async function setMarkdownPath(p = '') {
  return await ipcRenderer.invoke("markdown:setpath", p)
}

export async function markdownParse(data = '') {
  return await ipcRenderer.invoke("markdown:parse", data)
}

export async function openDialogFile(data = {options: {}}) {
  return await ipcRenderer.invoke("dialog:openfile", data);
}

export async function readFile(data = {path: ''}) {
  return await ipcRenderer.invoke("file:read", data);
}

export async function getAppArgs(){
  return await ipcRenderer.invoke("app:getargs");
}