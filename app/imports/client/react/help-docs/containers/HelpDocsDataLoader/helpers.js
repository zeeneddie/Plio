import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { propEqId } from '../../../../../api/helpers';
import { addCollapsed } from '../../../../../client/store/actions/globalActions';
import { createHelpSectionsData, createHelpSectionItem } from '../../helpers';
import { goTo } from '../../../../../ui/utils/router/actions';

export const redirectToHelpDoc = ({
  urlItemId,
  helpDocs,
  helpSections,
  searchText,
  helpDocsFiltered,
}) => {
  const helpDoc = helpDocs.find(propEqId(urlItemId));

  const shouldRedirect = FlowRouter.getRouteName() === 'helpDocs'
    || !helpDoc
    || (searchText && helpDocsFiltered.length);

  const helpDocsFilteredByHelpId = (searchText && helpDocsFiltered.length)
    ? helpDocs.filter(help => helpDocsFiltered.includes(help._id))
    : helpDocs;

  const helpSectionsData = createHelpSectionsData(helpSections, helpDocsFilteredByHelpId);

  if (shouldRedirect && helpSectionsData.length) {
    const params = {
      helpId: helpSectionsData[0].helpDocs[0]._id,
    };
    const queryParams = {
      backRoute: FlowRouter.getQueryParam('backRoute'),
    };
    Meteor.defer(() => goTo('helpDoc')(params, queryParams));
  }
};

export const expandHelpSection = ({ urlItemId, helpDocs, dispatch }) => {
  const { sectionId } = helpDocs.find(propEqId(urlItemId)) || {};

  if (sectionId) {
    const sectionItem = createHelpSectionItem(sectionId);
    dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
  }
};
