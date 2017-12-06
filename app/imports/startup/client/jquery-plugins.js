jQuery.fn.isAlmostVisible = function jQueryIsAlmostVisible() {
  if (this.length === 0) {
    return;
  }
  const rect = this[0].getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (jQuery(window).height() * 1.5 + 100)
  );
};
