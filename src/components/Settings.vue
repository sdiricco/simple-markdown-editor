<template>
  <v-dialog v-model="dialog" width="800" dark>
    <v-card class="m-container" dark>
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical dark>
        <v-tab>
          <v-icon left> mdi-keyboard-variant </v-icon>
          Hotkeys
        </v-tab>

        <v-tab-item>
          <v-card flat dark outlined >
            <v-card-text>
              hotkey
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Settings",
  props: ["value"],
  model: {
    prop: "value",
    event: "change",
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("change", val);
      },
    },
  },
};
</script>

<style scoped>
.m-container {
  height: 600px;
}
</style>
