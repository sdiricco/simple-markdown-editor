import { ipcMain } from "electron";
import * as appMenu  from "./backend-modules/appMenu";
import * as markdownWrapper from "./backend-modules/markdownWrapper"
import * as electronWrapper from "./backend-modules/electronWrapper";
import {Args} from "./backend-modules/ArgsWrapper";
import {WindowWrapper} from "./backend-modules/WindowWrapper";
import {AppWrapper} from "./backend-modules/AppWrapper";

const mainWindow = new WindowWrapper()
const app = new AppWrapper(mainWindow)
const args = new Args();

/*************************************************************************************/
/* APP API */
/*************************************************************************************/

ipcMain.handle("render/ready", async () => {
  appMenu.create(app, mainWindow.instance, onClickMenuItem);
  return args.get()
});

function onClickMenuItem(tree, data) {
  mainWindow.send(`menu/${data.options.id}`, {
    tree: tree,
    options: data.options,
  });
}

/*************************************************************************************/
/* WINDOW  API*/
/*************************************************************************************/

/* SET TITLE */
ipcMain.handle("window/set-title", async (_evt, data) => {
  return await electronWrapper.setTitle(mainWindow.instance, data)
});

/*************************************************************************************/
/* DIALOGs API */
/*************************************************************************************/

/* SHOW MESSAGE BOX */
ipcMain.handle("electron/show-message-box", async (_evt, data) => {
  return await electronWrapper.showMessageBox(mainWindow.instance, data);
});

/* SHOW SAVE DIALOG */
ipcMain.handle("electron/show-save-dialog", async (_evt, data) => {
  return await electronWrapper.showSaveDialog(mainWindow.instance, data);
});

/* SHOW OPEN DIALOG */
ipcMain.handle("electron/show-open-dialog", async (_evt, data) => {
  return await electronWrapper.showOpenDialog(mainWindow.instance, data)
});

/*************************************************************************************/
/* MARKDOWN API */
/*************************************************************************************/

/* MARKDOWN PARSE */
ipcMain.handle("markdown/parse", (_evt, data) => {
  return markdownWrapper.parse(data)
});

