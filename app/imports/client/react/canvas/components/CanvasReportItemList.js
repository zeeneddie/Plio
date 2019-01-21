import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { identity } from 'ramda';

import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';

const List = styled.div`
  ul {
    padding: 0 0 0 8px;
    margin-bottom: 1rem;
    li {
      cursor: auto;
      overflow: hidden;
      display: block;
      &:hover {
        background-color: inherit;
      }
      span {
        padding: 0 !important;
        overflow: hidden;
        display: block;
      }
    }
  }
`;

const StyledCanvasSquareIcon = styled(CanvasSquareIcon)`
  padding: 4px 7px;
  float: left;
  display: block;
  -webkit-print-color-adjust: exact;
`;

const CanvasReportItemList = ({
  items,
  isSimple,
  renderItem,
  sort = identity,
  ...rest
}) => (
  <List {...rest}>
    <ul>
      {sort(items).map(item => (
        <CanvasSectionItem key={item._id}>
          {!isSimple && item.color && <StyledCanvasSquareIcon color={item.color} />}
          <span>
            {renderItem ? renderItem(item) : item.title}
            {!isSimple && item.matchedTo && (
              <CanvasLinkedItem>
                {item.matchedTo.title}
              </CanvasLinkedItem>
            )}
          </span>
        </CanvasSectionItem>
      ))}
    </ul>
  </List>
);

CanvasReportItemList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func,
  className: PropTypes.string,
  isSimple: PropTypes.bool,
  sort: PropTypes.func,
};

export default CanvasReportItemList;
