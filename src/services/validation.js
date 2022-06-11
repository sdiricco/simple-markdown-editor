import * as nodeApi from './nodeApi'



export async function validateArgs(args = [], {multipleArgs = false, type = "path"} = {}) {
  let result = {
    error: false,
    errorMessage: "",
    data: {
      validation: true,
      exsist: false,
    }
  };
  //if the app was opened without files
  if (!args) {
    return result;
  };

  result.data.exsist = true;

  //if the app was opened wit multiple files
  if (args.length > 1 && !multipleArgs) {
    result.error = true;
    result.errorMessage = "Multiple args";
    result.data.validation = false;
    return result;
  }
  if (type === 'path') {
    for (p of args){
      const validPath = await nodeApi.exsistPath(p);
      if (!validPath) {
        result.error = true;
        result.errorMessage = `${p} is not a valid path`;
        result.validation = false;
        return;
      }
    }
  }
  return result;
}
