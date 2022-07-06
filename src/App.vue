<template>
  <v-app>
    <v-main>
      <!-- Tabs -->
      <v-tabs v-model="tab" hide-slider center-active height="40px" dark>
      
        <!-- Tab Editor -->
        <v-tab active-class="tab-active" class="tab" :href="`#${getTabs.editor}`">
          <v-icon color="brown" small class="pr-1">mdi-language-markdown-outline</v-icon>
          {{ getFileName }}
          <v-icon color="#fff" class="pl-1" x-small v-if="getFileHasChanged">mdi-circle</v-icon>
        </v-tab>

        <!-- Tab Preview -->
        <v-tab :href="`#${getTabs.preview}`" active-class="tab-active" class="tab">
          <v-icon color="#ccc" small class="pr-1">mdi-text-box-search-outline</v-icon>
          {{ getFileName }}
        </v-tab>
      </v-tabs>

      <!-- Content -->
      <div class="m-container">
        <v-scroll-x-transition hide-on-leave>
          <Editor v-if="getCurrentTab === getTabs.editor" />
        </v-scroll-x-transition>
        <v-scroll-x-transition hide-on-leave>
          <Preview v-if="getCurrentTab === getTabs.preview" />
        </v-scroll-x-transition>
        <v-fade-transition origin="center center 0">
          <DropZone v-if="getDropZone" />
        </v-fade-transition>
      </div>

      <!-- Settings -->
      <Settings :value="getSettings.dialog" @close="closeSettings" />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Editor from "./components/Editor.vue";
import Preview from "./components/Preview.vue";
import DropZone from "./components/DropZone.vue";
import * as electronWrapper from "./services/electronWrapper";
import Settings from "./components/Settings.vue";
import * as electronApi from "./services/electronApi";

export default {
  name: "App",
  components: { Editor, Preview, Settings, DropZone },

  computed: {
    ...mapGetters({
      getFileName: "file/getName",
      getFilePath: "file/getPath",
      getFileHasChanged: "handler/getFileHasChanged",
      getCurrentTab: "main/getCurrentTab",
      getTabs: "main/getTabs",
      getTitle: "main/getTitle",
      getDropZone: "main/getDropZone",
      getSettings: "main/getSettings",
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
      setTitle: "main/setTitle",
      enableDropZoneOnDrag: "main/enableDropZoneOnDrag",
      closeSettings: "main/closeSettings",
    }),
  },
  async mounted() {
    this.enableDropZoneOnDrag();
    this.$vuetify.theme.dark = true;

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

.tab-active {
  background-color: var(--v-background-base);
  border-radius: 2px 2px 0px 0px;
}

.tab {
  margin-top: 4px;
  border-radius: 4px 4px 0px 0px;
  color: #fff;
  text-transform: none;
}

.tab:before {
  background-color: transparent;
  transition: none;
}

.background-color {
  background-color: black !important;
}
</style>
