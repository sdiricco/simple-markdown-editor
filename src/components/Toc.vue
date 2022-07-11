<template>
  <div class="toc-wrapper thin-scroll">
    <h3>Table of contents</h3>
    <v-navigation-drawer class="ml-6 mt-2 pr-8" permanent right color="transparent">
      <v-tabs vertical background-color="transparent" @change="onChangeToc" class="thin-scroll">
        <v-tab v-for="toc in getToc" :key="toc.slug" :ripple="false" id="toc-item" :class="`toc-link pl-${toc.lvl*2}`" :href="`#${toc.slug}`">
          {{toc.content}}
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>
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
  methods: {
    onChangeToc(href){
      console.log("href", href);
      window.location.hash = `#${href}`
    }
  },
};
</script>

<style scoped>
.toc-wrapper {
  display: flex;
  flex-direction: column;
}
#toc-item {
  height: 20px;
}
.toc-link {
  justify-content: start;
  text-transform: none;
  letter-spacing: inherit;
}

.anchor-link{
  text-decoration: none;
  color: inherit;
  width: 100%;
  text-align: left;
  height: 100%;
}
</style>

<style>
.toc-link.v-tab:before {
  background-color: transparent;
}
</style>
