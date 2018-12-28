import styled from 'styled-components';
import { StyledMixins } from 'plio-util';
import is from 'styled-is';

import { CanvasStyles } from '../constants';
import { Styles } from '../../../../api/constants';

const CanvasSection = styled.div`
  border: 2px solid ${CanvasStyles.borderColor};
  transition: background-color 0.4s ease, border-color 0.4s ease;
  margin: -1px;

  ${StyledMixins.media.notMobile`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: ${CanvasStyles.itemMinHeight}px;
  `}

  ${StyledMixins.media.tabletPortrait`
    max-height: 400px;
  `}
  
  ${StyledMixins.media.print`
    max-height: inherit;
  `}

  ${is('empty')`
    ul {
      display: none;
    }
    
    &:hover {
      cursor: pointer;
      background: #f5f5f5;
      border-color: ${Styles.color.blue};
      z-index: 2;

      .btn-add {
        color: ${Styles.color.blue};
      }
    }
  `}
`;

export default CanvasSection;
