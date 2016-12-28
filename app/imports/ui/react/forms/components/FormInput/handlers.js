/* eslint-disable no-param-reassign */

export const onHandleBlur = ({ onBlur, value }) => (e) => {
  const targetValue = e.target.value;

  if (targetValue === value) return false;

  return typeof onBlur === 'function' && onBlur(e);
};

export const onHandleClear = () => () => (input) => {
  input.value = '';
  input.focus();
};
