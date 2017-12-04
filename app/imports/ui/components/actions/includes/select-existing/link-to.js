import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { ActionTypes, ProblemTypes } from '/imports/share/constants.js';


Template.Actions_LinkTo.viewmodel({
  mixin: ['search', 'organization'],
  linkedTo: [],
  linkedToIds() {
    return this._getDocsIds();
  },
  NCsIds() {
    return this._getDocsIds(ProblemTypes.NON_CONFORMITY);
  },
  risksIds() {
    return this._getDocsIds(ProblemTypes.RISK);
  },
  docSearchText() {
    const child = this.child('Select_Single');
    return child && child.value();
  },
  docs() {
    const actionType = this.type();

    if (actionType === ActionTypes.CORRECTIVE_ACTION) {
      return this.NCsDocs().concat(this.risksDocs());
    } else if (actionType === ActionTypes.PREVENTATIVE_ACTION) {
      return this.NCsDocs();
    } else if (actionType === ActionTypes.RISK_CONTROL) {
      return this.risksDocs();
    }
    return [];
  },
  NCsDocs() {
    const NCsIds = this.NCsIds();

    const NCQuery = {
      ...this.searchObject('docSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      _id: { $nin: NCsIds },
    };

    const standardId = this.standardId && this.standardId();
    if (standardId) {
      _.extend(NCQuery, { standardsIds: standardId });
    }

    return NonConformities.find(NCQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return {
        html, sequentialId, title: fullTitle, documentType: ProblemTypes.NON_CONFORMITY, ...args,
      };
    });
  },
  risksDocs() {
    const risksIds = this.risksIds();

    const riskQuery = {
      ...this.searchObject('docSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      _id: { $nin: risksIds },
    };

    const standardId = this.standardId && this.standardId();
    if (standardId) {
      _.extend(riskQuery, { standardsIds: standardId });
    }

    return Risks.find(riskQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return {
        html, sequentialId, title: fullTitle, documentType: ProblemTypes.RISK, ...args,
      };
    });
  },
  onSelectCb() {
    return this.onSelect.bind(this);
  },
  onSelect(viewmodel) {
    const { _id: documentId, documentType } = viewmodel.getSelectedItem();

    this.onLink && this.onLink({ documentId, documentType });
  },
  _getDocsIds(docType) {
    let docs;
    if (docType) {
      docs = _.filter(
        this.linkedTo(),
        ({ documentType }) => documentType === docType,
      );
    } else {
      docs = this.linkedTo();
    }
    return _.pluck(docs, 'documentId');
  },
});
