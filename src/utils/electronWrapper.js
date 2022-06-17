import * as electronApi from "../services/electronApi";

export async function showMessageQuestion(message = '') {
  const result = {
    response: {
      ok: false,
      cancel: false
    },
    checkboxChecked: false
  };
  try {
    const dialogOptions = {
      title: 'Info',
      message: message,
      type: 'question',
      buttons: ['ok', 'cancel']
    }

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

export async function showSaveDialog(){
  let result = {
    canceled:null,
    filePath: '',
    bookmark: ''
  };
  try {
    const dialogOptions = {
      defaultPath: 'Document.md',
      filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
    }
    result = await electronApi.saveDialog({options: dialogOptions})
  } catch (e) {
    console.log("Error in showSaveDialog", e);
    throw(e)
  }
  console.log("result", result);
  return result
}

export async function showErrorBox(message = ''){
  try {
    const dialogOptions = {
      title: 'Error',
      message: message,
      type: 'error',
    }
    await electronApi.showMessage({options: dialogOptions});
  } catch (e) {
    console.log("Error in showMessageQuestion", e);
    throw(e)
  }
}
