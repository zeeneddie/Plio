import { FlowRouter } from 'meteor/kadira:flow-router';
import { goToStandard } from '../../../helpers/routeHelpers';

import { getId, pickC, hasC, getC, propEqId, shallowCompare, findById } from '/imports/api/helpers';
import {
  getSelectedAndDefaultStandardByFilter,
  createTypeItem,
  createSectionItem,
} from '../../helpers';
import { chainActions, addCollapsed } from '/client/redux/actions/globalActions';

export const redirectByFilter = (props) => {
  const { filter, orgSerialNumber } = props;
  const {
    selected: selectedStandard,
    default: defaultStandard,
  } = getSelectedAndDefaultStandardByFilter(props);
  const shouldRedirect = FlowRouter.getRouteName() === 'standards' || !selectedStandard;

  if (shouldRedirect) {
    const queryParams = { filter };

    if (!defaultStandard) {
      FlowRouter.withReplaceState(() =>
        FlowRouter.go('standards', { orgSerialNumber }, queryParams));
    } else {
      const { standards, urlItemId } = props;

      if (!urlItemId || (urlItemId && findById(urlItemId, standards))) {
        const params = {
          orgSerialNumber,
          urlItemId: getId(defaultStandard),
        };
        goToStandard(params, queryParams);
      }
    }
  }
};

export const openStandardByFilter = (props) => {
  const { filter } = props;
  const {
    containedIn,
    defaultContainedIn,
    selected: selectedStandard,
  } = getSelectedAndDefaultStandardByFilter(props);
  const parentItem = selectedStandard ? containedIn : defaultContainedIn;
  const topLevelKey = getId(parentItem);

  switch (filter) {
    case 1:
    default: {
      const sectionItem = createSectionItem(topLevelKey);
      props.dispatch(addCollapsed({ ...sectionItem, close: { type: sectionItem.type } }));
      break;
    }
    case 2: {
      const secondLevelKey = getId(getC('children[0]', parentItem));
      const typeItem = createTypeItem(topLevelKey);
      const sectionItem = createSectionItem(secondLevelKey);
      const typeItemWithClose = { ...typeItem, close: { type: typeItem.type } };
      const sectionItemWithClose = { ...sectionItem, close: { type: sectionItem.type } };
      // Uncategorized type does not have a second level key
      if (secondLevelKey) {
        props.dispatch(chainActions([typeItemWithClose, sectionItemWithClose].map(addCollapsed)));
      } else {
        props.dispatch(addCollapsed(typeItemWithClose));
      }
      break;
    }
    case 3:
      return;
  }
};

const shouldUpdateForStandard = (props, nextProps) => {
  const pickKeys = pickC(['sectionId', 'typeId']);
  const hasIsDeleted = hasC('isDeleted');
  const getIsDeleted = getC('isDeleted');

  return !!(
    props.standard &&
    nextProps.standard &&
    props.standard._id === nextProps.standard._id &&
    shallowCompare(pickKeys(props.standard), pickKeys(nextProps.standard)) ||
    ((hasIsDeleted(props.standard) && hasIsDeleted(nextProps.standard)) &&
      getIsDeleted(props.standard) !== getIsDeleted(nextProps.standard))
  );
};

export const shouldUpdateForProps = (props, nextProps) => !!(
  props.isDiscussionOpened !== nextProps.isDiscussionOpened ||
  props.loading !== nextProps.loading ||
  typeof props.organization !== typeof nextProps.organization ||
  props.orgSerialNumber !== nextProps.orgSerialNumber ||
  props.filter !== nextProps.filter ||
  typeof props.standard !== typeof nextProps.standard ||
  shouldUpdateForStandard(props, nextProps)
);
