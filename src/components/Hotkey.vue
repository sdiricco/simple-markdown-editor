<template>
  <v-chip color="blue" label outlined>
    <code class="hotkey-text"><slot></slot></code>
  </v-chip>
</template>

<script>
export default {
  name: "Hotkey",
};
</script>

<style scoped>
.v-chip__content > .hotkey-text{
  background-color: transparent;
  padding: 0px;
  margin: 0px;
}
</style>