export const parseInputValue = ({
  value: inputValue,
  type,
  min,
  max,
}) => {
  if (inputValue === '') return undefined;

  let value = inputValue;

  if (type === 'number') {
    value = Number(value);

    if (max && value > max) return max;
    if (min && value < min) return min;
  }

  return value;
};
