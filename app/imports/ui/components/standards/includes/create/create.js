import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';

import { insert } from '/imports/api/standards/methods.js';
import { addedToNotifyList } from '/imports/api/standards/methods.js';
import Utils from '/imports/core/utils.js';
import { setModalError, inspire } from '/imports/api/helpers.js';

Template.CreateStandard.viewmodel({
  mixin: ['standard', 'numberRegex', 'organization', 'router', 'getChildrenData'],
  save() {
    const data = this.getChildrenData();

    for (let key in data) {
      if (!data[key]) {
        let errorMessage;
        if (key === 'title') {
          errorMessage = `The new standard cannot be created without a title. Please enter a title for your standard`;
          setModalError(errorMessage);
          return;
        } else if (key === 'sectionId') {
          errorMessage = `The new standard cannot be created without a section. You can create a new section by typing it's name into the corresponding text input`;
          setModalError(errorMessage);
          return;
        } else if (key === 'typeId') {
          errorMessage = `The new standard cannot be created without a type. You can create a new standard type in Org settings`;
          setModalError(errorMessage);
          return;
        } else {
          const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
          setModalError(errorMessage);
          return;
        }
      }
    }

    this.insert(data);
  },
  insert({ title, sectionId, typeId, owner, status }) {
    const number = this.parseNumber(title);
    const nestingLevel = (number && number[0].split('.').length) || 1;

    if (nestingLevel > 4) {
      setModalError('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    const args = {
      title,
      sectionId,
      typeId,
      owner,
      status,
      nestingLevel,
      ...inspire(['organizationId'], this)
    };

    const cb = (_id, open) => {
      this.isActiveStandardFilter('deleted')
        ? this.goToStandard(_id, false)
        : this.goToStandard(_id);

      open({
        _id,
        _title: 'Compliance standard',
        template: 'EditStandard'
      })
    };

    return invoke(this.card, 'insert', insert, args, cb);
  }
});
