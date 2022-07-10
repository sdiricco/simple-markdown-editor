<template>
  <div class="m-wrapper">
    <div class="m-container markdown-body" :style="{ height: height }" v-html="getPreviewValue"></div>
    <div class="toc" v-html="getToc"></div>

    <Spinner message="Building.." :enable="getIsLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Spinner from "./Spinner.vue";
export default {
  name: "Preview",
  components: {
    Spinner,
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
      getToc: "preview/getToc"
    }),
  },
  watch:{
    getIsSync(sync){
      if (!sync) {
        this.markdownParse();
      }
    }
  },
  methods: {
    ...mapActions({
      markdownParse: "markdown/parse",
    }),
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
  margin: auto;
}

.m-wrapper {
  display: flex;
}

.toc{
  display: inline;
  position: sticky;
  top: 0px;
  height: 100%;
  width: 300px;
  max-width: 300px;
}

</style>
