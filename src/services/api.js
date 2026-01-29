import { CONFIG } from "../config.js";

class SocketService {
  constructor() {
    this.socket = null;
    this.eventHandlers = new Map();
    this.isConnected = false;
  }

  connect() {
    // conectare la server io
    this.socket = io(CONFIG.SERVER_URL);

    this.socket.on("connect", () => {
      console.log(`user with id ${this.socket.id} connected`);
      this.isConnected = true;

      this._emit("connected");
    });

    this.socket.on("disconnect", () => {
      console.log(`user with id ${this.socket.id} disconnected`);
      this.isConnected = false;

      this._emit("disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.log(error.message);
      this._emit("error", error);
    });

    //

    this.socket.on("message:receive", (data) => {
      console.log("message received ", data);
      this._emit("message:receive", data);
    });

    this.socket.on("message:sent", (data) => {
      console.log("message sent confirmation ", data);
      this._emit("message:sent", data);
    });

    this.socket.on("user:joined", (data) => {
      console.log("user joined ", data.username);
      this._emit("user:joined", data);
    });

    this.socket.on("user:left", (data) => {
      console.log("user left ", data.username);
      this._emit("user:left", data);
    });

    this.socket.on("users:list", (users) => {
      console.log("users ", users);
      this._emit("users:list", users);
    });
  }


  join(username) {
    this.socket.emit("user:join", username);
    console.log(`joining as ${username}`);
  }

  sendMessage(message) {
    this.socket.emit("message:send", message);
  }


  on(eventName, callback) {
    if (!this.eventHandlers.has(eventName)) {
        this.eventHandlers.set(eventName, []);
    }
    this.eventHandlers.get(eventName).push(callback);
  }

  off(eventName, callback) {
    const handlers = this.eventHandlers.get(eventName);

    if(handlers) {
        const index = handlers.indexOf(callback);
        if(index > -1) {
            handlers.splice(index, 1);
        }
    }
  }

  _emit(eventName, data) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
        handlers.forEach(callback => callback(data));
    }
  }

}

export const socketService = new SocketService();
