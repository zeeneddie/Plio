import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';


export default BackgroundApp = {

  _connection: null,

  isConnected() {
    const conn = this._connection;
    return conn && (conn.status().connected === true);
  },

  connect() {
    const url = Meteor.settings.backgroundApp.url;
    this._connection = DDP.connect(url);
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
