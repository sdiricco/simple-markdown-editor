import { ipcRenderer } from "electron";
import { ElectronError } from "./errors";



//ELECTRON
//show electron dialog message
export async function showMessageBox(data = {options: {}}) {
  const response =  await ipcRenderer.invoke("electron/show-message-box", data);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

//show save dialog
export async function showSaveDialog(data = { options: {} }) {
  const response = await ipcRenderer.invoke("electron/show-save-dialog", data);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

export async function showOpenDialog(data = {options: {}}) {
  const response = await ipcRenderer.invoke("electron/show-open-dialog", data);
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




export async function getAppArgs(){
  const response = await ipcRenderer.invoke("app:getargs");
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}