import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { noop } from 'plio-util';
import styled from 'styled-components';
import { isEmpty } from 'ramda';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import {
  EntityModalGuidance,
  GuidancePanel,
  RenderSwitch,
  PreloaderPage,
  ErrorSection,
  QuillField,
  EntityForm,
} from '../../components';

const StyledPreloaderPage = styled(PreloaderPage)`
  padding: 5%;
  border: none;
`;

const StyledQuillField = styled(QuillField)`
  .quill {
    margin: -17px -17px 0 -17px;
  }
`;

const CanvasModalGuidance = ({ documentType }) => (
  <EntityModalGuidance>
    {({ isOpen, toggle }) => (
      <Query
        query={Queries.GUIDANCE}
        variables={{ documentType }}
        skip={!isOpen}
      >
        {({ data, ...queryResult }) => (
          <Mutation mutation={Mutations.UPDATE_GUIDANCE}>
            {(updateGuidance, mutationResult) => (
              <GuidancePanel
                {...{ isOpen, toggle }}
                closeBtnText={mutationResult.loading ? 'Saving...' : 'Close'}
              >
                <RenderSwitch
                  loading={queryResult.loading}
                  error={queryResult.error || mutationResult.error}
                  require={!isEmpty(data) && data}
                  renderLoading={<StyledPreloaderPage size="2" />}
                  renderError={errorText => <ErrorSection {...{ errorText }} />}
                  errorWhenMissing={noop}
                >
                  {({ user: { isPlioAdmin }, guidance }) => {
                    const html = guidance && guidance.html || '';

                    if (isPlioAdmin) {
                      return (
                        <EntityForm
                          initialValues={{ guidance: html }}
                          onSubmit={async (values) => {
                            const args = {
                              variables: {
                                input: {
                                  documentType,
                                  html: values.guidance,
                                },
                              },
                            };

                            if (!guidance) {
                              // refetch queries after upsert
                              Object.assign(args, {
                                refetchQueries: [{
                                  query: Queries.GUIDANCE,
                                  variables: { documentType },
                                }],
                              });
                            }

                            return updateGuidance(args).then(noop);
                          }}
                        >
                          {({ handleSubmit }) => (
                            <StyledQuillField
                              name="guidance"
                              onBlur={handleSubmit}
                            />
                          )}
                        </EntityForm>
                      );
                    }

                    return <div dangerouslySetInnerHTML={{ __html: html }} />;
                  }}
                </RenderSwitch>
              </GuidancePanel>
            )}
          </Mutation>
        )}
      </Query>
    )}
  </EntityModalGuidance>
);

CanvasModalGuidance.propTypes = {
  documentType: PropTypes.string.isRequired,
};

export default CanvasModalGuidance;
