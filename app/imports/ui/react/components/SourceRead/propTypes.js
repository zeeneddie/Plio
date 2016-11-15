import { PropTypes } from 'react';

export default {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['url', 'attachment', 'video']),
  url: PropTypes.string,
  file: PropTypes.object,
};
