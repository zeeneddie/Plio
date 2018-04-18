import { FormGroup } from 'reactstrap';
import styled from 'styled-components';

import { SelectWrapper } from '../../forms/components/SelectInput';

export default styled(FormGroup)`
  margin: 0;
  display: flex;
  justify-content: center;
  & > ${SelectWrapper} {
    flex: 5;
    margin-right: 15px;
  }
`;
