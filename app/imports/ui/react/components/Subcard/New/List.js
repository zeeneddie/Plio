import React from 'react';
import PropTypes from 'prop-types';
import { prop, map, identity } from 'ramda';
import { renderNothing, branch } from 'recompose';
import { Card } from 'reactstrap';
import cx from 'classnames';

const enhance = branch(
  prop('cards'),
  identity,
  renderNothing,
);

const SubcardNewList = enhance(({
  cards,
  onRemoveCard,
  render,
  className,
  ...props
}) => (
  <Card className={cx('new-cards', className)} {...props}>
    {map(card => render({ ...card, onRemoveCard: () => onRemoveCard(card.id) }), cards)}
  </Card>
));

SubcardNewList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  onRemoveCard: PropTypes.func,
  render: PropTypes.func,
  className: PropTypes.string,
};

export default SubcardNewList;
