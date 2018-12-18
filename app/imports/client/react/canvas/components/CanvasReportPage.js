import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { isEmpty, pathOr, compose, prop, pick, mapObjIndexed, curry } from 'ramda';
import { sortByIds } from 'plio-util';

import delayed from '../../helpers/delayed';
import { Styles } from '../../../../api/constants';
import { RenderSwitch, PreloaderPage, ErrorPage } from '../../components';
import { Query as Queries } from '../../../graphql';
import CanvasReportBusinessModel from './CanvasReportBusinessModel';

const DelayedCanvasReportSections = delayed({
  loader: () => import('./CanvasReportSections'),
  idle: true,
  delay: 200,
});

const ReportWrapper = styled.div`
  overflow: auto;
  color: ${Styles.color.black};
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
            <ReportWrapper>
              <CanvasReportBusinessModel {...orderedSections} />
              <DelayedCanvasReportSections sections={orderedSections} />
            </ReportWrapper>
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
