import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';


Template.Actions_LinkedProblems.viewmodel({
  mixin: ['search', 'organization'],
  linkedProblems: [],
  standardsIds: [],
  isEditable: true,
  linkedProblemsIds() {
    return this._getProbemIds();
  },
  NCsIds() {
    return this._getProbemIds('non-conformity');
  },
  RisksIds() {
    return this._getProbemIds('risk');
  },
  standardsIdsArray() {
    return Array.from(this.standardsIds() || []);
  },
  problemSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  problems() {
    const NCsIds = this.NCsIds();
    const RisksIds = this.RisksIds();

    const NCQuery = {
      ...this.searchObject('problemSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      _id: { $nin: NCsIds },
      standardId: { $in: this.standardsIdsArray() }
    };
    const NCs = NonConformities.find(NCQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return { html, sequentialId, title: fullTitle, problemType: 'non-conformity', ...args };
    });

    const riskQuery = {
      ...this.searchObject('problemSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      _id: { $nin: RisksIds },
      standardId: { $in: this.standardsIdsArray() }
    };
    const risks = Risks.find(riskQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return { html, sequentialId, title: fullTitle, problemType: 'risk', ...args };
    });

    return NCs.concat(risks);
  },
  linkedProblemsDocs() {
    const NCsIds = this.NCsIds();
    const RisksIds = this.RisksIds();

    const NCQuery = {
      _id: { $in: NCsIds },
      organizationId: this.organizationId(),
      standardId: { $in: this.standardsIdsArray() }
    };
    const NCs = NonConformities.find(NCQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      return { sequentialId, title: fullTitle, problemType: 'non-conformity', ...args };
    });

    const riskQuery = {
      _id: { $in: RisksIds },
      organizationId: this.organizationId(),
      standardId: { $in: this.standardsIdsArray() }
    };
    const risks = Risks.find(riskQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return { sequentialId, title: fullTitle, problemType: 'risk', ...args };
    });

    return NCs.concat(risks);
  },
  onSelectCb() {
    return this.onSelect.bind(this);
  },
  onSelect(viewmodel) {
    const { _id:problemId, problemType } = viewmodel.getSelectedItem();

    if (this.linkedProblemsIds().find(id => id === problemId)) return;

    this.onLink({ problemId, problemType }, () => {
      viewmodel.value('');
      viewmodel.selected('');
    });
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id:problemId, problemType } = Blaze.getData(e.target);

    if (!this.linkedProblemsIds().find(id => id === problemId)) return;

    this.onUnlink({ problemId, problemType });
  },
  _getProbemIds(problemType) {
    let problemsDocs;
    if (problemType) {
      problemsDocs = _.filter(
        this.linkedProblems(),
        ({ problemType }) => problemType === problemType
      );
    } else {
      problemsDocs = this.linkedProblems();
    }
    return _.pluck(problemsDocs, 'problemId');
  }
});
