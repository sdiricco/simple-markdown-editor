<template>
  <v-app>
    <v-main>
      <div class="ma-0 pa-0 main-container">
        <div id="editor" v-if="viewEditor || viewPreview">
          <textarea
            v-if="viewEditor"
            spellcheck="false"
            v-model="editFile.content"
            :style="{width: widthTextarea}"
          ></textarea>
          <div :style="{width: widthPreview}" v-if="viewPreview" id="preview" class="markdown-body" v-html="editFile.html"></div>
        </div>
        <article class="empty" v-if="!viewPreview && !viewEditor">
          <pre>
            <h2>Nothing to see</h2>
            <p>From the View menu select Editor or Preview</p>
          </pre>
        </article>
      </div>
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
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import { markdownToHtml, setFilePath } from "./services/markdown";
import {
  electronOpenFile,
  electronFileChanged,
  electronSaveDialog,
  electronSaveFile,
  electronSetTitle,
  electronDomLoaded,
} from "./services/electronApi";

export default {
  name: "App",
  components: {},
  data() {
    return {
      timerDebounce: null,
      viewEditor: true,
      viewPreview: true,
      widthTextarea: "50%",
      widthPreview: "50%",
      file: {
        name: "",
        content: "",
        path: "",
        stat: {},
      },
      editFile: {
        name: "",
        content: "",
        html: "",
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
    filePath() {
      return this.editFile.path;
    },
    fileContent() {
      return this.editFile.content;
    },
    fileChanged() {
      return this.editFile.modified;
    },
  },
  watch: {
    fileContent: function () {
      if (this.timerDebounce) {
        return;
      }
      this.timerDebounce = setTimeout(()=>{
        this.editFile.html = markdownToHtml(this.editFile.content);
        this.editFile.modified = this.file.content !== this.editFile.content;
        clearTimeout(this.timerDebounce)
        this.timerDebounce = null;
      }, 500)

    },
    fileChanged: async function (value) {
      console.log('file changed');
      await electronFileChanged(value);
    },
    filePath: function (value) {
      setFilePath(value);
    },
    viewPreview: function(value) {
      this.widthTextarea = value ? "50%" : "100%"
    },
    viewEditor: function(value) {
      this.widthPreview = value ? "50%" : "100%"
    }
  },
  methods: {
    //GENERIC HANDLERS
    //Save as file handler
    async saveAsFileHandler() {
      const response = await electronSaveDialog({
        content: this.editFile.content,
        options: this.electron.saveDialogOptions,
      });
      console.log("Response > electronSaveDialog()", response);
      if (response.data.canceled) {
        return;
      }

      const additionalFields = {
        modified: false,
        html: "",
      };
      this.file = response.data.file;
      this.editFile = { ...this.file, ...additionalFields };


      setFilePath(this.editFile.path);
      this.editFile.html = markdownToHtml(this.editFile.content);
      this.editFile.changed = false;

      await electronSetTitle(this.file.path);
    },
    //Save file handler
    async saveFileHandler() {
      const response = await electronSaveFile({
        path: this.editFile.path,
        content: this.editFile.content,
      });

      this.editFile.modified = false;
      console.log("Response > electronSaveFile()", response);
    },
    //Open file handler
    async openFileHandler() {
      const response = await electronOpenFile(this.electron.openDialogOptions);

      console.log("Response > electronOpenFile()", response);

      //check if canceled
      if (response.data.canceled) {
        return;
      }

      const additionalFields = {
        modified: false,
        html: "",
      };
      this.file = response.data.file;
      this.editFile = { ...this.file, ...additionalFields };

      console.log("this.editFile", this.editFile);


      setFilePath(this.editFile.path);
      this.editFile.html = markdownToHtml(this.editFile.content);
      this.editFile.changed = false;

      await electronSetTitle(this.file.path);
    },
    //MENU ACTIONS HANDLER
    //Open
    async menuOnOpen() {
      console.log("Open");
      await this.openFileHandler();
    },
    //Save
    async menuOnSave() {
      console.log("Save");
      //if not modified return
      if (!this.editFile.modified) {
        return;
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
    async menuOnSaveAs() {
      console.log("Save as");
      await this.saveAsFileHandler();
    },
    //On click menu view editor
    menuOnViewEditor(options) {
      const checked = options.checked;
      console.log("View editor", checked);
      this.viewEditor = checked;
    },
    //On click menu view preview
    menuOnViewPreview(options) {
      const checked = options.checked;
      console.log("View preview", checked);
      this.viewPreview = checked;
    },
    async onClickMenuItem(_event, data = { tree: [], options: {} }) {
      const tree = data.tree;
      const options = data.options;
      switch (tree[0]) {
        case "File":
          switch (tree[1]) {
            case "Open":
              await this.menuOnOpen(options);
              break;
            case "Save":
              await this.menuOnSave(options);
              break;
            case "Save as..":
              await this.menuOnSaveAs(options);
              break;
            default:
              break;
          }
          break;
        case "View":
          switch (tree[1]) {
            case "Editor":
              this.menuOnViewEditor(options);
              break;
            case "Preview":
              this.menuOnViewPreview(options);
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
    await electronDomLoaded();
    ipcRenderer.on("menu:action", this.onClickMenuItem);
  },
};
</script>

<style>
html,
body,
#editor {
  margin: 0;
  height: 100%;
}

html {
  overflow-y: hidden !important;
}

textarea {
  display: inline-block;
  width: 50%;
  height: 100vh;
  vertical-align: top;
  box-sizing: border-box;
  padding: 20px;
  overflow-y: auto;
}
#editor div {
  display: inline-block;
  width: 50%;
  height: 100vh;
  vertical-align: top;
  box-sizing: border-box;
  padding: 20px;
  overflow-y: auto;
}

#editor textarea {
  border: none;
  border-right: 1px solid #ccc;
  resize: none;
  outline: none;
  background-color: #f6f6f6;
  font-size: 14px;
  font-family: "Monaco", courier, monospace;
  padding: 20px;
  height: 100vh;
}

code {
  color: #f66;
}

.empty {
  height: 100%;
  display: grid;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.main-container{
  height: 100%;
}
</style>
