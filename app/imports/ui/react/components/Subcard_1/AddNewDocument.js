import React from 'react';
import PropTypes from 'prop-types';
import { CardBody, Card } from 'reactstrap';
import { compose, withState, withHandlers } from 'recompose';
import { propOr, map, identity, reject } from 'ramda';
import { Random } from 'meteor/random';

import { TextAlign } from '../Utility';
import Button from '../Buttons/Button';
import { lenses, lensEq } from '../../../../client/util';

const onAddHandler = ({
  setCards,
  onAdd = identity,
  ...props
}) => () => {
  const cards = props.cards.concat({ id: Random.id() });
  setCards(cards);
  return onAdd({ ...props, cards });
};

const onDeleteHandler = ({
  cards,
  setCards,
  onDelete = identity,
  ...props
}) => (id) => {
  const nextCards = reject(lensEq(lenses.id, id), cards);
  setCards(nextCards);
  onDelete({ ...props, cards: nextCards });
};

const enhance = compose(
  withState('cards', 'setCards', propOr([], 'cards')),
  withHandlers({
    onAdd: onAddHandler,
    onDelete: onDeleteHandler,
  }),
);

const AddNewDocument = enhance(({
  children,
  onAdd,
  cards,
  onDelete,
  render,
  renderBtnContent = () => 'Add a new document',
}) => (
  <CardBody className="card-block">
    {children}
    {!!cards && (
      <Card className="new-cards">
        {map(card => render({ ...card, onDelete }), cards)}
      </Card>
    )}
    <TextAlign center>
      <div>
        <Button color="link" onClick={onAdd}>
          {renderBtnContent()}
        </Button>
      </div>
    </TextAlign>
  </CardBody>
));

AddNewDocument.propTypes = {
  children: PropTypes.node,
  render: PropTypes.func.isRequired,
  renderBtnContent: PropTypes.func,
  onAdd: PropTypes.func,
  cards: PropTypes.number,
};

export default AddNewDocument;
