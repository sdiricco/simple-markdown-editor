export const dialog = {
      showOpenDialog: {
        options: {
          filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
          properties: ["openFile"] 
        },
        response: {
          canceled:null,
          filePath: '',
          bookmark: ''
        }
      },
      showSaveDialog: {
        options: {
          defaultPath: "Document.md",
          filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
        },
        response: {
          canceled:null,
          filePath: '',
          bookmark: ''
        }
      },
      showMessageBox: {
        options:{
          title: "Info",
          type: "question",
          message: "",
          buttons: ["ok", "cancel"],
        },
        response:{
          response: {
            ok: false,
            cancel: false
          },
          checkboxChecked: false
        }
      },
      showErrorBox: {
        options: {
          title: "Error",
          type: "error",
          message: "",
        },
        response: null
      },
};
