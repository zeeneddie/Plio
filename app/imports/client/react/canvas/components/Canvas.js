import styled from 'styled-components';
import { StyledMixins } from 'plio-util';
import { CanvasStyles } from '../constants';

const Canvas = styled.div`
  width: 100%;
  min-height: 100%;
  background: white;

  ${StyledMixins.media.notMobile`
    min-height: ${CanvasStyles.itemMinHeight * 3}px;
    flex: 1;
  `}

  ${StyledMixins.media.desktop`
    display: flex;
    flex-direction: column;
  `}
`;

export default Canvas;
