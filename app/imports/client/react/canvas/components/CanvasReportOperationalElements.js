import React from 'react';
import PropTypes from 'prop-types';
import { concatAll } from 'plio-util';
import { complement, isEmpty, values, compose, any } from 'ramda';

import { buildLinkedDocsData } from '../helpers';
import { Icon, Pull } from '../../components';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';
import CanvasReportOperationalElementList from './CanvasReportOperationalElementList';

const concatValues = compose(concatAll, values);
const hasOperationalElements = compose(
  any(complement(isEmpty)),
  concatValues,
  buildLinkedDocsData,
  concatValues,
);

const CanvasReportOperationalElements = props => hasOperationalElements(props) && (
  <CanvasReportSection className="operational-elements">
    <CanvasReportSectionHeading>
      Operational elements
      <Pull right>
        <Icon size="2" name="industry" />
      </Pull>
    </CanvasReportSectionHeading>
    <CanvasReportOperationalElementList
      label="Customer segments"
      items={props.customerSegments}
    />
    <CanvasReportOperationalElementList
      label="Value propositions"
      items={props.valuePropositions}
    />
    <CanvasReportOperationalElementList
      label="Key partners"
      items={props.keyPartners}
    />
    <CanvasReportOperationalElementList
      label="Key activities"
      items={props.keyActivities}
    />
    <CanvasReportOperationalElementList
      label="Key resources"
      items={props.keyResources}
    />
    <CanvasReportOperationalElementList
      label="Customer relationships"
      items={props.customerRelationships}
    />
    <CanvasReportOperationalElementList
      label="Channels"
      items={props.channels}
    />
    <CanvasReportOperationalElementList
      label="Cost structure"
      items={props.costLines}
    />
    <CanvasReportOperationalElementList
      label="Revenue streams"
      items={props.revenueStreams}
    />
  </CanvasReportSection>
);

CanvasReportOperationalElements.propTypes = {
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

export default CanvasReportOperationalElements;
