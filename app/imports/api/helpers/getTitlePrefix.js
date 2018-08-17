export default (title) => {
  let titlePrefix;
  const matchedPrefixArray = title.match(/^[\d\.]+/g);

  if (matchedPrefixArray && matchedPrefixArray.length) {
    const stringPrefix = matchedPrefixArray[0];

    // Convert 1.2.3.4 to 1.2345 for sorting purposes
    const stringPrefixFloat = stringPrefix
      .replace(/^([^.]*\.)(.*)$/, (a, b, c) => b + c.replace(/\./g, ''));
    titlePrefix = parseFloat(stringPrefixFloat);

    if (!titlePrefix && titlePrefix !== 0) {
      titlePrefix = title;
    }
  } else {
    titlePrefix = title;
  }

  return titlePrefix;
};
