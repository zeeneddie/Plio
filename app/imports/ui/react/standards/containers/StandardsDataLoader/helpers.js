import { FlowRouter } from 'meteor/kadira:flow-router';

import { getId, pickC, hasC, getC, propEqId, shallowCompare } from '/imports/api/helpers';
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
    if (defaultStandard) {
      const params = {
        orgSerialNumber,
        urlItemId: getId(defaultStandard),
      };
      FlowRouter.go('standard', params, queryParams);
    } else {
      FlowRouter.go('standards', { orgSerialNumber }, queryParams);
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
      // Uncategorized type do not have a second level key
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

const isSameStandard = (props, nextProps) => propEqId(props.standard, nextProps.standard);

const shouldUpdateForStandard = (props, nextProps) => {
  const pickKeys = pickC(['sectionId', 'typeId']);
  const hasIsDeleted = hasC('isDeleted');
  const getIsDeleted = getC('isDeleted');

  return (
    isSameStandard(props, nextProps) &&
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
