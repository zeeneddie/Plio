import React from 'react';
import PropTypes from 'prop-types';
import { compose, mapProps } from 'recompose';

import { withCards } from '../../../helpers';

import List from './List';
import Button from './Button';

const enhance = compose(
  withCards,
  mapProps(({
    ui: { cards },
    onAddCard,
    onRemoveCard,
    render,
    children,
    ...props
  }) => ({
    ...props,
    children: React.Children.map(children, (child) => {
      switch (child.type) {
        case List:
          return React.cloneElement(child, { render, cards, onDelete: onRemoveCard });
        case Button:
          return React.cloneElement(child, { onClick: onAddCard });
        default:
          return child;
      }
    }),
  })),
);

const SubcardNew = enhance(({ children }) => children);

SubcardNew.propTypes = {
  children: PropTypes.node,
  render: PropTypes.func.isRequired,
};

SubcardNew.List = List;
SubcardNew.Button = Button;

export default SubcardNew;
