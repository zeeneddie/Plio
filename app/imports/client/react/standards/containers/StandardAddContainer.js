import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { compose, view, find, propEq, either, sort } from 'ramda';
import { noop, getUserOptions, getEntityOptions, lenses, byTitle } from 'plio-util';
import { pure } from 'recompose';

import { insert as insertFile } from '../../../../api/files/methods';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateStandard, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { uploadFile } from '../helpers';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { StandardStatusTypes, DefaultStandardTypes } from '../../../../share/constants';

const getDefaultType = compose(
  getEntityOptions,
  either(
    find(propEq(
      'title',
      DefaultStandardTypes.STANDARD_OPERATING_PROCEDURE.title,
    )),
    view(lenses.head._id),
  ),
);

const getDefaultSection = compose(
  getEntityOptions,
  view(lenses.head),
  sort(byTitle),
);

const StandardAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onLink = noop,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Query
        query={Queries.STANDARD_TYPE_LIST}
        variables={{ organizationId }}
        children={noop}
      />,
      <Query
        query={Queries.STANDARD_SECTION_LIST}
        variables={{ organizationId }}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_STANDARD}
        refetchQueries={() => [
          { query: Queries.STANDARD_LIST, variables: { organizationId } },
        ]}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([
      { data: { user } },
      {
        data: {
          standardTypes: { standardTypes = [] } = {},
        },
      },
      {
        data: {
          standardSections: { standardSections = [] } = {},
        },
      },
      createStandard,
    ]) => renderComponent({
      ...props,
      organizationId,
      isOpen,
      toggle,
      initialValues: {
        active: 0,
        title: '',
        source1: undefined,
        section: getDefaultSection(standardSections),
        status: StandardStatusTypes.ISSUED,
        owner: getUserOptions(user),
        type: getDefaultType(standardTypes),
      },
      onSubmit: async (values) => {
        // console.log(values.source1);
        // return;
        const {
          active,
          title,
          status,
          source1: { file, ...source1 } = {},
          section: { value: sectionId } = {},
          owner: { value: owner } = {},
          type: { value: typeId } = {},
          standard: existingStandard = {},
        } = values;

        if (active === 1) {
          if (!existingStandard.value) return createFormError('Standard required');
          return onLink(existingStandard.value).then(toggle || noop);
        }

        const errors = validateStandard(values);
        if (errors) return errors;

        let fileId;
        if (source1.type === 'attachment' && file) {
          try {
            fileId = await new Promise((resolve, reject) => {
              insertFile.call({
                name: file.name,
                organizationId,
              }, (error, result) => {
                if (error) reject(error);
                resolve(result);
              });
            });
          } catch (err) {
            return createFormError(err.reason);
          }
        }

        return createStandard({
          variables: {
            input: {
              title,
              status,
              sectionId,
              typeId,
              owner,
              organizationId,
              source1: {
                fileId,
                ...source1,
              },
            },
          },
        }).then(({ data: { createStandard: { standard } } }) => {
          if (fileId) {
            uploadFile({
              file,
              fileId,
              organizationId,
              standardId: standard._id,
            });
          }
          onLink(standard._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

StandardAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onLink: PropTypes.func,
};

export default pure(StandardAddContainer);
