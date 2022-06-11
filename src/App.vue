<template>
  <v-app>
    <v-main>
      <div
        class="ma-0 pa-0 main-container"
        @dragenter="this.dragEnter"
        @dragleave="this.dragLeave"
        @drag="this.drag"
        @dragover="this.dragOver"
        @drop="this.drop"
      >
        <div id="editor" v-if="viewEditor || viewPreview">
          <textarea
            v-if="viewEditor"
            spellcheck="false"
            v-model="editFile.content"
            :style="{ width: widthTextarea }"
            class="pb-12"
          ></textarea>
          <div
            v-if="viewPreview"
            :style="{ width: widthPreview }"
            id="preview"
            class="markdown-body"
            v-html="editFile.html"
            :ref="previewRef"
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
import * as electronApi from "./services/electronApi";
import ListHotkeysVue from "./components/ListHotkeys.vue";
import { mapActions, mapGetters } from "vuex";
import * as validation from "./services/validation";
export default {
  name: "App",
  components: { ListHotkeysVue },
  data() {
    return {
      previewRef: "previewRef",
      autoscroll: true,
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
    ...mapGetters({
      getFile: 'main/getFile',
      getPreviewer: 'main/getPreviewer'
    }),
    filePath() {
      return this.editFile.path;
    },
    fileContent() {
      return this.editFile.content;
    },
    fileChanged() {
      return this.editFile.modified;
    },
    fileHtml() {
      return this.editFile.html;
    },
  },
  watch: {
    fileHtml: function () {
      this.$nextTick(() => {
        if (this.autoscroll) {
          this.$refs[this.previewRef].scrollTop =
            this.$refs[this.previewRef].scrollHeight;
        }
      });
    },
    fileContent: function () {
      this.editFile.modified = this.editFile.content !== this.file.content;
    },
    fileChanged: async function (value) {
      await electronApi.fileChanged(value);
    },
    filePath: async function (value) {
      await electronApi.setMarkdownPath(value);
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
    ...mapActions({
      buildMarkdownFile: 'main/buildMarkdownFile'
    }),
    //MENU ACTIONS HANDLER
    //On Click: Menu > File > Open
    async menuOnOpen() {
      console.log("Open");
      await this.openFileFromDialog();
    },
    //On click: Menu > Save
    async menuOnSave() {
    },
    //On click: Menu > Save as
    async menuOnSaveAs() {
      console.log("Click on Menu > File > Save as");
    },
    //On click: Menu > View > editor
    menuOnViewEditor(options) {
      console.log("Click on Menu > View Editor");
      console.log("View editor", options.checked);
    },
    //On click: Menu > view preview
    menuOnViewPreview(options) {
      console.log("View preview", options.checked);
    },
    async menuOnBuild() {
    },
    menuOnHotkeys() {
    },
    menuOnBuildOnSave(options) {
      console.log("View editor", options.checked);
    },
    menuOnAutoscroll(options) {
      console.log("Autoscroll", options.checked);
    },
    async onClickMenuItem(_event, data = { tree: [], options: {} }) {
      const tree = data.tree;
      const options = data.options;
      switch (tree[0]) {
        case "File":
          switch (tree[1]) {
            case "Open":
              console.log("Click on Menu > File > Open");
              await this.menuOnOpen(options);
              break;
            case "Build":
              console.log("Click on Menu > File > Build");
              await this.menuOnBuild(options);
              break;
            case "Save":
              console.log("Click on Menu > File > Save");
              await this.menuOnSave(options);
              break;
            case "Save as..":
              console.log("Click on Menu > File > Save as..");
              await this.menuOnSaveAs(options);
              break;
            default:
              break;
          }
          break;
        case "View":
          switch (tree[1]) {
            case "Editor":
              console.log("Click on Menu > View > Editor");
              this.menuOnViewEditor(options);
              break;
            case "Preview":
              console.log("Click on Menu > View > Preview");
              this.menuOnViewPreview(options);
              break;
            default:
              break;
          }
          break;
        case "Settings":
          switch (tree[1]) {
            case "Build on save":
              console.log("Click on Menu > Settings > Build on save");
              this.menuOnBuildOnSave(options);
              break;
            case "Autoscroll":
              console.log("Click on Menu > Settings > Autoscroll");
              this.menuOnAutoscroll(options);
              break;
            default:
              break;
          }
          break;
        case "Help":
          switch (tree[1]) {
            case "Hotkeys":
              console.log("Click on Menu > Help > Hotkeys");
              this.menuOnHotkeys(options);
              break;
            case "Learn More":
              console.log("Click on Menu > Help > Learn More");
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    drag() {
      console.log("Drag event");
    },
    dragEnter() {
      console.log("Drag Enter event");
    },
    dragLeave() {
      console.log("Drag Leave event");
    },
    dragOver(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      console.log("Drag Over event");
    },
    async drop(evt) {
      console.log("Drop event", evt);
      evt.preventDefault();
      evt.stopPropagation();

      const files = evt.dataTransfer.files;

      await this.openFileFromDragAndDrop({files: files})
    },
  },
  async init(){
    //get the app args
    const response = await electronApi.getAppArgs();
    //validate args
    const result = await validation.validateArgs(response.data.args);

    //if there are not args, simply return
    if (!result.data.exsist) {
      return;  
    }
    //if there are error during validation, show message box and return
    if (result.error) {
      await electronApi.showError(`"Error during validate args: ${result.errorMessage}`);
      return;
    }

    




  },
  async created() {
    ipcRenderer.on("menu:action", this.onClickMenuItem);
    await electronApi.domLoaded();
    await this.init()

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
