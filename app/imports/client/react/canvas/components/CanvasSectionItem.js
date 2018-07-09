import styled from 'styled-components';
import is from 'styled-is';

const CanvasSectionItem = styled.li`
  margin: 0 -0.5rem .5rem;
  border-radius: 3px;
  transition: background 0.4 ease;
  padding: 0 0.5rem;
  cursor: move;

  &:hover {
    background: #eee;
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

export default CanvasSectionItem;
