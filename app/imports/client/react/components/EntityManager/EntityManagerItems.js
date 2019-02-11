import { Card } from 'reactstrap';
import styled from 'styled-components';

import { Styles } from '../../../../api/constants';

const EntityManagerItems = styled(Card)`
  & > .card-block.card-block-collapse-toggle {
    border-top: 0;
    background-color: ${Styles.background.color.lightGrey};
    padding: 1.32rem;
  }
`;

export default EntityManagerItems;
