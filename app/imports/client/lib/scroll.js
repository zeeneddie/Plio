export const wheelDistance = function(evt) {
  if (!evt) evt = event;
  var w = evt.wheelDelta, d = evt.detail;
  if (d) {
    if (w) return w/d/40*d>0?1 : -1; // Opera
    else return -d/3;              // Firefox;
  } else return w/120;             // IE/Safari/Chrome
};

export const wheelDirection = function(evt) {
  if (!evt) evt = event;
  return (evt.detail < 0) ? 1 : (evt.wheelDelta > 0) ? 1 : -1;
};

export const handleMouseWheel = function(el, listener, operation = 'addEventListener') {
  if (el) {
    if (el[operation]) {
      el[operation]('mousewheel', listener, false);     // Chrome/Safari/Opera
      el[operation]('DOMMouseScroll', listener, false); // Firefox
    } else {
      // IE
      if (operation === 'addEventListener') operation = 'attachEvent';
      else if (operation === 'removeEventListener') operation = 'detachEvent';

      if (el[operation]) {
        el[operation]('onmousewheel', listener);
      }
    }
  }
};
