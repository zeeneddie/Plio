import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import { CanvasStyles } from '../constants';


const CanvasSectionItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0px ${CanvasStyles.sectionPadding};
  flex: 1;
  ${StyledMixins.scroll};

  li span {
    overflow: hidden;
    display: block;
  }
`;

export default CanvasSectionItems;
