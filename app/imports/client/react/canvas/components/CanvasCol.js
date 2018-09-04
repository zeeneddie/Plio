import styled from 'styled-components';
import is from 'styled-is';
import { StyledMixins } from 'plio-util';

const CanvasCol = styled.div`
  width: 100%;

  ${is('sm')`
    ${StyledMixins.media.notMobile`
      display: flex;
      flex: 1;
      flex-direction: column;
    `}
  `}

  ${is('md')`
    ${StyledMixins.media.tabletPortrait`
      display: flex;
    `}

    ${StyledMixins.media.desktop`
      display: flex;
      flex: 1;
      flex-direction: column;
    `}
  `}
`;

export default CanvasCol;
