export default {
  getChildrenData() {
    return this.children(vm => vm.getData).reduce((prev, cur) =>
      ({ ...prev, ...cur.getData() }), {});
  },
};
