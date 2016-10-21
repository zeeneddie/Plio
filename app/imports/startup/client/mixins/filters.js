export default {
  mapFilters(filters) {
    return _.map(filters, (label, id) => {
      return {
        label: label,
        id: id
      };
    });
  }
};