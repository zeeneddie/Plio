import Counter from '/imports/api/counter/client.js';

export default {
  get(name) {
    return Counter.get(name);
  },
};
