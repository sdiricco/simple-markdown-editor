<template>
  <article class="empty" v-if="!viewPreview && !viewEditor">
    <pre>
    <h2>Nothing to see</h2>
    <p>From the View menu select Editor or Preview</p>
    </pre>
  </article>
</template>

<script>
export default {
  name: "Empty",
};
</script>

<style></style>
