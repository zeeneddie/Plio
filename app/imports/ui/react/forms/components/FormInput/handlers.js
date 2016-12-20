export const onHandleBlur = ({ onBlur, value }) => (e) => {
  const targetValue = e.target.value;

  if (targetValue === value) return false;

  return typeof onBlur === 'function' && onBlur(e);
};
