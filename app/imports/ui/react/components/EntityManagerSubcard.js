import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Button } from 'reactstrap';

import { withStateToggle } from '../helpers';
import Subcard from './Subcard';
import CardBlock from './CardBlock';
import { Pull } from './Utility';
import { IconLoading } from './Icons';
import ErrorSection from './ErrorSection';
import { SaveButton } from './Buttons';

const enhance = withStateToggle(false, 'isOpen', 'toggle');

const EntityManagerSubcard = ({
  isOpen,
  toggle,
  title,
  newEntityTitle,
  newEntityButtonTitle,
  loading,
  error,
  entities,
  children,
  onSave,
}) => (
  <Subcard defer {...{ isOpen, toggle }}>
    <Subcard.Header>
      <Pull left>
        <CardTitle>{title}</CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {loading ? <IconLoading /> : (entities.length || '')}
        </CardTitle>
      </Pull>
    </Subcard.Header>
    <Subcard.Body>
      <CardBlock>
        <Subcard.New
          render={card => (
            <Subcard key={card.id} disabled>
              <Subcard.Header isNew>
                {newEntityTitle}
              </Subcard.Header>
              <Subcard.Body>
                <ErrorSection errorText={error} />
                {children}
                <CardBlock>
                  <Pull left>
                    <Button
                      color="secondary"
                      disabled={loading}
                      onClick={() => !loading && card.onDelete()}
                    >
                      Delete
                    </Button>
                  </Pull>
                  <SaveButton
                    color="secondary"
                    pull="right"
                    isSaving={loading}
                    onClick={e => !loading && onSave(e)}
                  />
                </CardBlock>
              </Subcard.Body>
            </Subcard>
          )}
        >
          <Subcard.New.List />
          <Subcard.New.Button>
            {newEntityButtonTitle}
          </Subcard.New.Button>
        </Subcard.New>
      </CardBlock>
    </Subcard.Body>
  </Subcard>
);

EntityManagerSubcard.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.node,
  newEntityTitle: PropTypes.node,
  newEntityButtonTitle: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.string,
  entities: PropTypes.array,
  children: PropTypes.node,
  onSave: PropTypes.func,
};

export default enhance(EntityManagerSubcard);
