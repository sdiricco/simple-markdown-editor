<template>
  <v-dialog v-model="dialog" width="800" >
    <v-card class="m-container d-flex">
      <v-toolbar flat color="primary" height="40px">
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <v-container dense class="m-content overflow-y-auto">
        <v-row no-gutters class="m-content">
          <v-col cols="3" class="left-menu">
            <v-tabs vertical v-model="tab">
              <v-tab class="left-menu-item">
                <v-icon left> mdi-brightness-4 </v-icon>
                Theme
              </v-tab>
              <v-tab class="left-menu-item">
                <v-icon left> mdi-keyboard-variant </v-icon>
                Hotkeys
              </v-tab>
            </v-tabs>
          </v-col>
          <v-col cols="9">
            <v-tabs-items v-model="tab">
              <v-tab-item>
                <Theme />
              </v-tab-item>
              <v-tab-item class="content-item">
                <Hotkeys />
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import Hotkeys from './Hotkeys.vue';
import Theme from './Theme.vue';
export default {
    name: "Settings",
    props: ["value"],
    model: {
        prop: "value",
        event: "change",
    },
    theme: false,
    data() {
        return {
            tab: null,
        };
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
    methods: {
        onChangeTheme(isDark) {
            if (isDark) {
                this.$vuetify.theme.dark;
            }
            else {
                this.$vuetify.theme.light;
            }
        },
    },
    components: { Hotkeys, Theme }
};
</script>

<style scoped>
.m-container {
  height: calc(min(90vh, 600px));
  display: flex;
  flex-direction: column;
}

.content-item{
  height: calc(min(90vh, 600px) - 40px);
  overflow-y: auto;
}

.m-content {
  height: 100%;
  padding: 0px;
}

.tabs {
  background-color: var(--v-accent-lighten2) !important;
}

.v-tabs-bar {
  border: 1px solid;
}

.left-menu-item {
  justify-content: flex-start;
}

.left-menu {
  border-right: 1px solid #e1e1e1;
}
</style>
