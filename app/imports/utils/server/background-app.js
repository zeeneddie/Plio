import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';


export default BackgroundApp = {

  _connection: null,

  _url: null,

  getUrl() {
    return this._url;
  },

  setUrl(url) {
    this._url = url;
  },

  isConnected() {
    const conn = this._connection;
    return conn && (conn.status().connected === true);
  },

  connect() {
    if (!this._connection) {
      this._connection = DDP.connect(this.getUrl());
    } else {
      this._connection.reconnect();
    }
  },

  disconnect() {
    if (this._connection) {
      this._connection.disconnect();
    }
  },

  call(method, args, cb) {
    if (_.isFunction(args)) {
      cb = args;
      args = {};
    }

    return this._connection.call(method, args, cb);
  }

};
