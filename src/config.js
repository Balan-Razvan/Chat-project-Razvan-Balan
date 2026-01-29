export const CONFIG = {
    SERVER_URL: 'http://localhost:3000',
    DEFAULT_USERNAME: 'Razvan',
    MAX_MESSAGE_LENGTH: 5000,
    MESSAGE_TYPES: {
        SENT: 'sent',
        RECEIVED: 'received'
    }
};

export const EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    CONNECT_ERROR: 'connect_error',

    USER_JOIN: 'user:join',
    USER_JOINED: 'user:joined',
    USER_LEFT: 'user:left',
    USERS_LIST: 'users:list',

    MESSAGE_SEND: 'message:send',
    MESSAGE_SENT: 'message:sent',
    MESSAGE_RECEIVE: 'message:receive'
};