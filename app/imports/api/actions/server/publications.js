import { Meteor } from 'meteor/meteor';
import { Actions } from '/imports/share/collections/actions.js';
import { Files } from '/imports/share/collections/files.js';
import { isOrgMember } from '../../checkers.js';
import { ProblemTypes } from '/imports/share/constants.js';
import {
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection
} from '/imports/api/constants.js';
import Counter from '../../counter/server.js';

const getActionFiles = (action) => {
  const fileIds = action.fileIds || [];
  return Files.find({ _id: { $in: fileIds } });
};

Meteor.publishComposite('actionsList', function(organizationId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Actions.find({
        organizationId,
        isDeleted
      }, {
        fields: ActionsListProjection
      });
    }
  }
});

Meteor.publishComposite('actionCard', function({ _id, organizationId }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Actions.find({
        _id,
        organizationId
      });
    },
    children: [{
      find(action) {
        return getActionFiles(action);
      }
    }, {
      find({ linkedTo }) {
        const NCIds = _.map(_.where(linkedTo, {
          documentType: ProblemTypes.NC
        }), (lt) => {
          return lt.documentId;
        });

        return NonConformities.find({ _id: { $in: NCIds }, organizationId }, {
          fields: _.extend(NonConformitiesListProjection, { workflowType: 1 })
        });
      }
    }, {
      find({ linkedTo }) {
        const riskIds = _.map(_.where(linkedTo, {
          documentType: ProblemTypes.RISK
        }), (lt) => {
          return lt.documentId;
        });

        return Risks.find({ _id: { $in: riskIds }, organizationId }, {
          fields: _.extend(RisksListProjection, { workflowType: 1 })
        });
      }
    }]
  };
});

Meteor.publishComposite('actionsByIds', function(ids = []) {
  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: { $in: [null, false] }
      };

      const { organizationId } = Object.assign({}, Actions.findOne(query));
      const userId = this.userId;

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      query = { ...query, organizationId };

      return Actions.find(query);
    },
    children: [{
      find(action) {
        return getActionFiles(action);
      }
    }]
  };
});

Meteor.publish('actionsCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('actionsNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});
