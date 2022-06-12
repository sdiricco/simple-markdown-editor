export const electron = {
  dialog: {
    options: {
      openDialog: {
        filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      },
      saveDialog: {
        defaultPath: "Document.md",
        filters: [{ name: "Markdown", extensions: ["md", "markdown"] }],
      },
      showMessageBox: {
        title: "",
        type: "question",
        message: "",
        buttons: ["ok", "cancel"],
      },
    },
  },
};
