import { Template } from 'meteor/templating';

import { insert } from '/imports/api/non-conformities/methods';
import { setModalError } from '/imports/api/helpers';
import { ProblemTypes } from '../../../../../share/constants';

Template.NC_Create.viewmodel({
  mixin: ['organization', 'nonconformity', 'router', 'getChildrenData'],
  isStandardsEditable: true,
  standardsIds: [],
  NCGuidelines() {
    return this.organization().ncGuidelines;
  },
  validate(data) {
    let valid = true;

    Object.keys(data).forEach((key) => {
      if (key !== 'description' && !data[key]) {
        valid = false;
        // eslint-disable-next-line max-len
        const errorMessage = `The new nonconformity cannot be created without a ${key}. Please enter a ${key} for your nonconformity.`;
        setModalError(errorMessage);
      }
    });

    return valid;
  },
  save() {
    const data = this.getData();

    if (this.validate(data)) {
      const organizationId = this.organizationId();
      const args = {
        ...data,
        organizationId,
        type: ProblemTypes.NON_CONFORMITY,
      };

      const cb = (_id, open) => {
        this.goToNC(_id, false);

        open({
          _id,
          _title: 'Non-conformity',
          template: 'NC_Card_Edit',
        });
      };

      return this.card.insert(insert, args, cb);
    }

    return null;
  },
  getData() {
    return this.getChildrenData();
  },
});
