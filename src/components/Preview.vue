<template>
  <div class="m-wrapper d-flex justify-center">
    <div
      class="m-container markdown-body"
      :style="{ height: height }"
      v-html="getBuiltFile.content"
    ></div>

    <Spinner message="Building.." :enable="getIsBuilding"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Spinner from "./Spinner.vue"
export default {
  name: "Preview",
  components:{
    Spinner
  },
  props: {
    height: {
      type: String,
      default: "100%",
    },
  },
  computed: {
    ...mapGetters({
      getBuiltFile: "main/getBuiltFile",
      getMachineState: "main/getMachineState" 
    }),
    getIsBuilding(){
      return this.getMachineState.isBuildingFile
    }
  },
  methods: {
    ...mapActions({
      buildFile: "main/buildFile",
    }),
  },
  async created() {
    await this.buildFile();
  },
};
</script>

<style scoped>
@import '../styles/github-markdown-dracula.css';
@import '../styles/github-dark.css';
.m-container {
  padding: 16px;
  max-width: 900px;
}

.m-wrapper{
  background-color: rgb(40,42,54);

}
</style>



