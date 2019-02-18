import { useState, useCallback } from 'react';

const isSyntheticEvent = candidate => !!(
  candidate && typeof candidate.stopPropagation === 'function'
);

const useToggle = (state) => {
  const [value, setValue] = useState(state);
  const toggle = useCallback((nextValue) => {
    // if it's a React SyntheticEvent, handle as if was was undefined
    if (typeof nextValue !== 'undefined' && !isSyntheticEvent(nextValue)) {
      setValue(!!nextValue);
    } else {
      setValue(val => !val);
    }
  }, [setValue]);

  return [value, toggle];
};

export default useToggle;
