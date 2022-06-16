<template>
  <v-dialog :value="enable" persistent width="200">
    <v-card color="primary" dark >
      <v-card-text class="pa-4 d-flex flex-column align-center">
        {{message}}
        <v-progress-linear
          class="pa-4 mt-2"
          indeterminate
          color="white"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Spinner",
  props:{
    message:{
      type:String,
      default: null
    },
    enable:{
      type: Boolean,
      default: false
    }
  }
};
</script>

<style></style>
