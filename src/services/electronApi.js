import { ipcRenderer } from "electron";

//ELECTRON
//show electron dialog message
export async function electronShowMessage(message) {
  return await ipcRenderer.invoke("message:box", message);
}
export async function electronShowError(message) {
  return await ipcRenderer.invoke("error:box", message);
}
//open file from electron dialog
export async function electronOpenFile(options = {}) {
  return await ipcRenderer.invoke("open:file", options);
}
//save file to file system
export async function electronSaveFile(file = { path: "", content: "" }) {
  return await ipcRenderer.invoke("save:file", file);
}
//save as file to file system
export async function electronSaveDialog(data = { content: "", options: {} }) {
  return await ipcRenderer.invoke("saveas:file", data);
}
//set app title
export async function electronSetTitle(title = "") {
  return await ipcRenderer.invoke("app:settitle", title);
}
//notify electron main that the edit file is changed
export async function electronFileChanged(value) {
  return await ipcRenderer.invoke("file:changed", value);
}
//notify electron main that the dom is correctly loaded
export async function electronDomLoaded(){
    return await ipcRenderer.invoke("dom:loaded");
}

export async function electronSetMarkdownPath(p = ''){
  return await ipcRenderer.invoke("markdown:setpath", p)
}

export async function electronMarkdownParse(data = ''){
  return await ipcRenderer.invoke("markdown:parse", data)
}
