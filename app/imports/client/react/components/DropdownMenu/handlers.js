import { KeyMap } from '/imports/api/constants';

export const handleKeyDown = ({ focused, setFocus, children }) => (e) => {
  let nextFocused = null;
  e.preventDefault();

  if (e.keyCode === KeyMap.up) {
    if (focused === 0 || focused === null) nextFocused = children.length - 1;
    else nextFocused = focused - 1;
  } else if ((e.keyCode === KeyMap.down || e.keyCode === KeyMap.tab)) {
    if (focused === children.length - 1) nextFocused = 0;
    // when tab is first time pressed this event will not fire
    else if (focused === null && children.length > 0) nextFocused = 1;
    else nextFocused = focused + 1;
  }

  return setFocus(nextFocused);
};
