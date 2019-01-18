import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import { Styles } from '../../../../api/constants';
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
import CanvasReportPrintModal from './CanvasReportPrintModal';
import StrategyzerCopyright from './StrategyzerCopyright';

const StyledReportItemList = styled(CanvasReportItemList)`
  padding: 0 0.75rem;
  margin: 0;
  ul li {
    display: inline-flex;
    margin-right: 10px;
  }
`;

const StyledCanvas = styled(Canvas)`
  padding 1px;
  ${StyledMixins.media.print`
    min-height: calc(100vh - 88px);
  `}
`;

const StyledCanvasSection = styled(CanvasSection)`
  min-height: auto;
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
  printState,
  updatePrintState,
}) => (
  <CanvasReportSection className="business-model-canvas">
    <CanvasReportSectionHeading>
      Business model canvas
      <CanvasReportPrintModal {...{ printState, updatePrintState }} />
    </CanvasReportSectionHeading>
    <StyledCanvas>
      <CanvasRow twoThirds>
        <CanvasCol md>
          <StyledCanvasSection>
            <CanvasHeading
              label="Key partners"
              icon="link"
              help={<KeyPartnersHelp />}
              isEmpty={!keyPartners.length}
            />
            <StyledReportItemList items={keyPartners} />
          </StyledCanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <StyledCanvasSection>
            <CanvasHeading
              label="Key activities"
              icon="cog"
              help={<KeyActivitiesHelp />}
              isEmpty={!keyActivities.length}
            />
            <StyledReportItemList items={keyActivities} />
          </StyledCanvasSection>
          <StyledCanvasSection>
            <CanvasHeading
              label="Key resources"
              icon="th"
              help={<KeyResourcesHelp />}
              isEmpty={!keyResources.length}
            />
            <StyledReportItemList items={keyResources} />
          </StyledCanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <StyledCanvasSection>
            <CanvasHeading
              label="Value propositions"
              icon="gift"
              help={<ValuePropositionsHelp />}
              isEmpty={!valuePropositions.length}
            />
            <StyledReportItemList items={valuePropositions} />
          </StyledCanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <StyledCanvasSection>
            <CanvasHeading
              label="Customer relationships"
              icon="heart"
              help={<CustomerRelationshipsHelp />}
              isEmpty={!customerRelationships.length}
            />
            <StyledReportItemList items={customerRelationships} />
          </StyledCanvasSection>
          <StyledCanvasSection>
            <CanvasHeading
              label="Channels"
              icon="truck"
              help={<ChannelsHelp />}
              isEmpty={!channels.length}
            />
            <StyledReportItemList items={channels} />
          </StyledCanvasSection>
        </CanvasCol>
        <CanvasCol md>
          <StyledCanvasSection>
            <CanvasHeading
              label="Customer segments"
              icon="smile-o"
              help={<CustomerSegmentsHelp />}
              isEmpty={!customerSegments.length}
            />
            <StyledReportItemList items={customerSegments} />
          </StyledCanvasSection>
        </CanvasCol>
      </CanvasRow>
      <CanvasRow oneThird>
        <CanvasCol sm>
          <StyledCanvasSection>
            <CanvasHeading
              label="Cost structure"
              icon="tags"
              help={<CostStructureHelp />}
              isEmpty={!costLines.length}
            />
            <StyledReportItemList items={costLines} />
          </StyledCanvasSection>
        </CanvasCol>
        <CanvasCol sm>
          <StyledCanvasSection>
            <CanvasHeading
              label="Revenue streams"
              icon="usd"
              help={<RevenueStreamsHelp />}
              isEmpty={!revenueStreams.length}
            />
            <StyledReportItemList items={revenueStreams} />
          </StyledCanvasSection>
        </CanvasCol>
      </CanvasRow>
    </StyledCanvas>
    <Copyright>
      <StrategyzerCopyright />
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
  printState: PropTypes.object.isRequired,
  updatePrintState: PropTypes.func.isRequired,
};

export default CanvasReportBusinessModel;
