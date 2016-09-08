import { ViewModel } from 'meteor/manuel:viewmodel';

import mixins from './mixins.js';
import vmTraverse from './vmTraverse.js';

ViewModel.mixin({
  ...mixins,
  vmTraverse
});
