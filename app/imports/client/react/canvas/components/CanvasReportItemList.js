import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { identity } from 'ramda';

import { Styles } from '../../../../api/constants';
import CanvasSectionItem from './CanvasSectionItem';
import CanvasSquareIcon from './CanvasSquareIcon';
import CanvasLinkedItem from './CanvasLinkedItem';

const List = styled.div`
  ul, ol {
    padding: 0;
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
  ol {
    padding-left: 8px;
    li {
      display: list-item;
      font-family: ${Styles.font.family.segoe.semibold};
      span {
        display: inline;
        font-family: ${Styles.font.family.segoe.regular};
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
}) => {
  const Tag = isSimple ? 'ol' : 'ul';
  return (
    <List {...rest}>
      <Tag>
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
      </Tag>
    </List>
  );
};

CanvasReportItemList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func,
  className: PropTypes.string,
  isSimple: PropTypes.bool,
  sort: PropTypes.func,
};

export default CanvasReportItemList;
