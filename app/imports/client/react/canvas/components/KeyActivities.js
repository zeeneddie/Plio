import React from 'react';
import { ButtonGroup } from 'reactstrap';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasLabel from './CanvasLabel';

const items = [
  { sequentialId: 'KG1', title: 'Finish ui design' },
  { sequentialId: 'KG3', title: 'Close New York Office' },
  { sequentialId: 'RK2', title: 'Strike or stoppage' },
  { sequentialId: 'NC3', title: 'Brackets getting corroded' },
];

const KeyActivities = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Key Activities</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon pink />
        <span>mtDNA profiling (per disease)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>In vivo validation</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Promotion to influencers & investors</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>In vitro target characterisation</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Patent filling</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
    <CanvasSectionFooter>
      <CanvasSectionFooterLabels>
        <ButtonGroup>
          {items.map(({ sequentialId, title }) => (
            <CanvasLabel key={sequentialId} label={sequentialId} tooltip={title} />
          ))}
        </ButtonGroup>
      </CanvasSectionFooterLabels>
    </CanvasSectionFooter>
  </CanvasSection>
);

export default KeyActivities;
