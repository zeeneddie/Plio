import { css } from 'styled-components';

import { CanvasStyles } from './constants';
import { Styles } from '../../../api/constants';

export const canvasIconStyles = css`
  font-size: 24px;
  transition: color 0.4s ease;
  color: #bbb;
  margin: -${CanvasStyles.sectionPadding};
  margin-left: 5px;

  &:hover {
    cursor: pointer;
    color: ${Styles.color.blue};
  }

  &[disabled] {
    cursor: default;
    color: #bbb;
    opacity: 0.3;
  }
`;
