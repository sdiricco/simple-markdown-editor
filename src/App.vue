<template>
  <v-app>
    <v-main>
      <v-container class="text" fluid id="main-container">
        <textarea id="editor" v-model="file.content"></textarea>
        <article class="markdown-body" v-html="markdownToHtml"></article>
        <v-snackbar text outlined color="primary" v-model="snackbar.active" :timeout="snackbar.timeout">
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
      snackbar: {
        active: false,
        timeout: 1000,
      },
    };
  },
  computed: {
    markdownToHtml() {
      return marked(this.file.content);
    },
  },
  methods: {
    //ELECTRON
    //show electron dialog message
    async showMessage() {
      await ipcRenderer.invoke("message:box", this.message);
    },
    //open file from electron dialog
    async openFile(options) {
      return await ipcRenderer.invoke("open:file", options);
    },
    async saveFile(file = { path: "", content: "" }) {
      return await ipcRenderer.invoke("save:file", file);
    },
    async menuOnOpen() {
      console.log("Open");
      const options = {
        filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      };
      const response = await this.openFile(options);
      console.log("Response > openFile()", response);
      if (!response.data.files.length) {
        return;
      }
      this.file = response.data.files[0];
    },
    async menuSave() {
      console.log("Save");
      if (this.file.path === '') {
        return;
      }
      this.snackbar.active = true;
      const response = await this.saveFile({ path: this.file.path, content: this.file.content });
      console.log("Response > saveFile()", response);
    },
    async onClickMenuItem(event, tree) {
      switch (tree[0]) {
        case "File":
          switch (tree[1]) {
            case "Open":
              await this.menuOnOpen();
              break;
            case "Save":
              console.log("Save");
              await this.menuSave();
              break;
            case "Save as..":
              console.log("Save as..");
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
  },
  async mounted() {
    await ipcRenderer.invoke("dom:loaded");
    ipcRenderer.on("menu:action", this.onClickMenuItem);
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
  padding: 0 20px;
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
