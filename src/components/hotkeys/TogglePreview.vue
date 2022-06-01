<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="d-flex flex-row align-center pa-0">
        <hotkey>Ctrl</hotkey>
        <div class="subtitle-1 mx-2">+</div>
        <hotkey>Shift</hotkey>
        <div class="subtitle-1 mx-2">+</div>
        <hotkey>P</hotkey>
        <div class="subtitle-1 mx-2"></div>
      </v-col>
      <v-col cols="6" class="d-flex flex-row align-center pa-0">
        <div class="subtitle-1">Toggle preview</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Hotkey from "../Hotkey.vue";

export default {
  name: "TogglePreview",
  components: { Hotkey },
};
</script>
