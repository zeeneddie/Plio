import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Sortable from 'react-sortablejs';
import is from 'styled-is';
import { StyledMixins } from 'plio-util';

import { CanvasStyles } from '../constants';

const SortableList = styled(({ twoColumn, ...rest }) => <Sortable {...rest} />)`
  list-style: none;
  margin: 0;
  padding: 0px ${CanvasStyles.sectionPadding};
  flex: 1;
  align-items: flex-start;
  ${StyledMixins.scroll};

    background: linear-gradient(white 30%, rgba(255,255,255,0)),
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      radial-gradient(50% 0, farthest-side, rgba(0,0,0,.2), rgba(0,0,0,0)),
      radial-gradient(50% 100%,farthest-side, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;

    background: linear-gradient(white 30%, rgba(255,255,255,0)),
      linear-gradient(rgba(255,255,255,0), white 70%) 0 100%,
      radial-gradient(farthest-side at 50% 0, rgba(0,0,0,.2), rgba(0,0,0,0)),
      radial-gradient(farthest-side at 50% 100%, rgba(0,0,0,.2), rgba(0,0,0,0)) 0 100%;
    
    background-repeat: no-repeat;
    background-color: white;
    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
    background-attachment: local, local, scroll, scroll;

  & > .sortable-chosen.sortable-ghost {
    height: 21px;
    border: 1px dashed #ddd;
    background-color: transparent;

    > * {
      display: none;
    }
  }
  
  ${is('twoColumn')`
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    li {
      width: 50%;
      margin-right: 5px;
    }
  `}
`;

const CanvasSectionItems = ({ children, ...props }) => (
  <SortableList {...props}>
    {children}
  </SortableList>
);

CanvasSectionItems.propTypes = {
  tag: PropTypes.string,
  children: PropTypes.node.isRequired,
  options: PropTypes.object,
  inline: PropTypes.bool,
};

CanvasSectionItems.defaultProps = {
  tag: 'ul',
  options: {
    handle: '.drag-handle',
  },
};

export default CanvasSectionItems;
