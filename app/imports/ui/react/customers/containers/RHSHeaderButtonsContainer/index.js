import { compose, withHandlers } from 'recompose';

import { onModalOpen } from './handlers';
import HeaderButtons from '../../components/RHS/HeaderButtons';

export default compose(
  withHandlers({
    onModalOpen,
  }),
)(HeaderButtons);
