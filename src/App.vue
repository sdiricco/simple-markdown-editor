<template>
  <v-app>
    <v-main>
      <div class="ma-0 pa-0 main-container">
        <div id="editor" v-if="viewEditor || viewPreview">
          <textarea
            v-if="viewEditor"
            spellcheck="false"
            v-model="editFile.content"
            :style="{ width: widthTextarea }"
          ></textarea>
          <div
            v-if="viewPreview"
            :style="{ width: widthPreview }"
            id="preview"
            class="markdown-body"
            v-html="editFile.html"
          ></div>
        </div>
        <article class="empty" v-if="!viewPreview && !viewEditor">
          <pre>
            <h2>Nothing to see</h2>
            <p>From the View menu select Editor or Preview</p>
          </pre>
        </article>
      </div>
      <!-- Hotkeys -->
      <v-dialog v-model="showHotkeys" max-width="600">
        <ListHotkeysVue />
      </v-dialog>

      <v-dialog v-model="loadingHtml" persistent width="200">
        <v-card color="primary" dark>
          <v-card-text class="pa-4">
            Building..
            <v-progress-linear
              class="pa-4"
              indeterminate
              color="white"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- Message dialog -->
      <v-snackbar
        :width="messageSnackbar.width"
        :max-width="messageSnackbar.maxWidth"
        top
        outlined
        color="primary"
        v-model="messageSnackbar.active"
        :timeout="messageSnackbar.timeout"
      >
        <div class="d-flex align-center justify-center pa-0 ma-0">
          <h4 class="pa-0 ma-0">{{ messageSnackbar.message }}</h4>
        </div>
      </v-snackbar>
      <!-- Saving dialog -->
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
import {
  electronOpenFile,
  electronFileChanged,
  electronSaveDialog,
  electronSaveFile,
  electronSetTitle,
  electronDomLoaded,
  electronMarkdownParse,
  electronSetMarkdownPath,
  electronShowError,
} from "./services/electronApi";
import ListHotkeysVue from "./components/ListHotkeys.vue";

export default {
  name: "App",
  components: { ListHotkeysVue },
  data() {
    return {
      buildOnSave: true,
      showHotkeys: false,
      loadingHtml: false,
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
        timeout: 500,
        width: "50px",
        maxWidth: "50px",
      },
      messageSnackbar: {
        active: false,
        timeout: 1500,
        width: "50px",
        maxWidth: "50px",
        message: "",
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
      this.editFile.modified = this.editFile.content !== this.file.content;
    },
    fileChanged: async function (value) {
      await electronFileChanged(value);
    },
    filePath: async function (value) {
      await electronSetMarkdownPath(value);
    },
    viewPreview: function (value) {
      this.widthTextarea = value ? "50%" : "100%";
      this.messageSnackbar.active = true;
      this.messageSnackbar.message = value
        ? "Enable preview"
        : "Disable preview";
    },
    viewEditor: function (value) {
      this.widthPreview = value ? "50%" : "100%";
      this.messageSnackbar.active = true;
      this.messageSnackbar.message = value ? "Enable editor" : "Disable editor";
    },
  },
  methods: {
    //GENERIC HANDLERS
    //Build markdown
    async buildFileHandler() {
      if (this.loadingHtml) {
        return;
      }
      this.loadingHtml = true;
      const response = await electronMarkdownParse(this.editFile.content);
      this.editFile.html = response.data.html;
      this.loadingHtml = false;
    },
    //Save as file handler
    async saveAsFileHandler() {
      let response = await electronSaveDialog({
        content: this.editFile.content,
        options: this.electron.saveDialogOptions,
      });
      console.log("Response > electronSaveDialog()");
      if (response.data.canceled) {
        return;
      }

      const additionalFields = {
        modified: false,
        html: "",
      };
      this.file = response.data.file;
      this.editFile = { ...this.file, ...additionalFields };

      await electronSetMarkdownPath(this.editFile.path);
      await this.buildFileHandler();

      this.editFile.changed = false;

      await electronSetTitle(this.file.path);
    },
    //Save file handler
    async saveFileHandler() {
      if (this.snackbar.active) {
        return;
      }
      this.snackbar.active = true;
      await electronSaveFile({
        path: this.editFile.path,
        content: this.editFile.content,
      });

      this.file.content = this.editFile.content;
      if (this.buildOnSave) {
        await this.buildFileHandler();
      }
      this.editFile.modified = false;


      console.log("Response > electronSaveFile()");
    },
    //Open file handler
    async openFileHandler() {
      let response = null;
      if (this.editFile.modified) {
        response = await electronShowError(
          "File modified. Are you sure to open a new file and discard all changes?"
        );
        if (response.data.canceled) {
          return;
        }
      }
      response = await electronOpenFile(this.electron.openDialogOptions);
      console.log("Response > electronOpenFile()");
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

      await electronSetMarkdownPath(this.editFile.path);
      await this.buildFileHandler();

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
      console.log("View editor", options.checked);
      this.viewEditor = options.checked;
    },
    //On click menu view preview
    menuOnViewPreview(options) {
      console.log("View preview", options.checked);
      this.viewPreview = options.checked;
    },
    async menuOnBuild() {
      this.buildFileHandler();
    },
    menuOnHotkeys() {
      this.showHotkeys = true;
    },
    menuOnBuildOnSave(options){
      console.log("View editor", options.checked);
      this.buildOnSave = options.checked;
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
            case "Build":
              await this.menuOnBuild(options);
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
        case "Settings":
          switch (tree[1]) {
            case "Build on save":
              this.menuOnBuildOnSave(options);
              break;
            default:
              break;
          }
          break;
        case "Help":
          switch (tree[1]) {
            case "Hotkeys":
              this.menuOnHotkeys(options);
              break;
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

.main-container {
  height: 100%;
}
</style>
