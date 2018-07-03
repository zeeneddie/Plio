/* eslint-disable no-param-reassign */

export const onHandleBlur = ({ onBlur, value }) => (e) => {
  const targetValue = e.target.value;

  if (targetValue === value) return false;

  return typeof onBlur === 'function' && onBlur(e);
};

export const onHandleClear = ({ onChange }) => (e, input) => {
  input.value = '';
  input.focus();
  return onChange && onChange({ ...e, target: input });
};
