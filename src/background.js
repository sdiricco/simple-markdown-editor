import { app, ipcMain, protocol, BrowserWindow, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { markdownToHtml, setFilePath } from "./services/markdown";
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

let appArgs = "";

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
app.on("ready", async (event, info) => {
  if (isDev && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  } else {
    //get args only in production mode
    appArgs = process.argv;
  }
  createWindow();
});

//File association
app.on("open-file", async (event, path) => {
  event.preventDefault();
  fileOpen.pass = true;
  fileOpen.path = path;
  fileOpen.argv = process.argv;
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

ipcMain.handle("dom:loaded", async () => {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      success: true,
      info: "created menu template",
    },
  };
  appMenu.createTemplate(app, win, onClickMenuItem);
  return result;
});

function onClickMenuItem(tree, options) {
  const optionsFiletered = {
    label: options.menuItem.label || null,
    type: options.menuItem.type || null,
    checked: options.menuItem.checked || null,
    role: options.menuItem.role || null,
    accelerator: options.menuItem.accelerator || null,
    sublabel: options.menuItem.sublabel || null,
    toolTip: options.menuItem.toolTip || null,
    enabled: options.menuItem.enabled || null,
    visible: options.menuItem.visible || null,
    acceleratorWorksWhenHidden:
      options.menuItem.acceleratorWorksWhenHidden || null,
    registerAccelerator: options.menuItem.registerAccelerator || null,
    commandId: options.menuItem.commandId || null,
  };
  win.webContents.send("menu:action", {
    tree: tree,
    options: optionsFiletered,
  });
}

/*************************************************************************************/
/* DIALOGs */
/*************************************************************************************/

/* SHOW MESSAGE BOX */
ipcMain.handle(
  "electron/show-message-box",
  async (_event, data = { options: {} }) => {
    const result = {
      error: false,
      errorMessage: "",
      data: null
    };

    try {
      result.data = await dialog.showMessageBox(win, data.options);
    } catch (e) {
      result.error = true;
      result.errorMessage = e.message;
    }
    
    return result;
  }
);

/* SHOW SAVE DIALOG */
ipcMain.handle(
  "electron/show-save-dialog",
  async (_event, data = { options: {} }) => {
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
);

/* SHOW OPEN DIALOG */
ipcMain.handle(
  "electron/show-open-dialog",
  async (_event, data = { options: {} }) => {
    const result = {
      error: false,
      errorMessage: "",
      data: null,
    }

    try {
      result.data = await dialog.showOpenDialog(win, data.options);
    } catch (e) {
      result.error = true;
      result.errorMessage = e.message;
    }

    return result;
  }
);

ipcMain.handle("app:settitle", async (event, message) => {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      success: true,
    },
  };
  try {
    appMessage = message;
    const title = `${appTitle} ${appMessage ? "- " + appMessage : ""}`;
    win.setTitle(title);
  } catch (e) {
    e.error = true;
    e.message = e.message;
  }

  return result;
});

ipcMain.handle("file:changed", (event, value) => {
  fileChanged = value;
  const title = `${value ? UNICODE_CICRLE : ""} ${appTitle} ${
    appMessage ? "- " + appMessage : ""
  }`;
  win.setTitle(title);
});

ipcMain.handle("markdown:parse", (event, data) => {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      content: "",
    },
  };

  result.data.content = markdownToHtml(data);
  return result;
});

ipcMain.handle("markdown:setpath", (event, p) => {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      path: "",
    },
  };

  setFilePath(p);
  result.data.path = p;

  return result;
});

ipcMain.handle("file:read", async (evt, data) => {
  console.log("Electron handle > file:read > data:", data);
  const result = {
    error: false,
    errorMessage: "",
    data: {
      file: {
        name: "",
        path: "",
        content: "",
        stat: {},
      },
    },
  };

  try {
    const filePath = data.path;

    const stat = await fs.stat(filePath);
    const name = path.basename(filePath);
    const buffer = await fs.readFile(filePath);
    const content = buffer.toString("utf8");

    result.data.file.name = name;
    result.data.file.path = filePath;
    result.data.file.content = content;
    result.data.file.stat = stat;
  } catch (e) {
    result.error = true;
    result.errorMessage = e.message;
  }

  return result;
});

ipcMain.handle("app:getargs", async () => {
  const result = {
    error: false,
    errorMessage: "",
    data: {
      args: appArgs,
    },
  };
  return result;
});
