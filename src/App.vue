<template>
  <v-app>
    <v-main>
      <v-tabs center-active height="40px">
        <v-tab @click="currentTab = tabs.editor">Editor</v-tab>
        <v-tab @click="currentTab = tabs.preview">Preview</v-tab>
      </v-tabs>
        <Preview v-if="currentTab === tabs.preview" />
        <Editor height="calc(100vh - 40px)" v-if="currentTab === tabs.editor" />
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import * as electronApi from "./services/electronApi";
import { mapActions, mapGetters, mapMutations } from "vuex";
import * as validation from "./services/validation";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
export default {
  name: "App",
  components: { Editor, Preview },

  data() {
    
    return {
      tabs: {
        editor: "editor",
        preview: "preview",
      },
      currentTab: "editor",
      previewRef: "previewRef",
      autoscroll: true,
      buildOnSave: true,
      showHotkeys: false,
      viewEditor: true,
      viewPreview: true,
      widthTextarea: "50%",
      widthPreview: "50%",
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
    };
  },
  computed: {
    ...mapGetters({
      getInitialFile: "main/getInitialFile",
      getEditedFile: "main/getEditedFile",
      getBuiltFile: "main/getBuiltFile",
      getPreviewer: "main/getPreviewer",
      getIsFileModified: "main/getIsFileModified",
      getMachineState: "main/getMachineState",
    }),
    getAppIsLoading() {
      return Object.values(this.getMachineState).some((v) => v === true);
    },
    getFilePath() {
      return this.getInitialFile.path;
    },
    getIsNewFile() {
      const r = Boolean(this.getFilePath);
      return !r;
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
    getIsFileModified: async function (value) {
      await electronApi.fileChanged(value);
    },
    getFilePath: async function (value) {
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
      loadMarkdownFile: "main/loadMarkdownFile",
      saveFile: "main/saveFile",
    }),
    ...mapMutations({
      setEditedFile: "main/setEditedFile",
    }),
    onChangeView(view) {
      this.currentTab = view;
    },
    onInputTextIDE(event) {
      this.setEditedFile({ content: event.target.value });
    },
    //MENU ACTIONS HANDLER
    //On Click: Menu > File > Open
    async menuOnOpen() {
      try {
        //if file has changed, show message info.
        //1 - if user click on cancel, siply return
        //2 - if user click on ok, continue choosing file from open dialog
        if (this.getIsFileModified) {
          const response = await electronApi.showMessage(
            "The file has changed. Are you sure you want to open a new file without saving?"
          );
          if (response.canceled) {
            return;
          }
        }
        //chose a file from open dialog
        //1 - if canceled, simply return
        //2 - if choosing a file, return the path
        const response = await electronApi.openDialogFile();
        if (response.canceled) {
          return;
        }
        await validation.validateFile(response.path);
        await this.loadMarkdownFile({ path: response.path });
      } catch (e) {
        await electronApi.showError(
          `Error during opening file: ${e.message}\n\n${
            e.details ? "Details: " + e.details : ""
          }`
        );
      }
    },
    //On click: Menu > Save
    async menuOnSave() {
      //se non è modificato, non viene salvato
      if (!this.getIsFileModified) {
        return;
      }
      //se il file è nuovo ovvero non è stato aperto un file precedentemente
      if (this.getIsNewFile) {
        await this.menuOnSaveAs();
        return;
      }
      await this.saveFile();
    },
    //On click: Menu > Save as
    async menuOnSaveAs() {
      const response = await electronApi.saveDialog({
        options: this.saveDialogOptions,
      });
      if (response.canceled) {
        return;
      }
      console.log("response", response);
      await this.saveFile({ path: response.path });
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
    async menuOnBuild() {},
    menuOnHotkeys() {},
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
      try {
        evt.preventDefault();
        evt.stopPropagation();
        const files = evt.dataTransfer.files;
        const filePaths = Object.values(files).map((f) => f.path);
        console.log("files", filePaths);
        await validation.validateFiles(filePaths);
        await this.loadMarkdownFile({ path: filePaths[0] });
      } catch (e) {
        console.log(e.message);
        console.log(e.details);
        await electronApi.showError(
          `Error during the drop files: ${e.message}\n\n${
            e.details ? "Details: " + e.details : ""
          }`
        );
      }
    },
    async init() {
      try {
        //get the app args
        const response = await electronApi.getAppArgs();
        //If there are not args, simply returns
        if (!response.args) {
          console.log("App launched without any files");
          return;
        }
        //if there are args, validate them
        await validation.validateArgs(response.args, { multipleArgs: false });
        //the args rapresents the path of markdown files
        const markdownFilePath = response.data.args[0];
        await this.loadMarkdownFile({ path: markdownFilePath });
      } catch (e) {
        console.log(e.message);
        console.log(e.details);
        throw e;
      }
    },
  },
  async created() {
    ipcRenderer.on("menu:action", this.onClickMenuItem);
    try {
      await electronApi.domLoaded();
      await this.init();
    } catch (e) {
      await electronApi.showError(
        `Error during the initialization phase of the app: ${e.message}\n\n${
          e.details ? "Details: " + e.details : ""
        }`
      );
    }
  },
};
</script>

<style>
</style>
