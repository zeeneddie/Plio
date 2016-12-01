import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { addCollapsed } from '/client/redux/actions/globalActions';
import { createHelpSectionItem } from '../../helpers';

export const redirectToHelpDoc = ({ urlItemId, helpDocs, helpSectionsData }) => {
  const helpDoc = helpDocs.find(help => help._id === urlItemId);
  const shouldRedirect = FlowRouter.getRouteName() === 'helpDocs' || !helpDoc;

  if (shouldRedirect && helpSectionsData.length) {
    const params = {
      helpId: helpSectionsData[0].helpDocs[0]._id,
    };

    Meteor.defer(() => FlowRouter.go('helpDoc', params));
  }
};

export const expandHelpSection = ({ urlItemId, helpDocs, dispatch }) => {
  const { sectionId } = helpDocs.find(help => help._id === urlItemId) || {};

  if (sectionId) {
    const sectionItem = createHelpSectionItem(sectionId);
    dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
  }
};
