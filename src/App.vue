<template>
  <v-app>
    <v-main>
      <v-tabs background-color="#2c2c2c" class="tabs-custom-style" v-model="tab" hide-slider center-active height="32px" dark>
        <v-tab
          active-class="my-custom-active-class"
          class="my-custom-class"
          href="#tab-editor"
          >Editor</v-tab
        >
        <v-tab
          href="#tab-preview"
          active-class="my-custom-active-class"
          class="my-custom-class"
          >Preview</v-tab
        >
      </v-tabs>
      <div class="m-container" @drag="drag" @dragenter="dragEnter" @dragover="dragOver" @drop="drop" >
        <Editor v-if="tab === tabs.editor" />
        <Preview v-if="tab === tabs.preview" />
      </div>
      <Settings v-model="dialogSettings" />
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
import * as electronWrapper from "./utils/electronWrapper";
import Settings from "./components/Settings.vue";
export default {
  name: "App",
  components: { Editor, Preview, Settings },

  data() {
    return {
      tabs: {
        editor: "tab-editor",
        preview: "tab-preview",
      },
      tab: "tab-editor",
      dialogSettings: false,
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
      getHasToBuilt: "main/getHasToBuilt",
      getOpenNewFile: "main/getOpenNewFile",
    }),
    getFilePath() {
      return this.getInitialFile.path;
    },
  },
  watch: {
    getIsFileModified: async function (value) {
      await electronApi.fileChanged(value);
    },
    getFilePath: async function (value) {
      console.log(value);
      try {
        await electronApi.setTitle(value);
      } catch (e) {
        console.log(e.name);
        console.log(e.message);
        console.log(e.details);
      }
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
    toggleView() {
      const tabs = Object.values(this.tabs);
      let idx = tabs.indexOf(this.tab);
      idx = (idx >= tabs.length - 1) ? 0 : idx + 1;
      this.tab = tabs[idx]
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
          const response = await electronWrapper.showMessageQuestion(
            "The file has changed. Are you sure you want to open a new file without saving?"
          );
          if (response.canceled) {
            return;
          }
        }
        //chose a file from open dialog
        //1 - if canceled, simply return
        //2 - if choosing a file, return the path
        const response = await electronWrapper.showOpenDialog();
        if (response.canceled) {
          return;
        }
        await validation.validateFile(response.filePath);
        await this.loadMarkdownFile({ path: response.filePath });
      } catch (e) {
        await electronWrapper.showErrorBox(
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
      if (this.getInitialFile.path === "") {
        await this.menuOnSaveAs();
        return;
      }
      await this.saveFile({
        path: this.getFilePath,
        content: this.getEditedFile.content,
      });
    },
    //On click: Menu > Save as
    async menuOnSaveAs() {
      const {canceled, filePath} = await electronWrapper.showSaveDialog();
      if (canceled) {
        return;
      }
      await this.saveFile({
        path: filePath,
        content: this.getEditedFile.content,
      });
    },
    async menuOnPreferences(){
      this.dialogSettings = true
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
            case "Save":
              console.log("Click on Menu > File > Save");
              await this.menuOnSave(options);
              break;
            case "Save as..":
              console.log("Click on Menu > File > Save as..");
              await this.menuOnSaveAs(options);
              break;
            case "Preferences":
              console.log("Click on Menu > File > Preferences");
              this.menuOnPreferences(options);
              break;
            default:
              break;
          }
          break;
        case "View":
          switch (tree[1]) {
            case "Toogle window":
              console.log("Click on Menu > View > Toogle window");
              this.toggleView();
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
        await electronWrapper.showErrorBox(
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
      await electronWrapper.showErrorBox(
        `Error during the initialization phase of the app: ${e.message}\n\n${
          e.details ? "Details: " + e.details : ""
        }`
      );
    }
  },
};
</script>

<style scoped>
.m-container {
  height: calc(100vh - 32px);
  overflow-y: auto;
  background-color: rgb(40, 42, 54);
}

.my-custom-active-class {
  background-color: rgb(40, 42, 54);
  border-radius: 4px 4px 0px 0px;

}

.my-custom-class{
  border-radius: 4px 4px 0px 0px;


}

.my-custom-class:before {
  background-color: transparent;
  transition: none;
}
</style>
