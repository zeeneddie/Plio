import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CardTitle, Card, Form, Button } from 'reactstrap';
import { Form as FinalForm } from 'react-final-form';

import { withToggle } from '../helpers';
import Subcard from './Subcard';
import SubcardHeader from './SubcardHeader';
import SubcardBody from './SubcardBody';
import SubcardManager from './SubcardManager';
import SubcardManagerList from './SubcardManagerList';
import SubcardManagerButton from './SubcardManagerButton';
import CardBlock from './CardBlock';
import ErrorSection from './ErrorSection';
import { SaveButton } from './Buttons';
import { Pull } from './Utility';

const FLUSH_TIMEOUT = 700;
const enhance = withToggle(false);

class EntityManagerSubcard extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: props.open || null,
    };

    this.toggleOpen = this.toggleOpen.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderNewEntityForm = this.renderNewEntityForm.bind(this);
    this.renderNewEntitySubcard = this.renderNewEntitySubcard.bind(this);
    this.renderEntities = this.renderEntities.bind(this);
  }

  onSubmit({ card }) {
    const { onSave } = this.props;
    const flush = (entity) => {
      card.onDelete();

      setTimeout(() => {
        this.scrollToEntity(entity);

        this.toggleOpen({ entity });
      }, FLUSH_TIMEOUT);
    };

    return (values, form) => onSave(
      values,
      {
        ...form,
        ownProps: {
          card,
          flush,
        },
      },
    );
  }

  scrollToEntity({ _id }) {
    document.getElementById(`subcard-${_id}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  toggleOpen({ entity }) {
    this.setState({ open: this.state.open === entity._id ? null : entity._id });
  }

  renderEntities() {
    const { entities, render } = this.props;
    const { open } = this.state;

    return !!entities.length && (
      <Card>
        {entities.map(entity => render({
          entity,
          isOpen: open === entity._id,
          toggle: this.toggleOpen,
        }))}
      </Card>
    );
  }

  renderNewEntityForm(card) {
    return (
      <FinalForm
        {...this.props}
        key={card.id}
        onSubmit={this.onSubmit({ card })}
        render={props => this.renderNewEntitySubcard({ ...props, card })}
      />
    );
  }

  renderNewEntitySubcard(form) {
    const { renderNewEntity, newEntityTitle } = this.props;
    const {
      card,
      handleSubmit,
      submitError,
      submitting,
    } = form;

    return (
      <Form onSubmit={handleSubmit}>
        <Subcard disabled>
          <SubcardHeader isNew>
            {newEntityTitle}
          </SubcardHeader>
          <SubcardBody>
            <ErrorSection errorText={submitError && <pre>{submitError}</pre>} />
            {renderNewEntity({ ...this.props, form })}
            <CardBlock>
              <Pull left>
                <Button
                  color="secondary"
                  disabled={submitting}
                  onClick={() => !submitting && card.onDelete()}
                >
                  Delete
                </Button>
              </Pull>
              <Pull right>
                <SaveButton
                  color="secondary"
                  type="submit"
                  isSaving={submitting}
                />
              </Pull>
            </CardBlock>
          </SubcardBody>
        </Subcard>
      </Form>
    );
  }

  render() {
    const {
      isOpen,
      toggle,
      title,
      newEntityButtonTitle,
      entities,
    } = this.props;

    return (
      <Subcard {...{ isOpen, toggle }}>
        <SubcardHeader>
          <Pull left>
            <CardTitle>{title}</CardTitle>
          </Pull>
          <Pull right>
            <CardTitle>
              {entities.length || ''}
            </CardTitle>
          </Pull>
        </SubcardHeader>
        <SubcardBody>
          <CardBlock>
            {this.renderEntities()}
            <SubcardManager render={this.renderNewEntityForm}>
              <SubcardManagerList />
              <SubcardManagerButton>
                {newEntityButtonTitle}
              </SubcardManagerButton>
            </SubcardManager>
          </CardBlock>
        </SubcardBody>
      </Subcard>
    );
  }
}

EntityManagerSubcard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  newEntityTitle: PropTypes.node.isRequired,
  newEntityButtonTitle: PropTypes.node.isRequired,
  entities: PropTypes.array.isRequired,
  render: PropTypes.func.isRequired,
  renderNewEntity: PropTypes.func.isRequired,
  open: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

export default enhance(EntityManagerSubcard);
