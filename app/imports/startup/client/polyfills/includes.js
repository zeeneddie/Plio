// IE/Edge
if (![].includes) {
  Array.prototype.includes = function (searchElement/* , fromIndex */) {
    const O = Object(this);
    const len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    const n = parseInt(arguments[1]) || 0;
    let k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    while (k < len) {
      const currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)
      ) {
        return true;
      }
      k++;
    }
    return false;
  };
}
