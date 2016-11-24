import { withProps } from 'recompose';

import { getFormattedDate, getUserFullNameOrEmail } from '/imports/share/helpers';
import ChangelogTableRow from '../../components/ChangelogTableRow';
import propTypes from './propTypes';

const ChangelogTableRowContainer = withProps(({ date, user, message }) => ({
  message,
  prettyDate: getFormattedDate(date, 'DD MMM YYYY, h:mm A'),
  userName: getUserFullNameOrEmail(user),
}))(ChangelogTableRow);

ChangelogTableRowContainer.propTypes = propTypes;

export default ChangelogTableRowContainer;
