import { KeyMap } from '/imports/api/constants';

export const handleKeyDown = ({ focused, setFocus, users }) => (e) => {
  e.preventDefault();

  if (e.keyCode === KeyMap.up) {
    if (focused === 0 || focused === null) setFocus(users.length - 1);
    else setFocus(focused - 1);
  } else if ((e.keyCode === KeyMap.down || e.keyCode === KeyMap.tab)) {
    if (focused === users.length - 1) setFocus(0);
    // when tab is first time pressed this event will not fire
    else if (focused === null && users.length > 0) setFocus(1);
    else setFocus(focused + 1);
  }
};
