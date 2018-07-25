import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';
import { omit } from 'ramda';

import {
  ActionPlanOptions,
  ActionTypes,
  DocumentTypes,
  StringLimits,
} from '../../../../../share/constants';
import { insert } from '../../../../../api/actions/methods';
import { getTzTargetDate, getWorkflowDefaultStepDate } from '../../../../../share/helpers';
import { setModalError, inspire } from '../../../../../api/helpers';
import { addActionToGoalFragment } from '../../../../../client/apollo/utils';
import { client } from '../../../../../client/apollo';
import { Query } from '../../../../../client/graphql';

Template.Actions_Create.viewmodel({
  mixin: ['workInbox', 'organization', 'router', 'getChildrenData'],
  type: '',
  title: '',
  ActionTypes,
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
  titleArgs() {
    return {
      label: 'Title',
      title: this.title(),
      maxLength: StringLimits.longTitle.max,
    };
  },
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
      ...(type === ActionTypes.GENERAL_ACTION ? omit(['planInPlace'], args) : args),
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

      // update cache to show new action on goals chart
      if (type === ActionTypes.GENERAL_ACTION) {
        client.query({
          query: Query.ACTION_CARD,
          variables: { _id },
        }).then(({ data: { action: { action: fetchedAction } } }) => {
          allArgs.linkedTo.forEach(({ documentId, documentType }) => {
            if (documentType === DocumentTypes.GOAL) {
              addActionToGoalFragment(documentId, fetchedAction, client);
            }
          });
        });
      }
    };

    return invoke(this.card, 'insert', insert, allArgs, cb);
  },
  getData() {
    return this.getChildrenData();
  },
});
