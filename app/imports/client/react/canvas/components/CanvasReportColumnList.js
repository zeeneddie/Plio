import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  overflow: hidden;
  hr {
    width: 100%;
    padding-top: 14px;
    margin-top: 14px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    border-top: 0;
    &:first-child {
      margin-top: 0;
    }
  }
`;

const ColumnItem = styled.div`
  break-inside: avoid;
  width: 50%;
  padding-right: 10px;
  float: left;
`;

const CanvasReportColumnList = ({ items, renderItem }) => (
  <Wrapper>
    {items.map((item, index) => (
      <Fragment key={item._id}>
        {!(index % 2) && <hr />}
        <ColumnItem>
          {renderItem({ ...item, index })}
        </ColumnItem>
      </Fragment>
    ))}
  </Wrapper>
);

CanvasReportColumnList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
};

export default CanvasReportColumnList;
