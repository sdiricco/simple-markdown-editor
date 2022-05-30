<template>
  <v-app>
    <v-main>
      <v-container class="ma-0 pa-0" fluid id="main-container">
        <textarea id="editor" v-model="editFile.content"></textarea>
        <article class="markdown-body" v-html="markdownToHtml"></article>
        <v-snackbar
          :width="snackbar.width"
          :max-width="snackbar.maxWidth"
          bottom
          text
          outlined
          color="primary"
          v-model="snackbar.active"
          :timeout="snackbar.timeout"
        >
          <div class="d-flex align-center justify-space-between">
            <h3>Saving...</h3>
            <v-progress-circular
              size="24"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
const { ipcRenderer } = require("electron");
import { marked } from "marked";

export default {
  name: "App",
  components: {},
  data() {
    return {
      file: {
        name: "",
        content: "",
        path: "",
        stat: {},
      },
      editFile: {
        name: "",
        content: "",
        path: "",
        stat: {},
        modified: false,
      },
      snackbar: {
        active: false,
        timeout: 1000,
        width: "50px",
        maxWidth: "50px",
      },
      electron: {
        openDialogOptions: {
          filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
        },
        saveDialogOptions: {
          defaultPath: "Document.md",
          filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
        },
      },
    };
  },
  computed: {
    markdownToHtml() {
      return marked(this.editFile.content);
    },
    fileContent(){
      return this.editFile.content;
    },
    fileChanged(){
      return this.editFile.modified;
    }
  },
  watch: {
    fileContent: function(){
      this.editFile.modified = this.file.content !== this.editFile.content;
    },
    fileChanged: function(value){
      this.electronFileChanged(value)
    }
  },
  methods: {
    //ELECTRON
    //show electron dialog message
    async electronShowMessage() {
      await ipcRenderer.invoke("message:box", this.message);
    },
    //open file from electron dialog
    async electronOpenFile(options = {}) {
      return await ipcRenderer.invoke("open:file", options);
    },
    //save file to file system
    async electronSaveFile(file = { path: "", content: "" }) {
      return await ipcRenderer.invoke("save:file", file);
    },
    //save as file to file system
    async electronSaveDialog(data = { content: "", options: {} }) {
      return await ipcRenderer.invoke("saveas:file", data);
    },
    //set app title
    async electronSetTitle(title = "") {
      return await ipcRenderer.invoke("app:settitle", title);
    },
    //notify electron main that the edit file is changed
    async electronFileChanged(value){
      return await ipcRenderer.invoke("file:changed", value)
    },
    //GENERIC HANDLERS
    //Save as file handler
    async saveAsFileHandler() {
      const response = await this.electronSaveDialog({
        content: this.editFile.content,
        options: this.electron.saveDialogOptions,
      });
      console.log("Response > electronSaveDialog()", response);
      if (response.data.canceled) {
        return;
      }

      this.file = response.data.file;
      this.editFile = {...this.file, modified: false}

      await this.electronSetTitle(this.file.path);
    },
    //Save file handler
    async saveFileHandler() {
      const response = await this.electronSaveFile({
        path: this.editFile.path,
        content: this.editFile.content,
      });

      this.editFile.modified = false;
      console.log("Response > electronSaveFile()", response);
    },
    //Open file handler
    async openFileHandler(){
      const response = await this.electronOpenFile(
        this.electron.openDialogOptions
      );

      console.log("Response > electronOpenFile()", response);

      //check if canceled
      if (response.data.canceled) {
        return;
      }

      this.file = response.data.file;
      this.editFile = {...this.file, modified: false}

      await this.electronSetTitle(this.file.path);
    },
    //MENU ACTIONS HANDLER
    //Open
    async menuOnOpen() {
      console.log("Open");
      await this.openFileHandler();
    },
    //Save
    async menuSave() {
      console.log("Save");
      //if not modified return
      if (!this.editFile.modified) {
        return
      }
      //if no files are open, open save dialog
      if (this.file.path === "") {
        await this.saveAsFileHandler();
      }
      //if the file is open, simply save
      else {
        this.snackbar.active = true;
        await this.saveFileHandler();
      }
    },
    //Save as
    async menuSaveAs() {
      console.log("Save as");
      await this.saveAsFileHandler();
    },
    async onClickMenuItem(event, tree) {
      switch (tree[0]) {
        case "File":
          switch (tree[1]) {
            case "Open":
              await this.menuOnOpen();
              break;
            case "Save":
              await this.menuSave();
              break;
            case "Save as..":
              await this.menuSaveAs();
              break;
            default:
              break;
          }
          break;
        case "Help":
          switch (tree[1]) {
            case "Learn More":
              console.log("Learn More");
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    async onCloseApp() {
      console.log('close the app');
      await this.electronCloseApp()
    },
  },
  async mounted() {
    await ipcRenderer.invoke("dom:loaded");
    ipcRenderer.on("menu:action", this.onClickMenuItem);
    ipcRenderer.on("app:before-quit", this.onCloseApp);
  },
};
</script>

<style>
html,
body,
#main-container {
  margin: 0;
  height: 100%;
}

#editor,
#main-container article {
  display: inline-block;
  width: 49%;
  height: 100%;
  vertical-align: top;
  box-sizing: border-box;
  padding: 20px;
}

#editor {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
}
</style>
