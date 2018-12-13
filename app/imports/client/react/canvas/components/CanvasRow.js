import styled from 'styled-components';
import is from 'styled-is';
import { StyledMixins } from 'plio-util';

const CanvasRow = styled.div`
  ${StyledMixins.media.tabletPortrait`
    display: flex;
    flex: 1;
    flex-wrap: wrap;
  `}

  ${StyledMixins.media.printAndDesktop`
    display: flex;
    flex: 1;
    flex-wrap: nowrap;

    ${is('oneThird')`
      min-height: 33.33333%;
    `}

    ${is('twoThirds')`
      min-height: 66.66666%;
    `}
  `}
`;

export default CanvasRow;
