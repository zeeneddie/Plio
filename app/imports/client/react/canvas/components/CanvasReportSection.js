import styled from 'styled-components';

import { Styles } from '../../../../api/constants';

const CanvasReportSection = styled.section`
  padding: 30px 43px;
  min-height: 500px;
  background: ${Styles.background.color.white};
  &:not(:first-child) {
    margin-top: 50px;
    page-break-before: always;
  }
  @media print {
    padding: 0;
    &:not(:first-child) {
      margin-top: 0;
    }
    @page {
      size: landscape
    }
  }
`;

export default CanvasReportSection;
