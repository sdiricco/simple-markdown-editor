<template>
  <v-dialog v-model="dialog" width="800" >
    <v-card class="m-container">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>Settings</v-toolbar-title>
      </v-toolbar>
      <v-tabs vertical>
        <v-tab>
          <v-icon left> mdi-account </v-icon>
          Option 1
        </v-tab>
        <v-tab>
          <v-icon left> mdi-lock </v-icon>
          Option 2
        </v-tab>
        <v-tab>
          <v-icon left> mdi-access-point </v-icon>
          Option 3
        </v-tab>

        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                opt1
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                opt2
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <p>
                op3
              </p>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "Settings",
  props: ['value'],
  model: {
    prop: 'value',
    event: 'change'
  },
  computed: {
    dialog:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('change', val)
      }
    }
  }

};
</script>

<style scoped>
.m-container{
  height: 600px;
}
</style>
