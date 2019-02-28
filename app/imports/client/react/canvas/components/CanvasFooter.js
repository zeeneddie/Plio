import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { ButtonGroup } from 'reactstrap';
import { bySerialNumber, byTitle } from 'plio-util';
import { concat, sort, unnest } from 'ramda';
import { Mutation } from 'react-apollo';

import { DocumentTypes } from '../../../../share/constants';
import { WithToggle, WithState } from '../../helpers';
import { buildLinkedDocsData } from '../helpers';
import CanvasSectionFooter from './CanvasSectionFooter';
import CanvasSectionFooterLabels from './CanvasSectionFooterLabels';
import CanvasFooterItems from './CanvasFooterItems';
import CanvasFooterItem from './CanvasFooterItem';
import CanvasStandardFooterItem from './CanvasStandardFooterItem';
import CanvasChartButton from './CanvasChartButton';
import CanvasLinkedModal from './CanvasLinkedModal';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';

const CanvasFooter = ({
  items,
  isEmpty,
  renderChartModal,
  chartButtonIcon,
  organizationId,
  documentType: ownDocumentType,
}) => {
  const {
    goals = [],
    standards = [],
    risks = [],
    nonconformities = [],
    potentialGains = [],
  } = buildLinkedDocsData(items);
  const nonconformitiesAndGains = concat(nonconformities, potentialGains);
  const hasLinkedDocs = !!unnest([
    nonconformitiesAndGains,
    risks,
    standards,
    goals,
  ]).length;

  return (!!renderChartModal || hasLinkedDocs) && (
    <Mutation
      ignoreResults
      mutation={Mutations.DELETE_RELATION}
      refetchQueries={[{
        query: Queries.CANVAS_PAGE,
        variables: { organizationId },
      }]}
    >
      {(deleteRelation) => {
        const onDeleteRelation = (name, docType) => ({ _id, title }) => swal.promise(
          {
            text: `The ${name} "${title}" will be unlinked`,
            confirmButtonText: 'Unlink',
            successTitle: 'Unlinked!',
            successText: `The ${name} "${title}" was unlinked successfully.`,
          },
          () => deleteRelation({
            variables: {
              input: {
                rel1: {
                  documentType: ownDocumentType,
                },
                rel2: {
                  documentId: _id,
                  documentType: docType,
                },
              },
            },
          }),
        );

        return (
          <CanvasSectionFooter>
            <CanvasSectionFooterLabels>
              <ButtonGroup>
                <WithState initialState={{ documentId: null, documentType: null }}>
                  {({ state: { documentId, documentType }, setState }) => (
                    <Fragment>
                      <CanvasLinkedModal
                        {...{ documentId, documentType, organizationId }}
                        isOpen={!!documentId}
                        toggle={() => setState({ documentId: null })}
                      />
                      <CanvasFooterItems
                        label="Key goal"
                        renderItem={CanvasFooterItem}
                        items={sort(bySerialNumber, goals)}
                        onClick={({ _id }) => setState({
                          documentId: _id,
                          documentType: DocumentTypes.GOAL,
                        })}
                        onDelete={onDeleteRelation('goal', DocumentTypes.GOAL)}
                      />
                      <CanvasFooterItems
                        label="Standard"
                        renderItem={CanvasStandardFooterItem}
                        items={sort(byTitle, standards)}
                        onClick={({ _id }) => setState({
                          documentId: _id,
                          documentType: DocumentTypes.STANDARD,
                        })}
                        onDelete={onDeleteRelation('standard', DocumentTypes.STANDARD)}
                      />
                      <CanvasFooterItems
                        label="Risk"
                        renderItem={CanvasFooterItem}
                        items={sort(bySerialNumber, risks)}
                        onClick={({ _id }) => setState({
                          documentId: _id,
                          documentType: DocumentTypes.RISK,
                        })}
                        onDelete={onDeleteRelation('risk', DocumentTypes.RISK)}
                      />
                      <CanvasFooterItems
                        label="NCs & gain"
                        renderItem={CanvasFooterItem}
                        items={sort(bySerialNumber, nonconformitiesAndGains)}
                        onClick={({ _id, type }) => setState({
                          documentId: _id,
                          documentType: type,
                        })}
                        onDelete={item => onDeleteRelation(
                          item.type === DocumentTypes.NON_CONFORMITY
                            ? 'nonconformity'
                            : 'potential gain',
                          DocumentTypes.NON_CONFORMITY,
                        )(item)}
                      />
                    </Fragment>
                  )}
                </WithState>
              </ButtonGroup>
            </CanvasSectionFooterLabels>
            {renderChartModal && !isEmpty && (
              <WithToggle>
                {chartModalState => (
                  <Fragment>
                    {renderChartModal(chartModalState)}
                    <CanvasChartButton icon={chartButtonIcon} onClick={chartModalState.toggle} />
                  </Fragment>
                )}
              </WithToggle>
            )}
          </CanvasSectionFooter>
        );
      }}
    </Mutation>
  );
};

CanvasFooter.defaultProps = {
  chartButtonIcon: 'pie-chart',
};

CanvasFooter.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEmpty: PropTypes.bool,
  renderChartModal: PropTypes.func,
  chartButtonIcon: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
};

export default CanvasFooter;
