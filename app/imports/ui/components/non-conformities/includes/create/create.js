import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { insert } from '/imports/api/non-conformities/methods';
import { setModalError, inspire } from '/imports/api/helpers';

Template.NC_Create.viewmodel({
  mixin: ['organization', 'nonconformity', 'router', 'getChildrenData'],
  isStandardsEditable: true,
  standardsIds: [],
  NCGuidelines() {
    return this.organization().ncGuidelines;
  },
  save() {
    const data = this.getData();

    for (const key in data) {
      if (!data[key]) {
        const errorMessage = `The new nonconformity cannot be created without a ${key}. Please enter a ${key} for your nonconformity.`;
        return setModalError(errorMessage);
      }
    }

    this.insert(data);
  },
  insert({ ...args }) {
    const allArgs = {
      ...args,
      ...inspire(['organizationId'], this),
    };

    const cb = (_id, open) => {
      this.goToNC(_id, false);

      open({
        _id,
        _title: 'Nonconformity',
        template: 'NC_Card_Edit',
      });
    };

    return invoke(this.card, 'insert', insert, allArgs, cb);
  },
  getData() {
    return this.getChildrenData();
  },
});
