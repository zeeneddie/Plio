import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { propEqId } from '/imports/api/helpers';
import { addCollapsed } from '/client/redux/actions/globalActions';
import { createHelpSectionItem } from '../../helpers';
import { goTo } from '/imports/ui/utils/router/actions';

export const redirectToHelpDoc = ({ urlItemId, helpDocs, helpSectionsData }) => {
  const helpDoc = helpDocs.find(propEqId(urlItemId));
  const shouldRedirect = FlowRouter.getRouteName() === 'helpDocs' || !helpDoc;

  if (shouldRedirect && helpSectionsData.length) {
    const params = {
      helpId: helpSectionsData[0].helpDocs[0]._id,
    };
    Meteor.defer(() => goTo('helpDoc')(params));
  }
};

export const expandHelpSection = ({ urlItemId, helpDocs, dispatch }) => {
  const { sectionId } = helpDocs.find(propEqId(urlItemId)) || {};

  if (sectionId) {
    const sectionItem = createHelpSectionItem(sectionId);
    dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
  }
};
