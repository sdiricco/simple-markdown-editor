<template>
  <v-dialog v-model="dialog" width="800">
    <v-card class="m-container">
      <v-toolbar flat color="primary">
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab>
          <v-icon left> mdi-brightness-4 </v-icon>
          Theme
        </v-tab>
        <v-tab>
          <v-icon left> mdi-keyboard-variant </v-icon>
          Hotkeys
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <v-switch
                v-model="$vuetify.theme.dark"
                inset
                label="toggle theme"
              ></v-switch>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text> hotkey </v-card-text>
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
  theme: false,
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
  methods:{
    onChangeTheme(isDark){
      if (isDark) {
        this.$vuetify.theme.dark
      }else{
        this.$vuetify.theme.light
      }
    }
  }
};
</script>

<style scoped>
.m-container {
  height: 600px;
}
</style>
