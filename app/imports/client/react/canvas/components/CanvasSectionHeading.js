import styled from 'styled-components';

import { CanvasStyles } from '../constants';
import { Styles } from '../../../../api/constants';

const CanvasSectionHeading = styled.div`
  padding: ${CanvasStyles.sectionPadding};
  display: flex;
  align-items: flex-start;

  h4 {
    font-size: 18px;
    line-height: 1.2;
    font-family: ${Styles.font.family.segoe.semibold};
    margin: 0;
    flex: 1;
  }
`;

export default CanvasSectionHeading;
