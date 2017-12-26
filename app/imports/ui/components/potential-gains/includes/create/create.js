import { Template } from 'meteor/templating';

import { setModalError } from '../../../../../api/helpers';

Template.PG_Create.viewmodel({
  mixin: ['organization', 'router', 'getChildrenData'],
  isStandardsEditable: true,
  standardsIds: [],
  guidelines() {
    return this.organization().ncGuidelines;
  },
  validate(data) {
    let valid = true;

    Object.keys(data).forEach((key) => {
      if (key !== 'description' && !data[key]) {
        valid = false;
        // eslint-disable-next-line max-len
        const errorMessage = `The new potential gain cannot be created without a ${key}. Please enter a ${key} for your potential gain.`;
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
      };
      const cb = (_id, open) => {
        this.goToNC(_id, false);

        open({
          _id,
          _title: 'Potential Gain',
          template: 'NC_Card_Edit',
        });
      };

      return this.card.insert(create, args, cb);
    }

    return null;
  },
  getData() {
    return this.getChildrenData();
  },
});
