export default {
  mapFilters(filters) {
    return _.map(filters, (label, id) => ({
      label,
      id,
    }));
  },
};
