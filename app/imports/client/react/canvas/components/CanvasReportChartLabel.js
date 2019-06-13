import styled from 'styled-components';
import { prop } from 'ramda';

const CanvasReportChartLabel = styled.li`
  display: flex;
  justify-content: space-between;
  & > span:first-child {
    padding-left: 17px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 4px;
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 5px;
      background-color: ${prop('color')};
      -webkit-print-color-adjust: exact;
    }
  }
`;

export default CanvasReportChartLabel;
