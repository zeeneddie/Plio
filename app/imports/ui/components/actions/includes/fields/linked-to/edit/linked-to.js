import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { ActionTypes, ProblemTypes } from '/imports/api/constants.js';

Template.Actions_LinkedTo_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'risk', 'search', 'utils'],
  linkedTo: '',
  standardId: '',
  isEditable: false,
  placeholder: 'Linked to',
  type: '',
  value() {
    const child = this.child('Select_Multi');
    return !!child && child.value();
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
    return array.map(({ sequentialId, title, ...args }) => ({ docTitle: title, title: `${sequentialId} ${title}`, sequentialId, type, ...args }));
  },
  getDocs(query, options) {
    const ncs = this.mapDocs(this._getNCsByQuery(query, options), ProblemTypes.NC);
    const risks = this.mapDocs(this._getRisksByQuery(query, options), ProblemTypes.RISK);
    return [ncs, risks];
  },
  items() {
    const searchQuery = this.searchObject('value', [{ name: 'sequentialId' }, { name: 'title' }]);
    let query = { ...searchQuery, _id: { $nin: this.linkedDocsIds() } };
    if (this.standardId()) {
      query = { ...query, standardsIds: this.standardId() };
    }
    const options = { sort: { serialNumber: 1 } };
    const [ncs, risks] = this.getDocs(query, options);
    return this.getDocsByType(this.type(), ncs, risks);
  },
  getDocsByType(type = '', ncs = [], risks = []) {
    switch(type) {
      case ActionTypes.CORRECTIVE_ACTION:
        return ncs.concat(risks);
        break;
      case ActionTypes.PREVENTATIVE_ACTION:
        return ncs;
        break;
      case ActionTypes.RISK_CONTROL:
        return risks;
        break;
      default:
        return [];
        break;
    }
  },
  onLink() {},
  onUpdateFn() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selectedItem = {}, selected } = viewmodel.getData();
    const { _id:documentId, type:documentType } = selectedItem;
    const { linkedTo } = this.getData();
    const { linkedDocs } = this.data();

    if (linkedTo.find(({ documentId:_id }) => _id === documentId)) return;

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
    const { _id:documentId, type:documentType } = selectedItem;
    const { linkedTo } = this.getData();
    const { linkedDocs } = this.data();

    if (!linkedTo.find(({ documentId:_id }) => _id === documentId)) return;

    const newLinkedTo = linkedTo.filter(({ documentId:_id }) => _id !== documentId);
    const newDocs = Array.from(linkedDocs || []).filter(({ _id }) => _id !== documentId);

    // if we are viewing subcard show error in subcard, otherwise in modal
    if (this._id && newLinkedTo.length === 0) {
      const subcard = this.findParentRecursive('SubCard_Edit', this.parent());

      if (!subcard) {
        ViewModel.findOne('ModalWindow').setError('An action must be linked to at least one document');
      } else {
        subcard.setError && subcard.setError('An action must be linked to at least one document');
      }
      return;
    }

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
  }
});
