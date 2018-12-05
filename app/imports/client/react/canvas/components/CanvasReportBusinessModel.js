import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import { Styles } from '../../../../api/constants';
import { Button, Pull, Icon } from '../../components';
import Canvas from './Canvas';
import CanvasRow from './CanvasRow';
import CanvasCol from './CanvasCol';
import CanvasSection from './CanvasSection';
import CanvasHeading from './CanvasHeading';
import CanvasReportItemList from './CanvasReportItemList';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';
import KeyPartnersHelp from './KeyPartnersHelp';
import KeyActivitiesHelp from './KeyActivitiesHelp';
import KeyResourcesHelp from './KeyResourcesHelp';
import ValuePropositionsHelp from './ValuePropositionsHelp';
import CustomerRelationshipsHelp from './CustomerRelationshipsHelp';
import ChannelsHelp from './ChannelsHelp';
import CustomerSegmentsHelp from './CustomerSegmentsHelp';
import CostStructureHelp from './CostStructureHelp';
import RevenueStreamsHelp from './RevenueStreamsHelp';

const StyledReportItemList = styled(CanvasReportItemList)`
  padding: 0 0.75rem;
  margin: 0;
  ul li {
    display: inline-flex;
    margin-right: 10px;
  }
`;

const StyledButton = styled(Button)`
  ${StyledMixins.media.print`
    display: none;
  `}
`;

const StyledCanvas = styled(Canvas)`
  padding 1px;
  ${StyledMixins.media.print`
    min-height: calc(100vh - 87px);
  `}
`;

const Copyright = styled.div`
  margin-top: 10px;
  text-align: right;
  color: ${Styles.color.muted};
`;

const CanvasReportBusinessModel = ({
  keyPartners,
  keyActivities,
  keyResources,
  valuePropositions,
  customerRelationships,
  channels,
  customerSegments,
  costLines,
  revenueStreams,
}) => (
  <CanvasReportSection>
    <CanvasReportSectionHeading>
      Business model canvas
      <Pull right>
        <StyledButton
          component="button"
          onClick={() => window.print()}
        >
          Print
        </StyledButton>
      </Pull>
    </CanvasReportSectionHeading>
    <StyledCanvas>
      <CanvasRow twoThirds>
        <CanvasCol md>
          <CanvasSection>
            <CanvasHeading
              label="Key partners"
              icon="link"
              help={<KeyPartnersHelp />}
              isEmpty={!keyPartners.length}
            />
            <StyledReportItemList items={keyPartners} />
          </CanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <CanvasSection>
            <CanvasHeading
              label="Key activities"
              icon="cog"
              help={<KeyActivitiesHelp />}
              isEmpty={!keyActivities.length}
            />
            <StyledReportItemList items={keyActivities} />
          </CanvasSection>
          <CanvasSection>
            <CanvasHeading
              label="Key resources"
              icon="th"
              help={<KeyResourcesHelp />}
              isEmpty={!keyResources.length}
            />
            <StyledReportItemList items={keyResources} />
          </CanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <CanvasSection>
            <CanvasHeading
              label="Value propositions"
              icon="gift"
              help={<ValuePropositionsHelp />}
              isEmpty={!valuePropositions.length}
            />
            <StyledReportItemList items={valuePropositions} />
          </CanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <CanvasSection>
            <CanvasHeading
              label="Customer relationships"
              icon="heart"
              help={<CustomerRelationshipsHelp />}
              isEmpty={!customerRelationships.length}
            />
            <StyledReportItemList items={customerRelationships} />
          </CanvasSection>
          <CanvasSection>
            <CanvasHeading
              label="Channels"
              icon="truck"
              help={<ChannelsHelp />}
              isEmpty={!channels.length}
            />
            <StyledReportItemList items={channels} />
          </CanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <CanvasSection>
            <CanvasHeading
              label="Customer segments"
              icon="smile-o"
              help={<CustomerSegmentsHelp />}
              isEmpty={!customerSegments.length}
            />
            <StyledReportItemList items={customerSegments} />
          </CanvasSection>
        </CanvasCol>
      </CanvasRow>
      <CanvasRow oneThird>
        <CanvasCol sm>
          <CanvasSection>
            <CanvasHeading
              label="Cost structure"
              icon="tags"
              help={<CostStructureHelp />}
              isEmpty={!costLines.length}
            />
            <StyledReportItemList items={costLines} />
          </CanvasSection>
        </CanvasCol>
        <CanvasCol sm>
          <CanvasSection>
            <CanvasHeading
              label="Revenue streams"
              icon="usd"
              help={<RevenueStreamsHelp />}
              isEmpty={!revenueStreams.length}
            />
            <StyledReportItemList items={revenueStreams} />
          </CanvasSection>
        </CanvasCol>
      </CanvasRow>
    </StyledCanvas>
    <Copyright>
      <Icon name="creative-commons" margin="right" />
      Canvas by Strategyzer.com
    </Copyright>
  </CanvasReportSection>
);

CanvasReportBusinessModel.propTypes = {
  keyPartners: PropTypes.array.isRequired,
  keyActivities: PropTypes.array.isRequired,
  keyResources: PropTypes.array.isRequired,
  valuePropositions: PropTypes.array.isRequired,
  customerRelationships: PropTypes.array.isRequired,
  channels: PropTypes.array.isRequired,
  customerSegments: PropTypes.array.isRequired,
  costLines: PropTypes.array.isRequired,
  revenueStreams: PropTypes.array.isRequired,
};

export default CanvasReportBusinessModel;
