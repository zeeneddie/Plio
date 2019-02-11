import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { omit } from 'ramda';

import { Mutation as Mutations } from '../../../graphql';
import { renderComponent } from '../../helpers';
import { swal } from '../../../util';

class RelationsAdapter extends Component {
  static propTypes = {
    documentId: PropTypes.string.isRequired,
    documentType: PropTypes.string.isRequired,
    relatedDocumentType: PropTypes.string.isRequired,
    createRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired,
  }

  onLink = entityId => this.mutate(this.props.createRelation, entityId)

  onUnlink = entityId => this.mutate(this.props.deleteRelation, entityId)

  mutate = (mutation, entityId) => {
    const { documentId, documentType, relatedDocumentType } = this.props;
    return mutation({
      variables: {
        input: {
          rel1: {
            documentId,
            documentType,
          },
          rel2: {
            documentId: entityId,
            documentType: relatedDocumentType,
          },
        },
      },
    }).catch(swal.error);
  }

  render() {
    return renderComponent({
      ...omit(['createRelation', 'deleteRelation'], this.props),
      onLink: this.onLink,
      onUnlink: this.onUnlink,
    });
  }
}

const RelationsAdapterContainer = props => (
  <Mutation mutation={Mutations.CREATE_RELATION} refetchQueries={props.refetchQueries}>
    {createRelation => (
      <Mutation mutation={Mutations.DELETE_RELATION} refetchQueries={props.refetchQueries}>
        {deleteRelation => (
          <RelationsAdapter
            {...{
              createRelation,
              deleteRelation,
              ...props,
            }}
          />
        )}
      </Mutation>
    )}
  </Mutation>
);

RelationsAdapterContainer.propTypes = {
  refetchQueries: PropTypes.func,
};

export default React.memo(RelationsAdapterContainer);
