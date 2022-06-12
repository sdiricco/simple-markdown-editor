import * as electronApi from "../services/electronApi";
import { electron } from "../config/electronOptions";

export async function showMessageQuestion(message = '') {
  const result = {
    response: {
      ok: false,
      cancel: false
    },
    checkboxChecked: false
  };
  try {
    const dialogOptions = electron.dialog.options.showMessageBox;

    dialogOptions.buttons = ['ok', 'cancel'];
    dialogOptions.title = 'Info';
    dialogOptions.message = message;
    dialogOptions.type = 'question';

    const electronResult = await electronApi.showMessage({options: dialogOptions});
    const indexButton = electronResult.response;
    const button = dialogOptions.buttons[indexButton];

    result.response[button] = true;
  } catch (e) {
    console.log("Error in showMessageQuestion", e);
    throw(e)
  }
  return result;

}
