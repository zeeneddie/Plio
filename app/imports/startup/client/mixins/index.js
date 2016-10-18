import { ViewModel } from 'meteor/manuel:viewmodel';

import mixins from './mixins';
import vmTraverse from './vmTraverse';
import getChildrenData from './getChildrenData';
import notifications from './notifications';
import modal from './modal';

ViewModel.mixin({
  ...mixins,
  vmTraverse,
  getChildrenData,
  notifications,
  modal
});
