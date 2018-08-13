import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';
import { FormSpy } from 'react-final-form';

import { ModalBody } from '../Modal';
import GuidancePanel from '../GuidancePanel';
import { TextAlign } from '../Utility';
import CardBlock from '../CardBlock';
import ErrorSection from '../ErrorSection';
import { handleGQError } from '../../../../api/handleGQError';

const EntityModalBody = ({
  isGuidanceOpen,
  toggleGuidance,
  guidance,
  children,
  onDelete,
  error,
}) => (
  <ModalBody>
    <FormSpy subscription={{ submitError: true, error: true }}>
      {formState => (
        <ErrorSection
          errorText={handleGQError(formState.submitError || formState.error || error)}
        />
      )}
    </FormSpy>
    {guidance && (
      <GuidancePanel isOpen={isGuidanceOpen} toggle={toggleGuidance}>
        {guidance}
      </GuidancePanel>
    )}
    {children}
    {onDelete && (
      <TextAlign center>
        <CardBlock>
          <Button onClick={onDelete}>
            Delete
          </Button>
        </CardBlock>
      </TextAlign>
    )}
  </ModalBody>
);

EntityModalBody.defaultProps = {
  error: '',
};

EntityModalBody.propTypes = {
  isGuidanceOpen: PropTypes.bool.isRequired,
  toggleGuidance: PropTypes.func.isRequired,
  guidance: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  onDelete: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default EntityModalBody;
