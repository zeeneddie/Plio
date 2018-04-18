import { Template } from 'meteor/templating';

import { StringLimits } from '/imports/share/constants.js';
import get from 'lodash.get';

Template.SimpleSelection_Edit_Item.viewmodel({
  mixin: 'callWithFocusCheck',
  placeholder: '',
  showAbbreviation: false,
  requireAbbreviation: false,
  abbreviationMaxLength: StringLimits.abbreviation.max,
  disabled: false,
  onChange() {},
  onFocusOut(e) {
    const data = prop => ({
      current: get(this.getData(), prop),
      stored: get(this.templateInstance.data, prop),
    });
    const title = data('title');
    const abbr = data('abbreviation');

    if (this.showAbbreviation()) {
      if (!title.current || (title.current === title.stored && abbr.current === abbr.stored)) {
        return;
      }
    } else if (!title.current || title.current === title.stored) {
      return;
    }

    this.callWithFocusCheck(e, () => this.onChange(this));
  },
  onDelete() {},
  onDeleteFn() {
    return () => this.onDelete(this);
  },
  getData() {
    return { ...this.data() };
  },
});
