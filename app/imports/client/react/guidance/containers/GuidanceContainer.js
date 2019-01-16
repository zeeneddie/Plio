import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { noop } from 'plio-util';
import { isEmpty } from 'ramda';
import { withHandlers } from 'recompose';
import styled from 'styled-components';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import { PreloaderPage, ErrorSection, RenderSwitch, EntityForm } from '../../components';
import { Composer } from '../../helpers';
import GuidanceAdminForm from '../components/GuidanceAdminForm';
import GuidanceView from '../components/GuidanceView';

const StyledPreloaderPage = styled(PreloaderPage)`
  padding: 5%;
  border: none;
`;

const enhance = withHandlers({
  refetchQueries: ({ documentType }) => () => [
    {
      query: Queries.GUIDANCE,
      variables: { documentType },
    },
  ],
});

const GuidanceContainer = ({
  refetchQueries,
  documentType,
  skip,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        {...{ skip }}
        query={Queries.GUIDANCE}
        variables={{ documentType }}
        children={noop}
      />,
      <Mutation
        {...{ refetchQueries }}
        mutation={Mutations.CREATE_GUIDANCE}
        children={noop}
      />,
      <Mutation mutation={Mutations.UPDATE_GUIDANCE} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([
      { data, ...queryResult },
      createGuidance,
      updateGuidance,
    ]) => (
      <RenderSwitch
        loading={queryResult.loading}
        error={queryResult.error}
        require={!isEmpty(data) && data}
        renderLoading={<StyledPreloaderPage size="2" />}
        renderError={errorText => <ErrorSection {...{ errorText }} />}
        errorWhenMissing={noop}
      >
        {({ user: { isPlioAdmin }, guidance }) => isPlioAdmin ? (
          <EntityForm
            initialValues={{ html: guidance && guidance.html || '' }}
            onSubmit={async (values) => {
              if (!guidance) {
                const args = {
                  variables: {
                    input: {
                      documentType,
                      html: values.html,
                    },
                  },
                };
                return createGuidance(args).then(noop).catch(swal.error);
              }

              const args = {
                variables: {
                  input: {
                    _id: guidance._id,
                    html: values.html,
                  },
                },
              };

              return updateGuidance(args).then(noop).catch(swal.error);
            }}
          >
            {({ handleSubmit }) => (
              <GuidanceAdminForm
                {...{
                  guidance,
                  documentType,
                  refetchQueries,
                  ...props,
                }}
                save={handleSubmit}
              />
            )}
          </EntityForm>
        ) : guidance && (
          <GuidanceView {...{ guidance, ...props }} />
        )}
      </RenderSwitch>
    )}
  </Composer>
);

GuidanceContainer.propTypes = {
  documentType: PropTypes.string.isRequired,
  skip: PropTypes.bool.isRequired,
  refetchQueries: PropTypes.func,
};

export default enhance(GuidanceContainer);
