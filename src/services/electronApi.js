import { ipcRenderer } from "electron";
import { ElectronError } from "./errors";

//ELECTRON
//show electron dialog message
export async function showMessage(message) {
  const response =  await ipcRenderer.invoke("message:box", message);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}
export async function showError(message) {
  const response = await ipcRenderer.invoke("error:box", message);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}
//save file to file system
export async function saveFile(file = { path: "", content: "" }) {
  const response = await ipcRenderer.invoke("save:file", file);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}
//save as file to file system
export async function saveDialog(data = { content: "", options: {} }) {
  const response = await ipcRenderer.invoke("saveas:file", data);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}
//set app title
export async function setTitle(title = "") {
  const response = await ipcRenderer.invoke("app:settitle", title);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}
//notify electron main that the edit file is changed
export async function fileChanged(value) {
  const response = ipcRenderer.invoke("file:changed", value);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}
//notify electron main that the dom is correctly loaded
export async function domLoaded() {
  const response = await ipcRenderer.invoke("dom:loaded");
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

export async function setMarkdownPath(p = '') {
  const response = await ipcRenderer.invoke("markdown:setpath", p)
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

export async function markdownParse(data = {content: ''}) {
  const response = await ipcRenderer.invoke("markdown:parse", data.content)
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

export async function openDialogFile(data = {options: {}}) {
  const response = await ipcRenderer.invoke("dialog:openfile", data);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

export async function readFile(data = {path: ''}) {
  const response = await ipcRenderer.invoke("file:read", data);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

export async function getAppArgs(){
  const response = await ipcRenderer.invoke("app:getargs");
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}