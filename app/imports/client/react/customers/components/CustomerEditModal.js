import PropTypes from 'prop-types';
import React, { Fragment, memo } from 'react';
import { noop } from 'plio-util';
import { Button } from 'reactstrap';

import {
  EntityModalNext,
  EntityModalForm,
  EntityModalHeader,
  EntityModalBody,
} from '../../components/EntityModalNext';
import CardBlock from '../../components/CardBlock';
import CustomerForm from './CustomerForm';
import RenderSwitch from '../../components/RenderSwitch';
import TextAlign from '../../components/Utility/TextAlign';

const CustomerEditModal = memo(({
  organization,
  isOpen,
  toggle,
  loading,
  error,
  initialValues,
  onSubmit,
  onDelete,
}) => (
  <EntityModalNext
    {...{
      isOpen,
      toggle,
      loading,
      error,
    }}
    isEditMode
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Organization" renderLeftButton={null} />
          <EntityModalBody>
            <RenderSwitch
              {...{ loading }}
              renderLoading={(
                <CardBlock>
                  <CustomerForm />
                </CardBlock>
              )}
              errorWhenMissing={noop}
              require={organization}
            >
              {() => (
                <Fragment>
                  <CardBlock>
                    <CustomerForm save={handleSubmit} />
                  </CardBlock>
                  {onDelete && (
                    <TextAlign center>
                      <CardBlock>
                        <Button color="danger" onClick={onDelete}>
                          Delete organization
                        </Button>
                      </CardBlock>
                    </TextAlign>
                  )}
                </Fragment>
              )}
            </RenderSwitch>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
));

CustomerEditModal.propTypes = {
  organization: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default CustomerEditModal;
