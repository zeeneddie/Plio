import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { ActionTypes, ProblemTypes } from '../../../../../../../share/constants';
import { filterNCs } from '../../../../../../../api/non-conformities/util';

Template.Actions_LinkedTo_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'risk', 'search', 'utils', 'vmTraverse'],
  linkedTo: '',
  standardId: '',
  isEditable: false,
  placeholder: 'Linked to',
  type: '',
  isDeleteButtonVisible: true,
  value() {
    return invoke(this.child('Select_Multi'), 'value');
  },
  linkedDocs() {
    const { linkedTo } = this.getData();
    const ids = linkedTo.map(({ documentId }) => documentId);
    const query = { _id: { $in: ids } };
    const options = { sort: { serialNumber: 1 } };
    return this.getDocs(query, options).reduce((prev, cur) => [...prev, ...cur]);
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
    return [ncs, risks];
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
    const [ncs, risks] = this.getDocs(query, options);
    return this.getDocsByType(type, ncs, risks);
  },
  getDocsByType(type = '', ncs = [], risks = []) {
    switch (type) {
      case ActionTypes.CORRECTIVE_ACTION:
      case ActionTypes.PREVENTATIVE_ACTION:
        return filterNCs(ncs).concat(risks);
      case ActionTypes.RISK_CONTROL:
        return risks;
      default:
        return [];
    }
  },
  onLink() {},
  onUpdateFn() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItem = {}, selected } = viewmodel.getData();
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
      }
    };

    this.onLink({ documentId, documentType }, cb);
  },
  onUnlink() {},
  onRemoveFn() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const { selectedItem = {}, selected } = viewmodel.getData();
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
      }
    };

    this.onUnlink({ documentId, documentType }, cb);
  },
  getData() {
    const { linkedTo } = this.data();
    return { linkedTo: [...new Set(linkedTo)] };
  },
});
