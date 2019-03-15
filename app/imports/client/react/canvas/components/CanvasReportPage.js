import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { isEmpty, pathOr, compose, prop, pick, mapObjIndexed, curry } from 'ramda';
import { sortByIds, StyledMixins } from 'plio-util';
import { delayed } from 'libreact/lib/delayed';

import { WithState } from '../../helpers';
import { CanvasReportSections } from '../constants';
import { Styles } from '../../../../api/constants';
import { RenderSwitch, PreloaderPage, ErrorPage } from '../../components';
import { Query as Queries } from '../../../graphql';
import CanvasReportBusinessModel from './CanvasReportBusinessModel';

const DelayedCanvasReportSections = delayed({
  loader: () => import('./CanvasReportSections'),
  idle: true,
  delay: 200,
});

const getDisplayValue = reportSection => props => props[reportSection] ? 'block' : 'none';
const ReportWrapper = styled.div`
  overflow: auto;
  @media print {
    overflow: hidden;
  }
  color: ${Styles.color.black};
  
  ${StyledMixins.media.print`
    .business-model-canvas {
      display: ${getDisplayValue(CanvasReportSections.BUSINESS_MODEL_CANVAS)}
    }
    .canvas-items {
      display: ${getDisplayValue(CanvasReportSections.CANVAS_ITEMS)}
    }
    .canvas-charts {
      display: ${getDisplayValue(CanvasReportSections.CANVAS_CHARTS)}
    }
    .value-components {
      display: ${getDisplayValue(CanvasReportSections.VALUE_COMPONENTS)}
    }
    .customer-insights {
      display: ${getDisplayValue(CanvasReportSections.CUSTOMER_INSIGHTS)}
    }
    .operational-elements {
      display: ${getDisplayValue(CanvasReportSections.OPERATIONAL_ELEMENTS)}
    }
  `}
`;

const getSectionOrder = curry((sectionKey, settings) => pathOr(
  [],
  [sectionKey === 'costLines' ? 'costStructure' : sectionKey, 'order'],
  settings,
));
const getOrderedSections = (settings, items) => compose(
  mapObjIndexed((section, sectionKey) => compose(
    sortByIds(getSectionOrder(sectionKey, settings)),
    prop(sectionKey),
  )(section)),
  pick([
    'keyPartners',
    'keyActivities',
    'keyResources',
    'valuePropositions',
    'customerRelationships',
    'channels',
    'customerSegments',
    'costLines',
    'revenueStreams',
  ]),
)(items);

const CanvasReportPage = ({ organization: { _id: organizationId } }) => (
  <Query query={Queries.CANVAS_REPORT_PAGE} variables={{ organizationId }}>
    {({ error, loading, data }) => (
      <RenderSwitch
        {...{ error, loading }}
        require={!isEmpty(data) && data}
        renderLoading={<PreloaderPage />}
        renderError={queryError => <ErrorPage error={queryError} />}
      >
        {({
          canvasSettings: { canvasSettings },
          ...sectionsItems
        }) => {
          const orderedSections = getOrderedSections(canvasSettings, sectionsItems);

          return (
            <WithState
              initialState={{
                [CanvasReportSections.BUSINESS_MODEL_CANVAS]: true,
                [CanvasReportSections.CANVAS_ITEMS]: true,
                [CanvasReportSections.CANVAS_CHARTS]: true,
                [CanvasReportSections.CUSTOMER_INSIGHTS]: true,
                [CanvasReportSections.VALUE_COMPONENTS]: true,
                [CanvasReportSections.OPERATIONAL_ELEMENTS]: true,
              }}
            >
              {({ state, setState }) => (
                <ReportWrapper {...state}>
                  <CanvasReportBusinessModel
                    updatePrintState={setState}
                    printState={state}
                    {...{
                      ...orderedSections,
                    }}
                  />
                  <DelayedCanvasReportSections sections={orderedSections} />
                </ReportWrapper>
              )}
            </WithState>
          );
        }}
      </RenderSwitch>
    )}
  </Query>
);

CanvasReportPage.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default CanvasReportPage;
