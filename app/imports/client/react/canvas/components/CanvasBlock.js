import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { ButtonGroup, DropdownItem } from 'reactstrap';

import CanvasSectionItemsContainer from '../containers/CanvasSectionItemsContainer';
import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasLabel from './CanvasLabel';
import CanvasChartButton from './CanvasChartButton';
import CanvasSectionHelp from './CanvasSectionHelp';
import { WithToggle } from '../../helpers';

// Couldn't figure out a better name >_<
const CanvasBlock = ({
  label,
  help,
  items,
  renderModal,
  goals,
  standards,
  risks,
  nonConformities,
  organizationId,
  sectionName,
}) => {
  const isEmpty = !items.length;

  return (
    <WithToggle>
      {({ isOpen, toggle }) => (
        <CanvasSection
          onClick={isEmpty ? toggle : undefined}
          empty={isEmpty}
        >
          <CanvasSectionHeading>
            <h4>{label}</h4>
            {renderModal({ isOpen, toggle })}
            <CanvasAddButton onClick={isEmpty ? undefined : toggle} />
          </CanvasSectionHeading>
          {isEmpty && (
            <CanvasSectionHelp>
              {help}
            </CanvasSectionHelp>
          )}
          <CanvasSectionItemsContainer {...{ organizationId, sectionName, items }} />
          <CanvasSectionFooter>
            <CanvasSectionFooterLabels>
              <ButtonGroup>
                {!!goals.length && (
                  <CanvasLabel label={pluralize('key goal', goals.length, true)}>
                    {goals.map(({ sequentialId, title }) => (
                      <DropdownItem key={sequentialId}>
                        <span className="text-muted">{sequentialId}</span>
                        {' '}
                        <span>{title}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
                {!!standards.length && (
                  <CanvasLabel label={pluralize('standard', standards.length, true)}>
                    {standards.map(({ issueNumber, title }) => (
                      <DropdownItem key={issueNumber}>
                        <span>{title}</span>
                        {' '}
                        <span className="text-muted">{issueNumber}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
                {!!risks.length && (
                  <CanvasLabel label={pluralize('risk', risks.length, true)}>
                    {risks.map(({ sequentialId, title }) => (
                      <DropdownItem key={sequentialId}>
                        <span className="text-muted">{sequentialId}</span>
                        {' '}
                        <span>{title}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
                {!!nonConformities.length && (
                  <CanvasLabel label={pluralize('NCs & gain', nonConformities.length, true)}>
                    {standards.map(({ sequentialId, title }) => (
                      <DropdownItem key={sequentialId}>
                        <span className="text-muted">{sequentialId}</span>
                        {' '}
                        <span>{title}</span>
                      </DropdownItem>
                    ))}
                  </CanvasLabel>
                )}
              </ButtonGroup>
            </CanvasSectionFooterLabels>
            {/* TODO: render icon dynamically
            there should be a modal for chart too */}
            <CanvasChartButton icon="th-large" />
          </CanvasSectionFooter>
        </CanvasSection>
      )}
    </WithToggle>
  );
};

CanvasBlock.defaultProps = {
  goals: [],
  standards: [],
  risks: [],
  nonConformities: [],
};

CanvasBlock.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sectionName: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  help: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
  renderModal: PropTypes.func.isRequired,
  goals: PropTypes.arrayOf(PropTypes.shape({
    sequentialId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  standards: PropTypes.arrayOf(PropTypes.shape({
    issueNumber: PropTypes.string,
    title: PropTypes.string.isRequired,
  })),
  risks: PropTypes.arrayOf(PropTypes.shape({
    sequentialId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  nonConformities: PropTypes.arrayOf(PropTypes.shape({
    sequentialId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
};

export default CanvasBlock;
