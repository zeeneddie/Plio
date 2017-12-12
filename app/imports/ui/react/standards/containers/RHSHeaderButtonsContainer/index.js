import { compose, mapProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { getPath } from '../../../../utils/router/paths';
import {
  onToggleScreenMode,
  onModalOpen,
  onRestore,
  onDelete,
} from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';
import { getRHSHeaderButtons } from '../../../../../client/store/selectors/standards';

export default compose(
  connect(getRHSHeaderButtons),
  mapProps(({
    standard: { _id, title, isDeleted = false },
    ...props
  }) => {
    const pathToDiscussion = getPath('standardDiscussion')({ urlItemId: _id });

    return {
      ...props,
      _id,
      title,
      isDeleted,
      pathToDiscussion,
    };
  }),
  withHandlers({
    onToggleScreenMode,
    onModalOpen,
    onRestore,
    onDelete,
  }),
)(HeaderButtons);
