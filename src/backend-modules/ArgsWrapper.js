const path = require("path");

class Args {
  constructor() {
    this.args = process.argv;
  };
  get(){
    return {
      error: false,
      errorMessage: "",
      data: {
        args: this.args,
      },
    };
  }
}

module.exports = {Args}

