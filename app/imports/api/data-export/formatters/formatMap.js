function formatMap(map) {
  return (value) => {
    if (!map[value]) throw new Error(`Value ${value} not found in map`);

    return map[value];
  };
}

export { formatMap };
