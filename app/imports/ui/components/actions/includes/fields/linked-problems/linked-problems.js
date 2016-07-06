import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { ProblemTypes } from '/imports/api/constants.js';


Template.Actions_LinkedProblems.viewmodel({
  mixin: ['search', 'organization'],
  linkedProblems: [],
  standardsIds: [],
  isEditable: true,
  linkedProblemsIds() {
    return this._getProbemIds();
  },
  NCsIds() {
    return this._getProbemIds(ProblemTypes.NC);
  },
  RisksIds() {
    return this._getProbemIds(ProblemTypes.RISK);
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
      return { html, sequentialId, title: fullTitle, problemType: ProblemTypes.NC, ...args };
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
      return { html, sequentialId, title: fullTitle, problemType: ProblemTypes.RISK, ...args };
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
    const NCs = NonConformities.find(NCQuery, { sort: { serialNumber: 1 } }).map(({ ...args }) => {
      return { problemType: ProblemTypes.NC, ...args };
    });

    const riskQuery = {
      _id: { $in: RisksIds },
      organizationId: this.organizationId(),
      standardId: { $in: this.standardsIdsArray() }
    };
    const risks = Risks.find(riskQuery, { sort: { serialNumber: 1 } }).map(({ ...args }) => {
      return { problemType: ProblemTypes.RISK, ...args };
    });

    return NCs.concat(risks);
  },
  onSelectCb() {
    return this.onSelect.bind(this);
  },
  onSelect(viewmodel) {
    const { _id:problemId, problemType } = viewmodel.getSelectedItem();

    if (this.linkedProblemsIds().find(id => id === problemId)) return;

    const resetSelectItemVm = () => {
      viewmodel.value('');
      viewmodel.selected('');
    };

    if (this.onLink) {
      this.onLink({ problemId, problemType }, resetSelectItemVm);
    } else {
      this.linkedProblems().push({ problemId, problemType });
      resetSelectItemVm();
    }
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id:problemId, problemType } = Blaze.getData(e.target);

    if (!this.linkedProblemsIds().find(id => id === problemId)) return;

    if (this.onUnlink) {
      this.onUnlink({ problemId, problemType });
    } else {
      this.linkedProblems().remove((item) => {
        return (item.problemId === problemId) && (item.problemType === problemType);
      });
    }
  },
  getData() {
    return { linkedProblems: this.linkedProblems().array() };
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
