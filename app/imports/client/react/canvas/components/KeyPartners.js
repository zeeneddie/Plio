
import React from 'react';
import { DropdownItem, ButtonGroup } from 'reactstrap';
import pluralize from 'pluralize';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasLabel from './CanvasLabel';
import CanvasChartButton from './CanvasChartButton';

const goals = [
  { sequentialId: 'KG1', title: 'Finish UI design' },
  { sequentialId: 'KG3', title: 'Close New York Office' },
  { sequentialId: 'KG4', title: 'Launch Product X' },
];

const standards = [
  { issueNumber: '2.1', title: 'Identification of needs' },
  { issueNumber: '2.2.1.1', title: 'Due diligence' },
];

const KeyPartners = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Key partners</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Total Scientific Ltd</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Jackson Laboratory</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Boult (international patent lawyers)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Clinical & research collaborators</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Another item here</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Total Scientific Ltd</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Jackson Laboratory</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Boult (international patent lawyers)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Clinical & research collaborators</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Another item here</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Total Scientific Ltd</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Jackson Laboratory</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Boult (international patent lawyers)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Clinical & research collaborators</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Another item here</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Total Scientific Ltd</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Jackson Laboratory</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>Boult (international patent lawyers)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Clinical & research collaborators</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Another item here</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
    <CanvasSectionFooter>
      <CanvasSectionFooterLabels>
        <ButtonGroup>
          <CanvasLabel label={pluralize('key goal', goals.length, true)}>
            {goals.map(({ sequentialId, title }) => (
              <DropdownItem key={sequentialId}>
                <span className="text-muted">{sequentialId}</span>
                {' '}
                <span>{title}</span>
              </DropdownItem>
            ))}
          </CanvasLabel>
          <CanvasLabel label={pluralize('standard', standards.length, true)}>
            {standards.map(({ issueNumber, title }) => (
              <DropdownItem key={issueNumber}>
                {' '}
                <span>{title}</span>
                <span className="text-muted">{issueNumber}</span>
              </DropdownItem>
            ))}
          </CanvasLabel>
        </ButtonGroup>
      </CanvasSectionFooterLabels>
      <CanvasChartButton icon="th-large" />
    </CanvasSectionFooter>
  </CanvasSection>
);

export default KeyPartners;
