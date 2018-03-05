import React from 'react';
import PropTypes from 'prop-types';
import { mapProps } from 'recompose';

import { withCards, namedCompose } from '../helpers';
import SubcardManagerList from './SubcardManagerList';
import SubcardManagerButton from './SubcardManagerButton';

const enhance = namedCompose('SubcardManager')(
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
        case SubcardManagerList:
          return React.cloneElement(child, { render, cards, onDelete: onRemoveCard });
        case SubcardManagerButton:
          return React.cloneElement(child, { onClick: onAddCard });
        default:
          return child;
      }
    }),
  })),
);

const SubcardManager = enhance(({ children }) => children);

SubcardManager.propTypes = {
  children: PropTypes.node,
  render: PropTypes.func.isRequired,
};

export default SubcardManager;
