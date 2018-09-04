export const createCustomerTypeOptions = obj => Object.keys(obj).reduce((prev, key) => ([
  ...prev,
  { value: key, text: obj[key] },
]), []);
