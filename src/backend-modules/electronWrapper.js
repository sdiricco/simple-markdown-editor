import { dialog } from "electron";

/* Show message box */
export async function showMessageBox(win, data = { options: {} }) {
  const result = {
    error: false,
    errorMessage: "",
    data: null,
  };

  try {
    result.data = await dialog.showMessageBox(win, data.options);
  } catch (e) {
    result.error = true;
    result.errorMessage = e.message;
  }

  return result;
}

/* Show save dialog */
export async function showSaveDialog(win, data = { options: {} }){
  const result = {
    error: false,
    errorMessage: "",
    data: null
  };

  try {
    result.data = await dialog.showSaveDialog(win, data.options);
  } catch (e) {
    result.error = true;
    result.errorMessage = e.message;
  }

  return result;
}

/* Show open dialog */
export async function showOpenDialog(win, data = { options: {} }){
  const result = {
    error: false,
    errorMessage: "",
    data: null
  };

  try {
    result.data = await dialog.showOpenDialog(win, data.options);
  } catch (e) {
    result.error = true;
    result.errorMessage = e.message;
  }

  return result;
}

/* Set browser title */
export async function setTitle(win, title){
  const result = {
    error: false,
    errorMessage: "",
    data: {
      success: true,
    },
  };
  try {
    win.setTitle(title);
  } catch (e) {
    e.error = true;
    e.message = e.message;
  }

  return result;
}
