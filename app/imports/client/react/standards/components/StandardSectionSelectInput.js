import PropTypes from 'prop-types';
import React from 'react';
import { Mutation } from 'react-apollo';
import { mapEntitiesToOptions, byTitle } from 'plio-util';
import { compose, sort } from 'ramda';

import swal from '../../../../ui/utils/swal';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloSelectInputField } from '../../components';

const getOptions = compose(
  mapEntitiesToOptions,
  sort(byTitle),
);

const StandardSectionSelectInput = ({ organizationId, ...props }) => (
  <Mutation mutation={Mutations.CREATE_STANDARD_SECTION}>
    {createStandardSection => (
      <ApolloSelectInputField
        {...props}
        type="creatable"
        placeholder="Standards section"
        promptTextCreator={selectedLabel => `Add "${selectedLabel}" section`}
        loadOptions={query => query({
          query: Queries.STANDARD_SECTION_LIST,
          variables: { organizationId },
        }).then(({ data: { standardSections: { standardSections = [] } = {} } }) => ({
          options: getOptions(standardSections),
        })).catch(swal.error)}
        onNewOptionClick={({ value: title }, callback) => swal.promise({
          title: 'Are you sure?',
          text: `New section "${title}" will be added.`,
          confirmButtonText: 'Add',
          showCancelButton: true,
          type: 'warning',
        }, () => createStandardSection({
          variables: {
            input: {
              title,
              organizationId,
            },
          },
          refetchQueries: [
            {
              query: Queries.STANDARD_SECTION_LIST,
              variables: { organizationId },
            },
          ],
        }).then(({
          data: {
            createStandardSection: { standardSection = {} } = {},
          },
        }) => {
          callback({
            label: standardSection.title,
            value: standardSection._id,
          });
          swal.success('Added!', `Section "${title}" was added successfully.`);
        }))}
      />
    )}
  </Mutation>
);

StandardSectionSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default StandardSectionSelectInput;
