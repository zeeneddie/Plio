import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Pull } from '../../components';
import CanvasReportSectionHeading from './CanvasReportSectionHeading';
import CanvasReportSection from './CanvasReportSection';
import CanvasReportColumnList from './CanvasReportColumnList';
import CanvasReportValuePropositionColumnItem from './CanvasReportValuePropositionColumnItem';

const CanvasReportValueComponents = ({ valuePropositions }) => !!valuePropositions.length && (
  <CanvasReportSection>
    <CanvasReportSectionHeading>
      Value components
      <Pull right>
        <Icon size="2" name="gift" />
      </Pull>
    </CanvasReportSectionHeading>
    <CanvasReportColumnList
      items={valuePropositions}
      renderItem={CanvasReportValuePropositionColumnItem}
    />
  </CanvasReportSection>
);

CanvasReportValueComponents.propTypes = {
  valuePropositions: PropTypes.array.isRequired,
};

export default CanvasReportValueComponents;
