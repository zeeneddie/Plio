import { keyMap } from '/imports/ui/constants';

export const handleKeyDown = ({ focused, setFocus, users }) => (e) => {
  e.preventDefault();

  if (e.keyCode === keyMap.up) {
    if (focused === 0 || focused === null) setFocus(users.length - 1);
    else setFocus(focused - 1);
  } else if ((e.keyCode === keyMap.down || e.keyCode === keyMap.tab)) {
    if (focused === users.length - 1) setFocus(0);
    // when tab is first time pressed this event will not fire
    else if (focused === null && users.length > 0) setFocus(1);
    else setFocus(focused + 1);
  }
};
