import React, { PropTypes } from 'react';
import { CardBlock, Card } from 'reactstrap';
import { compose, withState, withHandlers } from 'recompose';
import { propOr, times, identity } from 'ramda';

import { TextAlign } from '../Utility';
import Button from '../Buttons/Button';

const onAddHandler = ({
  onAdd = identity,
  setCards,
  ...props
}) => () => {
  const cards = props.cards + 1;
  setCards(cards);
  return onAdd({ ...props, cards });
};

const enhance = compose(
  withState('cards', 'setCards', propOr(0, 'cards')),
  withHandlers({ onAdd: onAddHandler }),
);

const AddNewDocument = enhance(({
  children,
  onAdd,
  cards,
  render,
  renderBtnContent = () => 'add a new document',
}) => (
  <CardBlock>
    {children}
    {!!cards && (
      <Card className="new-cards">
        {times(render, cards)}
      </Card>
    )}
    <TextAlign center>
      <div>
        <Button color="link" onClick={onAdd}>
          {renderBtnContent()}
        </Button>
      </div>
    </TextAlign>
  </CardBlock>
));

AddNewDocument.propTypes = {
  children: PropTypes.node,
  render: PropTypes.func.isRequired,
  renderBtnContent: PropTypes.func,
  onAdd: PropTypes.func,
  cards: PropTypes.number,
};

export default AddNewDocument;
