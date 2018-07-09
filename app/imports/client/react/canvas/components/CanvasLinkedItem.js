import styled from 'styled-components';

import { Styles } from '../../../../api/constants';

const CanvasLinkedItem = styled.div`
  overflow: hidden;
  color: ${Styles.color.muted};
  margin-top: 2px;
  line-height: 1.4;

  i {
    line-height: inherit;
    float: left;
    margin-right: 5px;
  }
`;

export default CanvasLinkedItem;
