<template>
  <div class="m-wrapper">
    <h3>Table of contents</h3>
    <ul class="thin-scroll ml-6 mt-2 pr-4">
      <li v-for="toc in getToc" :key="toc.slug" :class="`pt-2 pl-${toc.lvl*4}`">
        <a :href="`#${toc.slug}`">{{toc.content}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Toc",
  computed: {
    ...mapGetters({
      getToc: "preview/getToc",
    }),
  },
};
</script>

<style scoped>
.m-wrapper {
  display: flex;
  flex-direction: column;
}

.m-wrapper > ul {
  overflow-y: auto;
  max-height: 80vh;
  border-left: 1px solid rgba(128, 128, 128, 1);
  padding:0px
} 

.m-wrapper > ul > li {
  line-height: 1.2;
}

.m-wrapper > ul > li > a {
  text-decoration: none;
}
</style>

<style>
.toc-link.v-tab:before {
  background-color: transparent;
}
</style>
