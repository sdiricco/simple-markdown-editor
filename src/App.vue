<template>
  <v-app>
    <v-main>
      <v-tabs class="tabs-custom-style" v-model="tab" hide-slider center-active height="40px" dark>
        <v-tab active-class="my-custom-active-class" class="my-custom-class" :href="`#${getTabs.editor}`"
          ><v-icon color="brown" small class="pr-1">mdi-language-markdown-outline</v-icon>{{ getFileName }}
          <v-icon color="#fff" class="pl-1" x-small v-if="getFileHasChanged">mdi-circle</v-icon></v-tab
        >
        <v-tab :href="`#${getTabs.preview}`" active-class="my-custom-active-class" class="my-custom-class">
          <v-icon color="#ccc" small class="pr-1">mdi-text-box-search-outline</v-icon>{{ getFileName }}</v-tab
        >
      </v-tabs>
      <div class="m-container">
        <v-scroll-x-transition hide-on-leave>
          <Editor v-if="getCurrentTab === getTabs.editor" />
        </v-scroll-x-transition>
        <v-scroll-x-transition hide-on-leave>
          <Preview v-if="getCurrentTab === getTabs.preview" />
        </v-scroll-x-transition>
        <div v-show="overlay || dropZone" @dragenter="onDragEnter" @dragleave="onDragLeave" @drop="onDrop"  class="test">Drop Elem <v-icon>mdi-plus</v-icon></div>
      </div>
      <Settings v-model="dialogSettings" />
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapActions, mapGetters } from "vuex";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import * as electronWrapper from "./services/electronWrapper";
import Settings from "./components/Settings.vue";
import * as electronApi from "./services/electronApi";

export default {
  name: "App",
  components: { Editor, Preview, Settings },

  data() {
    return {
      dialogSettings: false,
      overlay: false,
      dropZone: false
    };
  },
  computed: {
    ...mapGetters({
      getFileName: "file/getName",
      getFilePath: "file/getPath",
      getFileHasChanged: "handler/getFileHasChanged",
      getCurrentTab: "main/getCurrentTab",
      getTabs: "main/getTabs",
      getTitle: "main/getTitle",
    }),
    tab: {
      get() {
        return this.getCurrentTab;
      },
      set(value) {
        this.setCurrentTab(value);
      },
    },
  },
  watch: {
    getTitle: function (value) {
      this.$nextTick(async () => {
        await electronApi.setTitle(value);
      });
    },
  },
  methods: {
    ...mapActions({
      onInit: "handler/onInit",
      onDropFiles: "handler/onDropFiles",
      onMenuOpen: "handler/onMenuOpen",
      onMenuSaveAs: "handler/onMenuSaveAs",
      onMenuSave: "handler/onMenuSave",
      setCurrentTab: "main/setCurrentTab",
      toggleView: "main/toggleView",
      setTitle: "[main/setTitle",
    }),
    onDragEnter(evt) {
      this.dropZone = true;
      console.log("dragenter2", evt);
    },
    onDragLeave(evt) {
      this.dropZone = false;
      console.log("dragleave2", evt);
    },
    onDragOver(evt){
      console.log("dragover2", evt);
    },
    async onDrop(evt) {
      this.dropZone = false;
      console.log("drop2", evt);
      const files = evt.dataTransfer.files;
      await this.onDropFiles({ files: files });
    },
  },
  async mounted() {
    ['dragenter', 'dragover', 'dragstart', 'dragstop', 'dragleave', 'drop'].forEach(e=> document.body.addEventListener(e, (evt)=>{
      console.log("event", e);
      evt.preventDefault()
      evt.stopPropagation()

      if (e === 'dragenter' && this.dropZone === false) {
        this.overlay = true
      }
      else if(e === 'dragleave' && this.dropZone === true){
        this.overlay = false
      }
      else if (e === 'drop' && this.dropZone === false) {
        this.overlay = false
      }
    }))
    this.$vuetify.theme.dark = true;
    ipcRenderer.on("menu/file/open", this.onMenuOpen);
    ipcRenderer.on("menu/file/save", this.onMenuSave);
    ipcRenderer.on("menu/file/saveas", this.onMenuSaveAs);
    ipcRenderer.on("menu/file/preferences", async () => {
      this.dialogSettings = true;
    });
    ipcRenderer.on("menu/view/toggle-window", this.toggleView);

    try {
      await this.onInit();
    } catch (e) {
      await electronWrapper.showErrorBox(
        `Error during the initialization phase of the app: ${e.message}\n\n${e.details ? "Details: " + e.details : ""}`
      );
    }
  },
};
</script>

<style scoped>
.m-container {
  height: calc(100vh - 40px);
  overflow-y: auto;
  background-color: var(--v-background-base);
}

.my-custom-active-class {
  background-color: var(--v-background-base);
  border-radius: 2px 2px 0px 0px;
}

.my-custom-class {
  margin-top: 4px;
  border-radius: 4px 4px 0px 0px;
  color: #fff;
  text-transform: none;
}

.my-custom-class:before {
  background-color: transparent;
  transition: none;
}

.background-color{
  background-color: black !important;
}

.test{
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.3;
}
</style>
