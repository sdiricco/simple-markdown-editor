<template>
  <v-dialog :value="getAppIsLoading" persistent width="200">
    <v-card color="primary" dark>
      <v-card-text class="pa-4">
        Building..
        <v-progress-linear
          class="pa-4"
          indeterminate
          color="white"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Dialog",
};
</script>

<style></style>
