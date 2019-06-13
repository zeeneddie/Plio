import { setMinimumBrowserVersions } from 'meteor/modern-browsers';

setMinimumBrowserVersions({
  // Force meteor to treat edge as legacy browser
  // Fixes https://github.com/meteor/meteor/issues/10251#issuecomment-450824486
  edge: Infinity,
  ie: Infinity,
  mobile_safari: Infinity,
});
