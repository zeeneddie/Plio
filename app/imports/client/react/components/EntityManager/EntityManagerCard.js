import PropTypes from 'prop-types';
import React from 'react';
import { FormSpy } from 'react-final-form';

import Subcard from '../Subcard';
import SubcardHeader from '../SubcardHeader';
import SubcardBody from '../SubcardBody';
import CardBlock from '../CardBlock';
import ErrorSection from '../ErrorSection';
import Pull from '../Utility/Pull';
import EntityManagerDeleteButton from './EntityManagerDeleteButton';
import EntityManagerSaveButton from './EntityManagerSaveButton';

const EntityManagerCard = ({ label, children, ...props }) => (
  <Subcard disabled {...props}>
    <SubcardHeader isNew>
      {label}
    </SubcardHeader>
    <SubcardBody>
      <FormSpy subscription={{ submitError: true, error: true }}>
        {({ submitError, error }) => (
          <ErrorSection errorText={submitError || error} />
        )}
      </FormSpy>
      {children}
      <CardBlock>
        <Pull left>
          <EntityManagerDeleteButton />
        </Pull>
        <Pull right>
          <EntityManagerSaveButton />
        </Pull>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

EntityManagerCard.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  children: PropTypes.node,
};

export default EntityManagerCard;
