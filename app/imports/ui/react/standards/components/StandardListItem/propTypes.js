import PropTypes from 'prop-types';

export default {
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  href: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  issueNumber: PropTypes.number,
  isDeleted: PropTypes.bool,
  deletedByText: PropTypes.string,
  deletedAtText: PropTypes.string,
  unreadMessagesCount: PropTypes.number,
  isNew: PropTypes.bool,
  type: PropTypes.object,
};
