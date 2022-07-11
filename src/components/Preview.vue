<template>
  <div class="m-wrapper">
    <div class="m-container markdown-body" color="transparent" v-scroll.self="onScroll" :style="{ height: height }" v-html="getPreviewValue" id="myfid"></div>
    <Toc class="toc thin-scroll" v-if="getPreviewValue"/>
    <Spinner message="Building.." :enable="getIsLoading" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Spinner from "./Spinner.vue";
import Toc from "./Toc.vue"

export default {
  name: "Preview",
  components: {
    Spinner,
    Toc
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
    onScroll(){
      console.log(window.scrollY);
    }
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
  max-width: 600px;
  /* margin: auto; */
}

.m-wrapper {
  display: flex;
  justify-content: center;
}

.toc {
  display: inline;
  position: sticky;
  top: 24px;
  height: 80vh;
  width: 200px;
  max-width: 200px;
}

</style>
