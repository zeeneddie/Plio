import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle } from 'reactstrap';
import { ApolloProvider } from 'react-apollo';
import { pure } from 'recompose';

import {
  CardBlock,
  Subcard,
  SubcardHeader,
  SubcardBody,
} from '../../components';
import { WithToggle } from '../../helpers';
import CanvasScreenSubcardForm from './CanvasScreenSubcardForm';
import { client } from '../../../apollo';

const CanvasScreenSubcard = ({ organizationId }) => (
  <ApolloProvider {...{ client }}>
    <WithToggle>
      {({ isOpen, toggle }) => (
        <Subcard {...{ isOpen, toggle }}>
          <SubcardHeader>
            <CardTitle>Canvas screen</CardTitle>
          </SubcardHeader>
          <SubcardBody>
            <CardBlock>
              <CanvasScreenSubcardForm {...{ organizationId, isOpen }} />
            </CardBlock>
          </SubcardBody>
        </Subcard>
      )}
    </WithToggle>
  </ApolloProvider>
);

CanvasScreenSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(CanvasScreenSubcard);
