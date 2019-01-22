import React, { Fragment } from 'react';
import styled from 'styled-components';
import { concatAll } from 'plio-util';

import { Styles } from '../../../../api/constants';
import CanvasReportItemList from './CanvasReportItemList';

const StyledReportItemList = styled(CanvasReportItemList)`
  margin-top: 0.2rem;
  ol, ul {
    margin: 0;
  }
  li {
    margin-bottom: 0.5rem;
  }
`;

const MatchedItemList = styled.div`
  line-height: 1.2rem;
  color: ${Styles.color.muted};
`;

const CanvasReportCustomerElementList = props => (
  <StyledReportItemList
    {...props}
    renderItem={({
      title,
      sequentialId,
      needs = [],
      wants = [],
      benefits = [],
      features = [],
    }) => {
      const matchedCustomerElements = concatAll([needs, wants, benefits, features]);
      return (
        <Fragment>
          {title} <span className="text-muted">({sequentialId})</span>
          {!!matchedCustomerElements.length && (
            <MatchedItemList>
              Matched to:
              {matchedCustomerElements.map((customerElement, index) => (
                <Fragment key={customerElement._id}>
                  {' '}
                  {customerElement.sequentialId} {customerElement.title}
                  {matchedCustomerElements.length === index + 1 ? '.' : ','}
                </Fragment>
              ))}
            </MatchedItemList>
          )}
        </Fragment>
      );
    }}
  />
);

export default CanvasReportCustomerElementList;
