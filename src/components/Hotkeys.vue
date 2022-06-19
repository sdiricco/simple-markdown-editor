<template>
  <v-card :elevation="0">
    <v-card-title>Hotkeys</v-card-title>
    <v-card-text>
      This section contains a list of all hotkeys that you can use in the application
    </v-card-text>
    <v-card-text>
      <v-card outlined tile>
        <v-data-table
          :headers="headers"
          :items="hotkeys"
          dense
          hide-default-footer
          disable-filtering
          disable-pagination
          disable-sort
        >
          <template v-slot:item.combination="{ item }">
            <code>
              {{ item.combination }}
            </code>
          </template></v-data-table
        >
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Hotkeys",
  data() {
    return {
      headers: [
        {
          text: "Hotkey",
          value: "combination",
          divider: true,
        },
        { text: "Description", value: "description" },
      ],
      hotkeys: [
        {
          combination: "Ctrl + O",
          description: "Open a new markdown file",
        },
        {
          combination: "Ctrl + S",
          description: "Save current markdown file",
        },
        {
          combination: "Ctrl + Shift + S",
          description: "Save current markdown file in different location",
        },
        {
          combination: "Ctrl + Tab",
          description: "Toggle window, Editor/Preview",
        },
        {
          combination: "Ctrl + R",
          description: "Reload app",
        },
        {
          combination: "Ctrl + Shift + R",
          description: "Force reload app",
        },
        {
          combination: "F11",
          description: "Toggle full screen",
        },
        {
          combination: "Ctrl + M",
          description: "Minimize window",
        },
        {
          combination: "Ctrl + 0",
          description: "Actual size",
        },
        {
          combination: "Ctrl + Shift +",
          description: "Zoom in",
        },
        {
          combination: "Ctrl + -",
          description: "Zoom out",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
