<template>
  <div class="m-wrapper">
    <div
      class="m-container markdown-body"
      :style="{ height: height }"
      v-html="getBuiltFile.html"
    ></div>

    <Spinner message="Building.." :enable="getMachineState.isBuildingFile" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as electronWrapper from "../services/electronWrapper"
import Spinner from "./Spinner.vue";
export default {
  name: "Preview",
  components: {
    Spinner,
  },
  props: {
    height: {
      type: String,
      default: "100%",
    },
  },
  computed: {
    ...mapGetters({
      getInitialFile: "main/getInitialFile",
      getMachineState: "main/getMachineState",
      getEditedFile: "main/getEditedFile",
      getBuiltFile: "main/getBuiltFile",
      getOpenNewFile: "main/getOpenNewFile",
    }),
    getShouldStartTheBuild() {
      return this.getEditedFile.content !== this.getBuiltFile.content;
    },
    getFilePath() {
      return this.getInitialFile.path;
    },
  },
  methods: {
    ...mapActions({
      buildFile: "main/buildFile",
    }),
  },
  watch: {
    getOpenNewFile: async function (isNewFile) {
      if (isNewFile) {
        try {
          await this.buildFile({
            content: this.getEditedFile.content,
            path: this.getFilePath,
          });
        } catch (e) {
          await electronWrapper.showErrorBox(
            `Error during building the app: ${
              e.message
            }\n\n${e.details ? "Details: " + e.details : ""}`
          );
        }
      }
    },
  },
  async mounted() {
    if (this.getShouldStartTheBuild) {
      try {
        await this.buildFile({
          content: this.getEditedFile.content,
          path: this.getFilePath,
        });
      } catch (e) {
        await electronWrapper.showErrorBox(
          `Error during building the app: ${e.message}\n\n${
            e.details ? "Details: " + e.details : ""
          }`
        );
      }
    }
  },
};
</script>

<style scoped>
@import "../styles/github-markdown-dracula.css";
@import "../styles/github-dark.css";
.m-container {
  padding: 16px;
  max-width: 900px;
  margin: auto;
}

.m-wrapper {
}
</style>
