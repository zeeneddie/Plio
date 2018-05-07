import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { insert } from '/imports/api/risks/methods';
import { setModalError, inspire } from '/imports/api/helpers';

Template.Risks_Create.viewmodel({
  mixin: ['organization', 'router', 'getChildrenData'],
  isStandardsEditable: true,
  standardsIds: [],
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  validate(data) {
    let valid = true;

    Object.keys(data).forEach((key) => {
      if (key !== 'description' && !data[key]) {
        valid = false;
        // eslint-disable-next-line max-len
        const errorMessage = `The new risk cannot be created without a ${key}. Please enter a ${key} for your risk.`;
        setModalError(errorMessage);
      }
    });

    return valid;
  },
  save() {
    const data = this.getData();

    if (!this.validate(data)) return;

    this.insert(data);
  },
  insert({ ...args }) {
    const allArgs = {
      ...args,
      ...inspire(['organizationId'], this),
    };

    const cb = (_id, open) => {
      this.goToRisk(_id, false);

      open({
        _id,
        _title: 'Risk',
        template: 'Risks_Card_Edit',
      });
    };

    invoke(this.card, 'insert', insert, allArgs, cb);
  },
  getData() {
    return this.getChildrenData();
  },
});
