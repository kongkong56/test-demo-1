export class CommonError {
  message!: string;
  status!: number;
  stack!: any;

  constructor(message: string, status: number = 500, stack: any = {}) {
    this.message = message;
    this.status = status;
    this.stack = stack;
  }
}
