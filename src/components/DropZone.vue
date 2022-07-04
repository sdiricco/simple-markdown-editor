<template>
  <div
    @dragleave.prevent.self.stop="onDragLeave"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
    class="test"
  >
    <div>
      <h1>Drop file</h1>
    </div>
    <div>
      <v-icon x-large>mdi-language-markdown-outline</v-icon>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "DropZone",
  methods: {
    ...mapActions({
      disableDropZone: "main/disableDropZone",
      enableDropZone: "main/enableDropZone",
      onDropFiles: "handler/onDropFiles"
    }),
    onDragLeave() {
      console.log("drag leave");
      this.disableDropZone();
    },
    onDragOver() {
      this.enableDropZone();
    },
    async onDrop(evt) {
      console.log("drop");
      this.disableDropZone();
      const files = evt.dataTransfer.files;
      await this.onDropFiles({ files: files });
    },
  },
};
</script>

<style scoped>
.test {
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
  flex-direction: column;
}
</style>
