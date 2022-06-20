import * as electronApi from "../services/electronApi";
import { dialog } from "../config/electronOptions";

//DIALOGS
//Show message question
export async function showMessageQuestion(message = "") {
  const result = dialog.showMessageBox.response;

  try {
    const dialogOptions = {
      ...dialog.showMessageBox.options,
      message: message,
    };
    const electronResult = await electronApi.showMessageBox({
      options: dialogOptions,
    });
    const indexButton = electronResult.response;
    const button = dialogOptions.buttons[indexButton];
    result.response[button] = true;
  } catch (e) {
    console.log("Error in showMessageQuestion", e);
    throw e;
  }

  return result;
}

//Show error box
export async function showErrorBox(message = "") {
  const result = dialog.showErrorBox.response;

  try {
    const dialogOptions = { ...dialog.showErrorBox.options, message: message };
    await electronApi.showMessageBox({ options: dialogOptions });
  } catch (e) {
    console.log("Error in showMessageQuestion", e);
    throw e;
  }

  return result;
}

//Show save dialog
export async function showSaveDialog() {
  let result = dialog.showSaveDialog.response;

  try {
    const dialogOptions = dialog.showSaveDialog.options;
    result = await electronApi.showSaveDialog({ options: dialogOptions });
  } catch (e) {
    console.log("Error in showSaveDialog", e);
    throw e;
  }

  return result;
}

//Show open dialog
export async function showOpenDialog() {
  let result = dialog.showOpenDialog.response;

  try {
    const dialogOptions = dialog.showOpenDialog.options;
    const r = await electronApi.showOpenDialog({ options: dialogOptions });
    result = {
      canceled: r.canceled,
      filePath: r.filePaths[0],
      bookmark: r.bookmark,
    };
  } catch (e) {
    console.log("Error in showSaveDialog", e);
    throw e;
  }

  return result;
}
