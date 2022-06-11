export class ElectronError extends Error {
  constructor(message = "", { details = "", type = "", code = null } = {}) {
    super(message);
    this.name = "ElectronError";
    this.details = details;
    this.type = type;
    this.code = code;
  }
}

export class ValidationError extends Error {
  constructor(message = "", { details = "", type = "", code = null } = {}) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
    this.type = type;
    this.code = code;
  }
}
