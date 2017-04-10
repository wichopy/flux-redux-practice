export class Dispatcher {
  constructor() {
    this.__listerners = [];
  }
  dispatch(action) {
    this.__listerners.forEach(listener => listener(action));
  }
  register(listener) {
    this.__listerners.push(listener);
  }
}