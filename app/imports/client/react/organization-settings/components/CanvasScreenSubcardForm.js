import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { Query, Mutation } from 'react-apollo';
import { getValues, noop, mapUsersToOptions } from 'plio-util';
import { FormGroup } from 'reactstrap';

import { UserSelectInput, RenderSwitch, Preloader } from '../../components';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';

const CanvasScreenSubcardForm = ({ organizationId, isOpen }) => (
  <Query
    query={Queries.CANVAS_SCREEN_SETTINGS}
    variables={{ organizationId }}
    skip={!isOpen}
    onError={swal.error}
  >
    {({ data, loading }) => (
      <Mutation mutation={Mutations.UPDATE_CANVAS_SETTINGS}>
        {updateCanvasSettings => (
          <RenderSwitch
            {...{ loading }}
            require={isOpen && data && data.canvasSettings && data.canvasSettings.canvasSettings}
            errorWhenMissing={noop}
            renderLoading={<Preloader size="2" tag="div" center />}
          >
            {({ notify = [] }) => (
              <Form
                subscription={{}}
                initialValues={{ notify: mapUsersToOptions(notify) }}
                onSubmit={values => updateCanvasSettings({
                  variables: {
                    input: {
                      organizationId,
                      notify: getValues(values.notify),
                    },
                  },
                }).catch(swal.error)}
              >
                {({ handleSubmit }) => (
                  <FormGroup>
                    <legend>Notify changes list</legend>
                    <UserSelectInput
                      {...{ organizationId }}
                      multi
                      name="notify"
                      placeholder="Select users to notify"
                      onChange={handleSubmit}
                    />
                  </FormGroup>
                )}
              </Form>
            )}
          </RenderSwitch>
        )}
      </Mutation>
    )}
  </Query>
);

CanvasScreenSubcardForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
};

export default CanvasScreenSubcardForm;
