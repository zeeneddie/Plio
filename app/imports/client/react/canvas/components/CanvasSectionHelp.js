import styled from 'styled-components';
import cx from 'classnames';

import { CanvasStyles } from '../constants';

const CanvasSectionHelp = styled.div.attrs({
  className: ({ className }) => cx('text-muted', className),
})`
  padding: 0px ${CanvasStyles.sectionPadding};
  margin: 0 0 .5rem;
  flex: 1;
`;

export default CanvasSectionHelp;
