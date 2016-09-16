export default class Counter {
  constructor(name, cursor, interval) {
    this.name = name;
    this.cursor = cursor;
    this.interval = interval || 500 * 10;
    this._collectionName = 'counters-collection';
  }

  _getCollectionName() {
    return `counter-${this._collectionName}`;
  }

  _publishCursor(sub) {
    let count = this.cursor.count();

    sub.added(this._collectionName, this.name, { count });

    const handler = Meteor.setInterval(() => {
      count = this.cursor.count();
      sub.changed(this._collectionName, this.name, { count });
    }, this.interval);

    sub.onStop(() => Meteor.clearInterval(handler));
  }
}
