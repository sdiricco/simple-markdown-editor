<template>
  <div class="m-wrapper">
    <div
      class="m-container markdown-body"
      color="transparent"
      v-scroll.self="onScroll"
      :style="{ height: height }"
      v-html="getPreviewValue"
    ></div>
    <Toc class="toc" v-if="getPreviewValue && showToc" />
    <Spinner message="Building.." :enable="getIsLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Spinner from "./Spinner.vue";
import Toc from "./Toc.vue";

export default {
  name: "Preview",
  components: {
    Spinner,
    Toc,
  },
  props: {
    height: {
      type: String,
      default: "100%",
    },
  },
  computed: {
    ...mapGetters({
      getPreviewValue: "preview/getValue",
      getIsSync: "preview/getIsSync",
      getIsLoading: "markdown/getIsLoading",
    }),
    showToc() {
      {
        switch (this.$vuetify.breakpoint.name) {
          case "xs":
          case "sm":
            return false;
          case "md":
          case "lg":
          case "xl":
            return true;
          default:
            return true;
        }
      }
    },
  },
  watch: {
    getIsSync(sync) {
      if (!sync) {
        this.markdownParse();
      }
    },
  },
  methods: {
    ...mapActions({
      markdownParse: "markdown/parse",
    }),
    onScroll() {
      console.log(window.scrollY);
    },
  },
  mounted() {
    if (!this.getIsSync) {
      this.markdownParse();
    }
  },
};
</script>

<style scoped>
@import "../styles/github-markdown-dracula.css";
@import "../styles/github-dark.css";
.m-container {
  padding: 16px;
  max-width: 900px;
  width: 900px;
  min-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.m-wrapper {
  display: flex;
}

.toc {
  display: inline-flex;
  position: sticky;
  top: 24px;
  height: 60vh;
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  margin-right: auto;
  margin-top:16px

}
</style>
