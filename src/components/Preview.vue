<template>
  <div v-html="getBuiltFile.content"></div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
export default {
  name: "Preview",
  computed:{
    ...mapGetters({
      getBuiltFile: 'main/getBuiltFile'
    })
  },
  methods:{
    ...mapActions({
      buildFile: 'main/buildFile'
    })
  },  
  async created() {
    await this.buildFile();
  }
};
</script>

<style></style>
