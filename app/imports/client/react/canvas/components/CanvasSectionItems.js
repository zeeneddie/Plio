import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Sortable from 'react-sortablejs';
import { StyledMixins } from 'plio-util';

import CanvasSectionItem from './CanvasSectionItem';
import { CanvasStyles } from '../constants';
import CanvasSquareIcon from './CanvasSquareIcon';

const SortableList = styled(Sortable)`
  list-style: none;
  margin: 0;
  padding: 0px ${CanvasStyles.sectionPadding};
  flex: 1;
  ${StyledMixins.scroll};

  & > .sortable-chosen.sortable-ghost {
    height: 21px;
    border: 1px dashed #ddd;
    background-color: transparent;

    > * {
      display: none;
    }
  }

  li span {
    overflow: hidden;
    display: block;
  }
`;

const CanvasSectionItems = ({ children, items, ...props }) => (
  <SortableList {...props}>
    {items ? items.map(({ _id, title, color }) => (
      <CanvasSectionItem data-id={_id} key={_id}>
        <CanvasSquareIcon {...{ color }} />
        <span>{title}</span>
      </CanvasSectionItem>
    )) : children}
  </SortableList>
);

CanvasSectionItems.propTypes = {
  tag: PropTypes.string,
  children: PropTypes.node,
  items: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })),
};

CanvasSectionItems.defaultProps = {
  tag: 'ul',
};

export default CanvasSectionItems;
