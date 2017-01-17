import set from 'lodash.set';

export const getFormProps = ({ data, documentKey }) => {
  const initialFormData = {
    [documentKey]: data,
  };

  const fieldNames = {};
  Object.keys(data).forEach(key => (
    set(fieldNames, key, `${documentKey}.${key}`)
  ));

  return { initialFormData, fieldNames };
};
