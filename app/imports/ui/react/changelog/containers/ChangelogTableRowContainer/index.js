import { compose, withProps } from 'recompose';

import ChangelogTableRow from '../../components/ChangelogTableRow';
import { getFormattedDate, getUserFullNameOrEmail } from '/imports/share/helpers';

export default compose(
  withProps(({ date, user, message }) => ({
    prettyDate: getFormattedDate(date, 'DD MMM YYYY, h:mm A'),
    userName: getUserFullNameOrEmail(user),
    message,
  }))
)(ChangelogTableRow);
