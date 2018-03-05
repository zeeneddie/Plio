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

const SubcardManagerList = enhance(({
  cards,
  onDelete,
  render,
  className,
  ...props
}) => (
  <Card className={cx('new-cards', className)} {...props}>
    {map(card => render({ ...card, onDelete: () => onDelete(card.id) }), cards)}
  </Card>
));

SubcardManagerList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func,
  render: PropTypes.func,
  className: PropTypes.string,
};

export default SubcardManagerList;
