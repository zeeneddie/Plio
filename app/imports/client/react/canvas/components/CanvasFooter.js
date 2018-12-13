import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { ButtonGroup } from 'reactstrap';
import { bySerialNumber, byTitle } from 'plio-util';
import { concat, sort } from 'ramda';

import { DocumentTypes } from '../../../../share/constants';
import { WithToggle, WithState } from '../../helpers';
import { buildLinkedDocsData } from '../helpers';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasFooterItems from './CanvasFooterItems';
import CanvasFooterItem from './CanvasFooterItem';
import CanvasStandardFooterItem from './CanvasStandardFooterItem';
import CanvasChartButton from './CanvasChartButton';
import CanvasLinkedModal from './CanvasLinkedModal';

const CanvasFooter = ({
  items,
  isEmpty,
  renderChartModal,
  chartButtonIcon,
  organizationId,
}) => {
  const {
    goals = [],
    standards = [],
    risks = [],
    nonconformities = [],
    potentialGains = [],
  } = buildLinkedDocsData(items);
  const nonconformitiesAndGains = concat(nonconformities, potentialGains);

  return (
    <CanvasSectionFooter>
      <CanvasSectionFooterLabels>
        <ButtonGroup>
          <WithState initialState={{ documentId: null, documentType: null }}>
            {({ state: { documentId, documentType }, setState }) => (
              <Fragment>
                <CanvasLinkedModal
                  {...{ documentId, documentType, organizationId }}
                  isOpen={!!documentId}
                  toggle={() => setState({ documentId: null })}
                />
                <CanvasFooterItems
                  label="Key goal"
                  renderItem={CanvasFooterItem}
                  items={sort(bySerialNumber, goals)}
                  onClick={({ _id }) => setState({
                    documentId: _id,
                    documentType: DocumentTypes.GOAL,
                  })}
                />
                <CanvasFooterItems
                  label="Standard"
                  renderItem={CanvasStandardFooterItem}
                  items={sort(byTitle, standards)}
                  onClick={({ _id }) => setState({
                    documentId: _id,
                    documentType: DocumentTypes.STANDARD,
                  })}
                />
                <CanvasFooterItems
                  label="Risk"
                  renderItem={CanvasFooterItem}
                  items={sort(bySerialNumber, risks)}
                  onClick={({ _id }) => setState({
                    documentId: _id,
                    documentType: DocumentTypes.RISK,
                  })}
                />
                <CanvasFooterItems
                  label="NCs & gain"
                  renderItem={CanvasFooterItem}
                  items={sort(bySerialNumber, nonconformitiesAndGains)}
                  onClick={({ _id, type }) => setState({
                    documentId: _id,
                    documentType: type,
                  })}
                />
              </Fragment>
            )}
          </WithState>
        </ButtonGroup>
      </CanvasSectionFooterLabels>
      {renderChartModal && !isEmpty && (
        <WithToggle>
          {chartModalState => (
            <Fragment>
              {renderChartModal(chartModalState)}
              <CanvasChartButton icon={chartButtonIcon} onClick={chartModalState.toggle} />
            </Fragment>
          )}
        </WithToggle>
      )}
    </CanvasSectionFooter>
  );
};

CanvasFooter.defaultProps = {
  chartButtonIcon: 'pie-chart',
};

CanvasFooter.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool,
  renderChartModal: PropTypes.func,
  chartButtonIcon: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
};

export default CanvasFooter;
