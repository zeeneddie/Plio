import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { withHandlers } from 'recompose';

import { Icon } from '../../components';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasSectionHelp from './CanvasSectionHelp';
import CanvasAddButton from './CanvasAddButton';

const enhance = withHandlers({
  onLink: ({ sectionName }) => () => {
    const section = document.querySelector(`ul.${sectionName}`);
    if (section) {
      section.scrollTop = section.scrollHeight;
    }
  },
});

const StyledIcon = styled(Icon)`
  font-size: 24px;
`;

const CanvasHeading = ({
  label,
  renderModal,
  isOpen,
  toggle,
  isEmpty,
  help,
  icon,
  onLink,
}) => (
  <Fragment>
    <CanvasSectionHeading>
      <h4>{label}</h4>
      {!!renderModal && renderModal({ isOpen, toggle, onLink })}
      {toggle ? (
        <CanvasAddButton {...{ icon }} onClick={isEmpty ? undefined : toggle} />
      ) : (
        !!icon && <StyledIcon name={icon} />
      )}
    </CanvasSectionHeading>
    {isEmpty && help && (
      <CanvasSectionHelp>
        {help}
      </CanvasSectionHelp>
    )}
  </Fragment>
);

CanvasHeading.propTypes = {
  label: PropTypes.string.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  renderModal: PropTypes.func,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  help: PropTypes.node,
  icon: PropTypes.string,
  sectionName: PropTypes.string.isRequired,
  onLink: PropTypes.func,
};

export default enhance(CanvasHeading);
