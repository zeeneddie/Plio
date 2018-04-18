import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { lifecycle, defaultProps, compose } from 'recompose';

import { Collapse, CardBlock, Icon } from '../';

const enhance = compose(
  defaultProps({
    scroll: true,
  }),
  lifecycle({
    componentDidUpdate({ errorText }) {
      if (
        this.props.errorText &&
        this.props.scroll &&
        this.props.errorText !== errorText
      ) {
        document.getElementsByClassName('modal-error-section')[0].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
  }),
);

export const ErrorSection = ({
  errorText,
  size = '4',
  className,
  scroll, // eslint-disable-line no-unused-vars
  tag: Tag = 'pre',
  ...props
}) => (
  <Collapse
    className={cx('modal-error-section', className)}
    isOpen={!!errorText}
    {...props}
  >
    <CardBlock>
      <Icon {...{ size }} name="exclamation-circle" aria-hidden="true" />
      {errorText && (<Tag>{errorText}</Tag>)}
    </CardBlock>
  </Collapse>
);

ErrorSection.propTypes = {
  errorText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.string,
  className: PropTypes.string,
  scroll: PropTypes.bool,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

export default enhance(ErrorSection);
