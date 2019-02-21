import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkDocExistence,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

const afterware = () => async (next, root, args, context) => {
  const { collections: { Reviews } } = context;
  const _id = await next(root, args, context);
  const review = Reviews.findOne({ _id });
  return { review };
};

export const resolver = async (root, args, { services: { ReviewService } }) =>
  ReviewService.insert(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkDocExistence((root, { documentId, documentType }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  afterware(),
)(resolver);
