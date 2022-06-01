<template>
  <v-card min-width="600">
    <v-card-title class="text-h5"> Hotkeys </v-card-title>
    <v-card-text>
      <v-container class="pt-8">
        <v-row class="pb-1">
          <Open />
        </v-row>
        <v-row class="pb-1">
          <Save />
        </v-row>
        <v-row class="pb-1">
          <SaveAs />
        </v-row>
        <v-row class="pb-1">
          <Build />
        </v-row>
        <v-row class="pb-1">
          <ToggleEditor />
        </v-row>
        <v-row class="pb-1">
          <TogglePreview />
        </v-row>
        <v-row class="pb-1">
          <ShowShortcut />
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import Build from "./hotkeys/Build.vue";
import Save from "./hotkeys/Save.vue";
import SaveAs from "./hotkeys/SaveAs.vue";
import ShowShortcut from "./hotkeys/ShowShortcut.vue";
import ToggleEditor from "./hotkeys/ToggleEditor.vue";
import TogglePreview from "./hotkeys/TogglePreview.vue";
import Open from "./hotkeys/Open.vue";
export default {
  name: "ListHotkeys",
  components: { Build, Save, SaveAs, ShowShortcut, ToggleEditor, TogglePreview, Open },
};
</script>
