import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionItems from './CanvasSectionItems';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';
import CanvasSectionHelp from './CanvasSectionHelp';

const ValuePropositions = () => (
  <CanvasSection>
    <CanvasSectionHeading>
      <h4>Value propositions</h4>
      <CanvasAddButton />
    </CanvasSectionHeading>
    <CanvasSectionHelp>
      {/* eslint-disable react/no-unescaped-entities */}
      <p>Which of our customer's problems are we helping to solve?</p>
      <p>What does a winning value proposition look like, vs today's?</p>
      {/* eslint-enable react/no-unescaped-entities */}
    </CanvasSectionHelp>
    <CanvasSectionItems>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>Compassionate drug use (rare mitochondrial diseases)</span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon magenta />
        <span>
          Novel drug molecule for age-related diseases
          <CanvasLinkedItem>
            <span>Pharmaceutical firms</span>
          </CanvasLinkedItem>
        </span>
      </CanvasSectionItem>
      <CanvasSectionItem>
        <CanvasSquareIcon yellow />
        <span>Novel mitochondrial diagnostic test (to use with drug or independently)</span>
      </CanvasSectionItem>
    </CanvasSectionItems>
  </CanvasSection>
);

export default ValuePropositions;
