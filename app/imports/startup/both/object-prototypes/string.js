String.prototype.capitalize = function () {
  return this ? this.charAt(0).toUpperCase() + this.slice(1) : '';
};
