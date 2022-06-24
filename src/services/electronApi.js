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
  const response = await ipcRenderer.invoke("window/set-title", title);
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}

//notify electron main that the dom is correctly loaded
export async function reanderReady() {
  const response = await ipcRenderer.invoke("render/ready");
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}


export async function markdownParse(data = {content: null, path: null}) {
  const response = await ipcRenderer.invoke("markdown/parse", data)
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}




export async function getAppArgs(){
  const response = await ipcRenderer.invoke("app/getargs");
  if (response.error) {
    throw new ElectronError(response.errorMessage)
  }
  return response.data;
}