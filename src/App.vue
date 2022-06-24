<template>
  <v-app>
    <v-main>
      <v-tabs
        class="tabs-custom-style"
        v-model="tab"
        hide-slider
        center-active
        height="40px"
        dark
      >
        <v-tab
          active-class="my-custom-active-class"
          class="my-custom-class"
          href="#tab-editor"
          ><v-icon color="brown" small class="pr-1">mdi-language-markdown-outline</v-icon
          >{{getInitialFile.name || 'Untiled-1.md'}} <v-icon color="#fff" class="pl-1" x-small v-if="getIsFileModified">mdi-circle</v-icon></v-tab
        >
        <v-tab
          href="#tab-preview"
          active-class="my-custom-active-class"
          class="my-custom-class"
          >
            <v-icon color="#ccc" small class="pr-1">mdi-text-box-search-outline</v-icon>{{getInitialFile.name || 'Untiled-1.md'}}</v-tab
        >
      </v-tabs>
      <div
        class="m-container"
        @drop="drop"
      >
        <v-scroll-x-transition hide-on-leave>
          <Editor v-if="tab === tabs.editor" />
        </v-scroll-x-transition>
        <v-scroll-x-transition hide-on-leave>
          <Preview v-if="tab === tabs.preview" />
        </v-scroll-x-transition>
      </div>
      <Settings v-model="dialogSettings" />
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import * as electronApi from "./services/electronApi";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import * as electronWrapper from "./services/electronWrapper";
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
      handleOnMenuSave: "main/handleOnMenuSave",
      handleOnMenuSaveAs: "main/handleOnMenuSaveAs",
      handleOnMenuOpen: "main/handleOnMenuOpen",
      handleDropFiles: "main/handleDropFiles",
      init: "main/init"
    }),
    ...mapMutations({
      setEditedFile: "main/setEditedFile",
    }),
    toggleView() {
      const tabs = Object.values(this.tabs);
      let idx = tabs.indexOf(this.tab);
      idx = idx >= tabs.length - 1 ? 0 : idx + 1;
      this.tab = tabs[idx];
    },
    async drop(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      const files = evt.dataTransfer.files;
      await this.handleDropFiles({files: files})
    },
  },
  async mounted() {
    this.$vuetify.theme.dark = true;
    ipcRenderer.on('menu/file-open', this.handleOnMenuOpen)
    ipcRenderer.on('menu/file-save', this.handleOnMenuSave)
    ipcRenderer.on('manu/file-saveas', this.handleOnMenuSaveAs)
    ipcRenderer.on('menu/file-preferences', async()=> {
      this.dialogSettings = true;
    })
    try {
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
</style>
