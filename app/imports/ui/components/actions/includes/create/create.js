import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { ActionPlanOptions } from '/imports/share/constants';
import { insert } from '/imports/api/actions/methods';
import { getTzTargetDate, getWorkflowDefaultStepDate } from '/imports/share/helpers';
import { setModalError, inspire } from '/imports/api/helpers';

Template.Actions_Create.viewmodel({
  mixin: ['workInbox', 'organization', 'router', 'getChildrenData'],
  type: '',
  title: '',
  autorun() {
    const data = this.getData();
    if (data && data.ownerId) {
      this.defaultToBeCompletedBy(data.ownerId);
    }
  },
  ownerId() { return Meteor.userId(); },
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate() {
    const organization = this.organization();
    const linkedToVM = this.child('Actions_LinkedTo_Edit');
    const linkedTo = linkedToVM && linkedToVM.linkedTo() || [];

    return getWorkflowDefaultStepDate({ organization, linkedTo });
  },
  toBeCompletedBy() {
    return this.defaultToBeCompletedBy() || this.ownerId();
  },
  defaultToBeCompletedBy: '',
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  save() {
    const data = this.getData();

    /* eslint-disable */
    for (const key in data) {
      if (!data[key]) {
        const errorMessage = `The new action cannot be created without a ${key}. Please enter a ${key} for your action.`;
        setModalError(errorMessage);
        return;
      }
    }
    /* eslint-enable */

    this.insert(data);
  },
  insert({ completionTargetDate, ...args }) {
    const { organizationId, organization = {} } = inspire(['organization', 'organizationId'], this);
    const { type } = this.data();

    const { timezone } = organization;
    const tzDate = getTzTargetDate(completionTargetDate, timezone);

    const allArgs = {
      ...args,
      type,
      organizationId,
      completionTargetDate: tzDate,
    };

    const cb = (_id, open) => {
      const action = this._getActionByQuery({ _id });
      const workItem = this._getWorkItemByQuery({ 'linkedDoc._id': _id });
      const queryParams = this._getQueryParams(workItem)(Meteor.userId());

      if (workItem) this.goToWorkItem(workItem._id, queryParams);

      open({
        _id,
        _title: action ? this._getNameByType(action.type) : '',
        template: 'Actions_Edit',
      });
    };

    return invoke(this.card, 'insert', insert, allArgs, cb);
  },
  getData() {
    return this.getChildrenData();
  },
});
