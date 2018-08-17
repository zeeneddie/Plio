import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Fields_Standards_Read.viewmodel({
  mixin: ['organization', 'standard'],
  standardsIds: [],
  standards() {
    const ids = Array.from(this.standardsIds() || []);
    const orgSerialNumber = this.organizationSerialNumber();
    const standards = this._getStandardsByQuery({ _id: { $in: ids } });

    return standards.map(({ _id, title }) => {
      const href = FlowRouter.path('standard', { orgSerialNumber, urlItemId: _id });

      return { title, href };
    });
  },
});
