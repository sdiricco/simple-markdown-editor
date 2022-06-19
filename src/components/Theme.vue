<template>
  <v-card :elevation="0">
    <v-card-title>Theme</v-card-title>
    <v-card-text>
      In this section you can choose the theme.
    </v-card-text>
    <v-card-text>
      <v-switch
        v-model="$vuetify.theme.dark"
        inset
        label="Toggle theme"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Theme",
};
</script>

<style scoped></style>
