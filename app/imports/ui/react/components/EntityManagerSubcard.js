import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Card, Button, Form } from 'reactstrap';
import { compose, withStateHandlers, lifecycle, setPropTypes, withHandlers } from 'recompose';
import { Form as FinalForm } from 'react-final-form';

import { withToggle } from '../helpers';
import Subcard from './Subcard';
import SubcardHeader from './SubcardHeader';
import SubcardBody from './SubcardBody';
import SubcardManager from './SubcardManager';
import SubcardManagerList from './SubcardManagerList';
import SubcardManagerButton from './SubcardManagerButton';
import CardBlock from './CardBlock';
import { Pull } from './Utility';
import ErrorSection from './ErrorSection';
import { SaveButton } from './Buttons';

const FLUSH_TIMEOUT = 700;
const scrollToEntity = ({ _id }) => document.getElementById(`subcard-${_id}`).scrollIntoView({
  behavior: 'smooth',
  block: 'start',
});

const enhance = compose(
  setPropTypes({
    isOpen: PropTypes.bool,
    toggle: PropTypes.func,
    openEntity: PropTypes.string,
    onSave: PropTypes.func.isRequired,
  }),
  withToggle(false),
  withStateHandlers(
    ({ openEntity = null }) => ({ open: openEntity }),
    {
      toggleOpen: ({ open }) => ({ entity }) => ({
        open: open === entity._id ? null : entity._id,
      }),
    },
  ),
  lifecycle({
    componentWillReceiveProps({ openEntity, toggleOpen }) {
      if (this.props.openEntity !== openEntity) {
        toggleOpen({ entity: { _id: openEntity } });
      }
    },
  }),
  withHandlers({
    onSubmit: ({ onSave, ...props }) => extraProps => (values, form, callback) => {
      const flush = (entity) => {
        const { toggleOpen } = props;
        const { card } = extraProps;

        card.onDelete();

        setTimeout(() => {
          scrollToEntity(entity);

          toggleOpen({ entity });
        }, FLUSH_TIMEOUT);
      };

      return onSave(
        values,
        {
          ...form,
          ownProps: {
            ...props,
            ...extraProps,
            flush,
          },
        },
        callback,
      );
    },
  }),
);

const EntityManagerSubcard = ({
  isOpen,
  toggle,
  title,
  newEntityTitle,
  newEntityButtonTitle,
  entities,
  render,
  renderNewEntity,
  toggleOpen,
  open,
  onSubmit,
}) => (
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
        {!!entities.length && (
          <Card>
            {entities.map(entity => render({
              entity,
              isOpen: open === entity._id,
              toggle: toggleOpen,
            }))}
          </Card>
        )}
        <SubcardManager
          render={card => (
            <FinalForm key={card.id} onSubmit={onSubmit({ card })}>
              {({
                handleSubmit,
                submitError,
                submitting,
                ...formProps
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Subcard disabled>
                    <SubcardHeader isNew>
                      {newEntityTitle}
                    </SubcardHeader>
                    <SubcardBody>
                      <ErrorSection errorText={submitError} />
                      {renderNewEntity({
                        ...formProps,
                        card,
                      })}
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
                            isSaving={submitting}
                            type="submit"
                          />
                        </Pull>
                      </CardBlock>
                    </SubcardBody>
                  </Subcard>
                </Form>
              )}
            </FinalForm>
          )}
        >
          <SubcardManagerList />
          <SubcardManagerButton>
            {newEntityButtonTitle}
          </SubcardManagerButton>
        </SubcardManager>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

EntityManagerSubcard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  newEntityTitle: PropTypes.node.isRequired,
  newEntityButtonTitle: PropTypes.node.isRequired,
  entities: PropTypes.array.isRequired,
  children: PropTypes.node,
  render: PropTypes.func.isRequired,
  renderNewEntity: PropTypes.func.isRequired,
  open: PropTypes.string,
  toggleOpen: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default enhance(EntityManagerSubcard);
