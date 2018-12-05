import React, { Fragment } from 'react';
import styled from 'styled-components';
import { concatAll } from 'plio-util';

import CanvasReportItemList from './CanvasReportItemList';

const StyledReportItemList = styled(CanvasReportItemList)`
  ol, ul {
    margin: 0;
  }
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
            <div className="text-muted">
              Matched to:
              {matchedCustomerElements.map((customerElement, index) => (
                <Fragment key={customerElement._id}>
                  {' '}
                  {customerElement.sequentialId} {customerElement.title}
                  {matchedCustomerElements.length === index + 1 ? '.' : ','}
                </Fragment>
              ))}
            </div>
          )}
        </Fragment>
      );
    }}
  />
);

export default CanvasReportCustomerElementList;
