import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { ActionTypes, ProblemTypes, DocumentTypes } from '../../../../../../../share/constants';
import { filterNCs, filterPGs } from '../../../../../../../api/non-conformities/util';
import { client } from '../../../../../../../client/apollo';
import { Actions } from '../../../../../../../share/collections/actions';
import {
  deleteActionFromGoalFragment,
  addActionToGoalFragment,
} from '../../../../../../../client/apollo/utils';
import { Query } from '../../../../../../../client/graphql';
import { searchByRegex, createSearchRegex } from '../../../../../../../api/helpers';

Template.Actions_LinkedTo_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'risk', 'search', 'utils', 'vmTraverse'],
  linkedTo: '',
  standardId: '',
  isEditable: false,
  placeholder: 'Linked to',
  type: '',
  isDeleteButtonVisible: true,
  goals: [],
  onRendered() {
    if (this.type() === ActionTypes.GENERAL_ACTION) {
      client.query({
        query: Query.GOAL_LIST,
        variables: {
          organizationId: this.organizationId(),
        },
      }).then(({ data: { goals: { goals } } }) => {
        this.goals(goals);
      });
    }
  },
  value() {
    return invoke(this.child('Select_Multi'), 'value');
  },
  linkedDocs() {
    const { linkedTo } = this.getData();
    const ids = linkedTo.map(({ documentId }) => documentId);
    const query = { _id: { $in: ids } };
    const options = { sort: { serialNumber: 1 } };
    const { ncs, risks, goals } = this.getDocs(query, options);
    return ncs.concat(risks).concat(goals.filter(goal => ids.includes(goal._id)));
  },
  linkedDocsIds() {
    return this.toArray(this.linkedDocs()).map(({ _id }) => _id);
  },
  mapDocs(array, type) {
    return array.map(({ sequentialId, title, ...args }) => ({
      docTitle: title, title: `${sequentialId} ${title}`, sequentialId, type, ...args,
    }));
  },
  getDocs(query, options) {
    const ncs = this.mapDocs(this._getNCsByQuery(query, options), ProblemTypes.NON_CONFORMITY);
    const risks = this.mapDocs(this._getRisksByQuery(query, options), ProblemTypes.RISK);
    const goals = this.mapDocs(
      searchByRegex(
        createSearchRegex(this.value()),
        ['title', 'sequentialId'],
        this.goals(),
      ),
      DocumentTypes.GOAL,
    );
    return { ncs, risks, goals };
  },
  items() {
    const type = this.type();

    const searchQuery = this.searchObject('value', [{ name: 'sequentialId' }, { name: 'title' }]);
    let query = { ...searchQuery, _id: { $nin: this.linkedDocsIds() } };

    const standardId = this.standardId();
    if (standardId) {
      query = { ...query, standardsIds: standardId };
    }
    const options = { sort: { serialNumber: 1 } };
    return this.getDocsByType(type, this.getDocs(query, options));
  },
  getDocsByType(type = '', { ncs = [], risks = [], goals = [] }) {
    switch (type) {
      case ActionTypes.CORRECTIVE_ACTION:
      case ActionTypes.PREVENTATIVE_ACTION:
        return filterNCs(ncs).concat(risks);
      case ActionTypes.RISK_CONTROL:
        return risks;
      case ActionTypes.GENERAL_ACTION:
        return filterPGs(ncs).concat(goals);
      default:
        return [];
    }
  },
  onLink() {},
  onUpdateFn() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItem = {} } = viewmodel.getData();
    const { _id: documentId, type: documentType } = selectedItem;
    const { linkedTo } = this.getData();
    const { linkedDocs } = this.data();

    if (linkedTo.find(({ documentId: _id }) => _id === documentId)) return;

    const newLinkedTo = linkedTo.concat([{ documentId, documentType }]);
    const newDocs = Array.from(linkedDocs || []).concat([selectedItem]);

    this.linkedTo(newLinkedTo);
    this.linkedDocs(newDocs);

    if (!this._id) return;

    const cb = (err) => {
      if (err) {
        this.linkedTo(linkedTo);
        this.linkedDocs(linkedDocs);
      } else if (documentType === DocumentTypes.GOAL) {
        const action = Actions.findOne({ _id: this._id() });
        addActionToGoalFragment(documentId, action, client);
      }
    };

    this.onLink({ documentId, documentType }, cb);
  },
  onUnlink() {},
  onRemoveFn() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const { selectedItem = {} } = viewmodel.getData();
    const { _id: documentId, type: documentType } = selectedItem;
    const { linkedTo } = this.getData();
    const { linkedDocs } = this.data();

    if (!linkedTo.find(({ documentId: _id }) => _id === documentId)) return;

    const newLinkedTo = linkedTo.filter(({ documentId: _id }) => _id !== documentId);
    const newDocs = Array.from(linkedDocs || []).filter(({ _id }) => _id !== documentId);

    this.linkedTo(newLinkedTo);
    this.linkedDocs(newDocs);

    if (!this._id) return;

    const cb = (err) => {
      if (err) {
        this.linkedTo(linkedTo);
        this.linkedDocs(linkedDocs);
      } else if (documentType === DocumentTypes.GOAL) {
        deleteActionFromGoalFragment(documentId, this._id(), client);
      }
    };

    this.onUnlink({ documentId, documentType }, cb);
  },
  getData() {
    const { linkedTo } = this.data();
    return { linkedTo: [...new Set(linkedTo)] };
  },
});
