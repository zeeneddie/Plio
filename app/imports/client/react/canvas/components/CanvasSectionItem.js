import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

const CanvasSectionItem = styled.li`
  margin: 0 -0.5rem 0;
  border-radius: 3px;
  transition: background .4s ease;
  padding: 0 .5rem 0 0;
  cursor: pointer;
  overflow: hidden;
  display: flex;

  &:hover {
    background-color: #eee;
  }

  & > span:not(.drag-handle) {
    padding: 4px 0;
  }

  ${is('placeholder')`
    position: relative;
    height: 21px;
    border: 1px dashed #ddd;

    &:before {
      position: absolute;
    }
  `}
`;

CanvasSectionItem.propTypes = {
  'data-id': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CanvasSectionItem;
