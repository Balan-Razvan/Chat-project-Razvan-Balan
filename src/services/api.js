import { CONFIG, EVENTS } from "../config.js";

class SocketService {
  constructor() {
    this.socket = null;
    this.eventHandlers = new Map();
    this.isConnected = false;
  }

  connect() {
    // conectare la server io
    this.socket = io(CONFIG.SERVER_URL);

    this.socket.on(EVENTS.CONNECT, () => {
      console.log(`user with id ${this.socket.id} connected`);
      this.isConnected = true;

      this._emit("connected");
    });

    this.socket.on(EVENTS.DISCONNECT, () => {
      console.log(`user with id ${this.socket.id} disconnected`);
      this.isConnected = false;

      this._emit("disconnected");
    });

    this.socket.on(EVENTS.CONNECT_ERROR, (error) => {
      console.log(error.message);
      this._emit("error", error);
    });

    //

    this.socket.on(EVENTS.MESSAGE_RECEIVE, (data) => {
      console.log("message received ", data);
      this._emit(EVENTS.MESSAGE_RECEIVE, data);
    });

    this.socket.on(EVENTS.MESSAGE_SENT, (data) => {
      console.log("message sent confirmation ", data);
      this._emit(EVENTS.MESSAGE_SENT, data);
    });

    this.socket.on(EVENTS.USER_JOINED, (data) => {
      console.log("user joined ", data.username);
      this._emit(EVENTS.USER_JOINED, data);
    });

    this.socket.on(EVENTS.USER_LEFT, (data) => {
      console.log("user left ", data.username);
      this._emit(EVENTS.USER_LEFT, data);
    });

    this.socket.on(EVENTS.USERS_LIST, (users) => {
      console.log("users ", users);
      this._emit(EVENTS.USERS_LIST, users);
    });
  }


  join(username) {

    if(!username || !username.trim()) {
        console.error("cant join without username");
        return;
    }

    this.socket.emit(EVENTS.USER_JOIN, username.trim());
    console.log(`joining as ${username}`);
  }

  sendMessage(message) {

    if(!message || !message.trim()){
        return;
    }

    this.socket.emit(EVENTS.MESSAGE_SEND, { message: message.trim() });
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
