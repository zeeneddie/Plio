import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import KeyPartnerAddModal from './KeyPartnerAddModal';
import KeyPartnerEditModal from './KeyPartnerEditModal';
import KeyPartnersChartModal from './KeyPartnersChartModal';
import CanvasBlock from './CanvasBlock';
import KeyPartnersHelp from './KeyPartnersHelp';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

const KeyPartners = ({ organizationId }) => (
  <Query
    query={Queries.KEY_PARTNERS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { keyPartners: { keyPartners = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Key partners"
        sectionName={CanvasSections[CanvasTypes.KEY_PARTNER]}
        help={<KeyPartnersHelp />}
        items={keyPartners}
        renderModal={({ isOpen, toggle, onLink }) => (
          <KeyPartnerAddModal
            {...{
              isOpen,
              toggle,
              organizationId,
              onLink,
            }}
          />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <KeyPartnerEditModal
            {...{
              isOpen,
              toggle,
              organizationId,
              _id,
            }}
          />
        )}
        renderChartModal={({ isOpen, toggle }) => (
          <KeyPartnersChartModal {...{ isOpen, toggle, organizationId }} />
        )}
        chartButtonIcon="th-large"
      />
    )}
  </Query>
);

KeyPartners.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyPartners);
