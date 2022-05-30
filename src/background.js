import { app, ipcMain, protocol, BrowserWindow, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const appMenu = require("./backend-modules/electronServices/app-menu");
const path = require("path");
const fs = require("fs/promises");

const APP_PATH = app.getPath("exe");
const APP_ROOT_PATH = path.dirname(APP_PATH);
const APP_RESOURCES_PATH = path.join(APP_ROOT_PATH, "resources");
let appTitle = "markwriter";
let appMessage = "";
let fileChanged = false;
const UNICODE_CICRLE = "\u25CF";

const isDev = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win;

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION, //process.env.ELECTRON_NODE_INTEGRATION //true
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION, //!process.env.ELECTRON_NODE_INTEGRATION //false
      enableRemoteModule: true,
      backgroundThrottling: false,
    },
  });

  win.on("close", async (e) => {
    if (!fileChanged) {
      return;
    }
    const choice = dialog.showMessageBoxSync(win, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm your actions",
      message: "File not saved! Do you really want to close the application?",
    });
    console.log("CHOICE: ", choice);
    if (choice > 0) e.preventDefault();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDev && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDev) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        /* app.quit(); */
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.handle("dom:loaded", async (event, jsonObj) => {
  appMenu.createTemplate(app, win, onClickMenuItem);
});

function onClickMenuItem(tree) {
  win.webContents.send("menu:action", tree);
}

ipcMain.handle("message:box", async (event, message) => {
  dialog.showMessageBoxSync(win, { message: message, type: "info" });
});

ipcMain.handle(
  "open:file",
  async (
    event,
    options = { filters: [{ name: "All Files", extensions: ["*"] }] }
  ) => {
    const result = {
      error: false,
      errorMessage: "",
      data: {
        canceled: false,
        file: {
          name: "",
          path: "",
          content: "",
          stat: {},
        },
      },
    };

    const dialogOptions = { ...options, properties: ["openFile"] };

    //get the path of the selected markdown file
    let response = await dialog.showOpenDialog(win, dialogOptions);

    //if the path does not exist, return
    if (response.canceled) {
      result.data.canceled = true;
      return result;
    }

    const filePath = response.filePaths[0];

    const stat = await fs.stat(filePath);
    const name = path.basename(filePath);
    const buffer = await fs.readFile(filePath);
    const content = buffer.toString("utf8");

    result.data.file.name = name;
    result.data.file.path = filePath;
    result.data.file.content = content;
    result.data.file.stat = stat;

    console.log("Electron handle > open:file > result:", result);
    return result;
  }
);

ipcMain.handle("save:file", async (event, file) => {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      success: false,
    },
  };

  try {
    await fs.writeFile(file.path, file.content);
    result.data.success = true;
  } catch (e) {
    result.error = true;
    result.errorMessage = e.message;
  }

  console.log("Electron handle > save:file > result:", result);
  return result;
});

ipcMain.handle(
  "saveas:file",
  async (event, data = { content: "", options: {} }) => {
    const result = {
      error: false,
      errorMessage: "",
      data: {
        canceled: false,
        file: {
          stat: {},
          name: "",
          path: "",
          content: "",
        },
      },
    };

    console.log("Electron handle > saveas:file > params:", data);

    const dialogOptions = { ...data.options };
    console.log("showSaveDialogSync > dialogOptions", dialogOptions);

    //get the path of the selected markdown file
    try {
      let dialogResponse = await dialog.showSaveDialog(win, dialogOptions);
      if (dialogResponse.canceled) {
        result.data.canceled = true;
        return result;
      }

      const content = data.content;
      const filePath = dialogResponse.filePath;
      await fs.writeFile(filePath, content);
      const name = path.basename(filePath);
      const stat = await fs.stat(filePath);

      result.data.file.name = name;
      result.data.file.content = content;
      result.data.file.path = filePath;
      result.data.file.stat = stat;
    } catch (e) {
      console.log("Error > electron hanlde > saveas:file", e);
      result.error = true;
      result.errorMessage = e.message;
    }

    console.log("Electron handle > save:file > result:", result);
    return result;
  }
);

ipcMain.handle("app:settitle", async (event, message) => {
  appMessage = message;
  const title = `${appTitle} ${appMessage ? "- " + appMessage : ""}`;
  win.setTitle(title);
});

ipcMain.handle("file:changed", (event, value) => {
  fileChanged = value;
  const title = `${value ? UNICODE_CICRLE : ""} ${appTitle} ${
    appMessage ? "- " + appMessage : ""
  }`;
  win.setTitle(title);
});
