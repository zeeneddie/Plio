import { withProps } from 'recompose';

import { getFormattedDate, getUserFullNameOrEmail } from '/imports/share/helpers';
import ChangelogTableRow from '../../components/ChangelogTableRow';
import propTypes from './propTypes';

const ChangelogTableRowContainer = withProps(({ date, executor, message }) => ({
  message,
  prettyDate: getFormattedDate(date, 'DD MMM YYYY, h:mm A'),
  userName: getUserFullNameOrEmail(executor),
}))(ChangelogTableRow);

ChangelogTableRowContainer.propTypes = propTypes;

export default ChangelogTableRowContainer;
