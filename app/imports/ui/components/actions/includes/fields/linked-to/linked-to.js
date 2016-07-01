import { Template } from 'meteor/templating';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';

Template.Actions_LinkedTo.viewmodel({
  mixin: ['organization', 'nonconformity', 'risk', 'search', 'utils'],
  onCreated() {
    if ((!this.linkedTo() || this.linkedTo().length === 0) && this.linkedDocsIds().length > 0) {
      const linked = Array.from(this.linkedDocs() || [])
                          .map(({ _id:documentId }) =>
                              ({ documentId, documentType: this.getDocumentType([NonConformities, Risks], documentId)}));
      this.linkedTo(linked);
    }
  },
  linkedDocs: [],
  linkedTo: '',
  selected: '',
  isEditable: false,
  value() {
    const child = this.child('SelectItem');
    return !!child && child.value();
  },
  linkedDocsIds() {
    return Array.from(this.linkedDocs() || []).map(({ _id }) => _id);
  },
  items() {
    const searchQuery = this.searchObject('value', [{ name: 'sequentialId' }, { name: 'title' }]);
    const query = { ...searchQuery, _id: { $nin: this.linkedDocsIds() } };
    const options = { sort: { serialNumber: 1 } };
    return this._getNCsByQuery(query, options).fetch().concat(this._getRisksByQuery(query, options).fetch())
                .map(({ sequentialId, title, ...args }) => ({ title: `${sequentialId} ${title}`, sequentialId, ...args }));
  },
  onSelectCb() {
    return this.update.bind(this);
  },
  getDoc(documentId) {
    return this.getInstanceOfCollection([NonConformities, Risks], documentId).findOne({ _id: documentId });
  },
  getCollectionType(collection) {
    switch(collection) {
      case NonConformities:
        return 'non-conformity';
        break;
      case Risks:
        return 'risk';
        break;
      default:
        return undefined;
        break;
    }
  },
  getDocumentType(collections, _id) {
    const collection = this.getInstanceOfCollection([...collections], _id);
    return this.getCollectionType(collection);
  },
  update(viewmodel) {
    const { selected:documentId, items } = viewmodel.getData();
    const { _id } = items.find(({ _id }) => _id === documentId);

    viewmodel.clear();

    const documentType = this.getDocumentType([NonConformities, Risks], documentId);
    const linkedDocs = Array.from(this.linkedDocs() || []);
    const { linkedTo } = this.getData();

    if (linkedDocs.find(({ _id }) => _id === documentId)) return;

    const newLinkedTo = linkedTo.concat([{ documentId, documentType }]);

    this.linkedTo(newLinkedTo);

    const newDocs = linkedDocs.concat([ this.getDoc(documentId) ]);

    this.linkedDocs(newDocs);

    if (!this._id) return;

    this.parent().update({ ...this.getData() });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id } = Blaze.getData(e.target);

    const { linkedTo } = this.getData();

    if (!linkedTo.find(({ documentId }) => documentId === _id)) return;

    const newArray = linkedTo.filter(({ documentId }) => documentId !== _id);

    this.linkedTo(newArray);

    const newDocs = newArray.map(({ documentId }) => this.getDoc(documentId));

    this.linkedDocs(newDocs);

    if (!this._id) return;

    this.parent().update({ ...this.getData() });
  },
  getData() {
    const { linkedTo } = this.data();
    return { linkedTo: [...new Set(linkedTo)] };
  }
});
