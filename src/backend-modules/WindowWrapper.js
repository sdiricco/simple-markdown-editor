import EventEmitter from "eventemitter3";
import { BrowserWindow, shell } from "electron";
import * as path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

export class WindowWrapper extends EventEmitter {
  constructor() {
    super();
    this.devServer = process.env.WEBPACK_DEV_SERVER_URL;
    this.electronNodeIntegration = process.env.ELECTRON_NODE_INTEGRATION;
    this.instance = undefined;
    this.onClose = this.onClose.bind(this);
  }
  onClose() {
    console.log("on close");
  }

  async loadWindow() {
    if (this.devServer) {
      await this.loadDevWindow();
      return;
    }
    this.loadProdWindow();
  }

  openExternalHandler(){
    this.instance.webContents.setWindowOpenHandler(({ url }) => {
      console.log("url", url);
      if (url.startsWith("http://localhost")) {
        return {action: "allow"};
      }
      shell.openExternal(url)
      return { action: 'deny' }
    })
  }

  async loadProdWindow() {
    createProtocol("app");
    this.instance.loadURL("app://./index.html");
  }

  async loadDevWindow() {
    await this.instance.loadURL(this.devServer);
    this.instance.webContents.openDevTools();
  }
  async create() {
    this.instance = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      minWidth: 600,
      minHeight: 400,
      icon: path.join(__dirname, "favicon.svg"),
      webPreferences: {
        nodeIntegration: this.electronNodeIntegration,
        contextIsolation: !this.electronNodeIntegration,
        enableRemoteModule: true,
        backgroundThrottling: false,
      },
    });
    this.instance.on("close", this.onClose);
    this.instance.maximize();
    this.instance.show();
    this.loadWindow();
    this.openExternalHandler();
  }

  send(channel, payload) {
    this.instance.webContents.send(channel, payload);
  }
}
