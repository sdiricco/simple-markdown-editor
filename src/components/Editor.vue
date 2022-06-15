<template>
<div class="m-container">
  <textarea v-model="code" id="editor"></textarea>
</div>
</template>

<script>
import * as CodeMirror from "codemirror"
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/fullscreen.css'

  export default {
    name: "Editor",
    props: {
      height:{
        type: String,
        default: '100%'
      }
    },
    data(){
      return{
        code: "ciao",
        cm: undefined
      }
    },
    methods: {
      destroy(){
        this.cm.setOption("mode", "text/x-csrc");
        this.cm.getWrapperElement().parentNode.removeChild(this.  cm.getWrapperElement());
      }
    },
    mounted() {
      this.cm = CodeMirror.fromTextArea(document.getElementById('editor'), {
        lineNumbers: true,
        theme: 'dracula',
        mode: 'markdown',
        keyMap: 'sublime',
      })
      this.cm.setSize('100%', this.height)
    },
    beforeUnmount() {
      this.destroy();
      
    },
  }
</script>

<style scoped>
.m-container{
  height: 100%;
  display: flex;
}


</style>

<style>

</style>