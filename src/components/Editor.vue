<template>
  <div class="m-container">
    <textarea v-model="code" id="editor"></textarea>
  </div>
</template>

<script>
import * as CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/keymap/sublime";
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor";
import "codemirror/addon/search/jump-to-line";
import "codemirror/addon/dialog/dialog";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/display/fullscreen";
import "codemirror/addon/display/fullscreen";
import "codemirror/addon/display/fullscreen.css";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Editor",
  props: {
    height: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      code: "",
      cm: undefined,
    };
  },
  computed: {
    ...mapGetters({
      getEditedFile: "main/getEditedFile",
      getOpenNewFile: "main/getOpenNewFile",
    }),
  },
  methods: {
    ...mapActions({
      setFileContent: "main/setFileContent",
    }),
    destroy() {
      if (this.cm) {
        this.cm.setOption("mode", "text/x-csrc");
        this.cm
          .getWrapperElement()
          .parentNode.removeChild(this.cm.getWrapperElement());
      }
    },
    onChange() {
      this.setFileContent({ content: this.cm.getValue() });
    },
    init() {
      this.cm = CodeMirror.fromTextArea(document.getElementById("editor"), {
        lineNumbers: true,
        theme: "dracula",
        mode: "markdown",
        keyMap: "sublime",
        lineWrapping: true,
        inputStyle: "contenteditable",
        screenReaderLabel: "screen reader label",
        autofocus: true,
      });
      this.cm.setSize("100%", this.height);
      this.cm.setValue(this.getEditedFile.content);
      this.cm.on("change", this.onChange);
    },
  },
  watch: {
    getOpenNewFile: function (isNewFile) {
      if (isNewFile) {
        console.log(isNewFile);
        this.cm.setValue(this.getEditedFile.content);
      }
    },
  },
  mounted() {
    this.destroy();
    this.init();
  },
  beforeUnmount() {
    this.destroy();
    this.cm.off("change", this.onChange);
  },
};
</script>

<style scoped>
.m-container {
  height: 100%;
  display: flex;
}
</style>

<style></style>
