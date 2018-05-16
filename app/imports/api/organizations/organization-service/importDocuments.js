import { Random } from 'meteor/random';
import { Meteor } from 'meteor/meteor';
import curry from 'lodash.curry';

import { assoc, omitC, compose, reduceC, getC, cond } from '/imports/api/helpers';
import { DocumentTypes, SystemName } from '/imports/share/constants';
import { getCollectionByDocType } from '/imports/share/helpers';
import { Files } from '/imports/share/collections/files';
import { Discussions } from '/imports/share/collections/discussions';

const getFieldsByDocType = (documentType, fields) => {
  switch (documentType) {
    case DocumentTypes.STANDARD:
      return Object.assign({}, fields, {
        sectionId: 1,
        uniqueNumber: 1,
        issueNumber: 1,
        nestingLevel: 1,
        source1: 1,
        source2: 1,
      });
    case DocumentTypes.RISK:
      return Object.assign({}, fields, {
        statusComment: 1,
        serialNumber: 1,
        sequentialId: 1,
        workflowType: 1,
        magnitude: 1,
      });
    default:
      return fields;
  }
};

const getBaseEntity = () => ({
  _id: Random.id(),
  createdBy: SystemName,
  createdAt: new Date(),
});

const getPathsByDocType = (documentType, userId, paths) => {
  switch (documentType) {
    case DocumentTypes.STANDARD:
      return Object.assign({}, paths, ({ owner: userId }));
    case DocumentTypes.RISK:
      return Object.assign({}, paths, ({ originatorId: userId }));
    default:
      return paths;
  }
};

const mapFieldsByDocType = curry((documentType, organizationId, userId, doc) => {
  // assign current user's id to object's paths
  const entity = getPathsByDocType(documentType, userId, {
    ...getBaseEntity(),
    organizationId,
    departmentsIds: [],
    notify: [userId],
  });

  const result = Object.assign({}, omitC(['_id', 'titlePrefix'], doc), entity);

  return result;
});

const copyFile = curry((organizationId, bulk, _id) => {
  const query = { _id };
  const options = {
    fields: {
      name: 1,
      extension: 1,
      progress: 1,
      url: 1,
      status: 1,
    },
  };
  const file = Files.findOne(query, options);

  if (!file) return null;

  const newFile = Object.assign({}, file, {
    organizationId,
    _id: Random.id(),
  });

  bulk.insert(newFile);

  return newFile._id;
});

const copyStandardSources = curry((bulkFiles, to, _, doc) => {
  const { source1, source2 } = doc;
  const reducer = (prev, file, i) => compose(
    cond(
      Boolean,
      fileId => assoc(`source${i + 1}.fileId`, fileId, prev),
      () => prev,
    ),
    copyFile(to, bulkFiles),
    getC('fileId'),
  )(file);
  const result = reduceC(reducer, { ...doc }, [source1, source2]);

  return result;
});

const copyDiscussion = curry((bulkDiscussions, documentType, to, _, doc) => {
  const newDiscussion = {
    documentType,
    organizationId: to,
    linkedTo: doc._id,
    isPrimary: true,
  };

  Object.assign(newDiscussion, getBaseEntity());

  bulkDiscussions.insert(newDiscussion);

  return doc;
});

const copyStandardDeps = ([bulkFiles, bulkDiscussions], to, from, doc) => compose(
  copyStandardSources(bulkFiles, to, from),
  copyDiscussion(bulkDiscussions, DocumentTypes.STANDARD, to, from),
)(doc);

const copyDeps = curry((documentType, [bulkFiles, bulkDiscussions], to, from, doc) => {
  switch (documentType) {
    case DocumentTypes.STANDARD:
      return copyStandardDeps([bulkFiles, bulkDiscussions], to, from, doc);
    default:
      return doc;
  }
});

const initBulk = collection => collection.rawCollection().initializeUnorderedBulkOp();

const executeBulks = (...bulks) => bulks.reduce((acc, bulk) => {
  if (!bulk || !bulk.length) return acc;

  const result = Meteor.wrapAsync(bulk.execute.bind(bulk))();

  return acc.concat(result);
}, []);

const bulkInsertDocuments = (documentType, to, from, userId) => {
  const collection = getCollectionByDocType(documentType);
  const query = { organizationId: from, isDeleted: false };
  const common = {
    typeId: 1,
    title: 1,
    description: 1,
    isDeleted: 1,
    status: 1,
  };
  const fields = getFieldsByDocType(documentType, common);
  const options = {
    fields,
    sort: { title: 1 },
  };
  const cursor = collection.find(query, options);
  const iterator = (bulk, bulkFiles, bulkDiscussions) => compose(
    bulk.insert.bind(bulk),
    copyDeps(documentType, [bulkFiles, bulkDiscussions], to, from),
    mapFieldsByDocType(documentType, to, userId),
  );
  const bulk = initBulk(collection);
  const bulkFiles = initBulk(Files);
  const bulkDiscussions = initBulk(Discussions);

  cursor.forEach(iterator(bulk, bulkFiles, bulkDiscussions));

  return executeBulks(bulk, bulkFiles, bulkDiscussions);
};

export default function importDocuments({
  to, from, userId, documentType,
}) {
  const res = bulkInsertDocuments(documentType, to, from, userId)[0];

  return res && res.getInsertedIds();
}
