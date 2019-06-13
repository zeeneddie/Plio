import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { concat, compose, values, isEmpty, complement, any } from 'ramda';
import { concatAll } from 'plio-util';

import { buildLinkedDocsData } from '../helpers';
import CanvasReportHeader from './CanvasReportHeader';
import CanvasReportItemList from './CanvasReportItemList';

const renderItem = ({ title, sequentialId }) => `${sequentialId}. ${title}`;
const renderStandardItem = ({
  title,
  issueNumber,
  type: { abbreviation },
}) => `${abbreviation}${issueNumber}. ${title}`;

const Wrapper = styled.div`
  break-inside: avoid;
`;

const OperationalElementCols = styled.div`
  display: flex;
  & > div {
    width: 100%;
    padding-right: 10px;
  }
`;

const ListHeader = styled(CanvasReportHeader)`
  span {
    margin-left: 0;
    display: block;
  }
`;

const hasOperationalElements = compose(
  any(complement(isEmpty)),
  concatAll,
  values,
);

const CanvasReportOperationalElementList = ({ label, items }) => {
  const concatedDocs = buildLinkedDocsData(items);
  const {
    goals = [],
    standards = [],
    risks = [],
    nonconformities = [],
    potentialGains = [],
  } = concatedDocs;
  const nonconformitiesAndGains = concat(nonconformities, potentialGains);
  return hasOperationalElements(concatedDocs) && (
    <Wrapper>
      <hr />
      <CanvasReportHeader tag="h5">{label}</CanvasReportHeader>
      <OperationalElementCols>
        <div>
          <ListHeader isEmpty={!goals.length} tag="h6">Key goals:</ListHeader>
          <CanvasReportItemList {...{ renderItem }} items={goals} isSimple />
        </div>
        <div>
          <ListHeader isEmpty={!standards.length} tag="h6">Standards:</ListHeader>
          <CanvasReportItemList
            renderItem={renderStandardItem}
            items={standards}
            isSimple
          />
        </div>
        <div>
          <ListHeader isEmpty={!risks.length} tag="h6">Risks:</ListHeader>
          <CanvasReportItemList {...{ renderItem }} items={risks} isSimple />
        </div>
        <div>
          <ListHeader isEmpty={!nonconformitiesAndGains.length} tag="h6">
            NCs & Gains:
          </ListHeader>
          <CanvasReportItemList {...{ renderItem }} items={nonconformitiesAndGains} isSimple />
        </div>
      </OperationalElementCols>
    </Wrapper>
  );
};

CanvasReportOperationalElementList.propTypes = {
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default CanvasReportOperationalElementList;
