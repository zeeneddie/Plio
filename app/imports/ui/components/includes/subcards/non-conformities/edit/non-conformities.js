import { Template } from 'meteor/templating';
import {
  insert, update, remove,
  setAnalysisDate, completeAnalysis, undoAnalysis,
  updateStandards, undoStandardsUpdate, setStandardsUpdateDate
} from '/imports/api/non-conformities/methods.js';
import { getTzTargetDate } from '/imports/api/helpers.js';


Template.Subcards_NonConformities_Edit.viewmodel({
  mixin: ['addForm', 'nonconformity', 'organization', 'modal'],
  _query: {},
  isStandardsEditable: false,
  renderContentOnInitial() {
    return !(this.NCs().count() > 5);
  },
  NCs() {
    return this._getNCsByQuery({ ...this._query() }, { sort: { serialNumber: 1 } });
  },
  renderText({ sequentialId, title }) {
    return `<strong>${sequentialId}</strong> ${title}`;
  },
  addNC() {
    this.addForm(
      'Subcard',
      {
        content: 'NC_Create',
        isStandardsEditable: this.isStandardsEditable(),
        standardsIds: [this._id && this._id()],
        _lText: 'New non-conformity',
        insertFn: this.insert.bind(this),
        removeFn: this.remove.bind(this)
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, { ...args, organizationId }, cb);
  },
  updateFn() {
    return this.update.bind(this);
  },
  update({ _id, ...args }, cb = () => {}) {
    this.modal().callMethod(update, { _id, ...args }, cb);
  },
  removeFn() {
    return this.remove.bind(this);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    if (!_id) {
      return viewmodel.destroy();
    } else {
      const { title } = viewmodel.getData();

      swal(
        {
          title: 'Are you sure?',
          text: `The non-conformity "${title}" will be removed.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Remove',
          closeOnConfirm: false
        },
        () => {
          const cb = (err) => {
            if (err) {
              swal.close();
              return;
            }

            viewmodel.destroy();

            swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');
          };

          this.modal().callMethod(remove, { _id }, cb);
        }
      );
    }
  },
  updateAnalysisDateFn() {
    return this.updateAnalysisDate.bind(this);
  },
  updateAnalysisDate({ _id, date }, cb) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(date, timezone);

    this.modal().callMethod(setAnalysisDate, { _id, targetDate: tzDate }, cb);
  },
  completeAnalysisFn() {
    return this.completeAnalysis.bind(this);
  },
  completeAnalysis({ _id }, cb) {
    this.modal().callMethod(completeAnalysis, { _id }, cb);
  },
  undoAnalysisFn() {
    return this.undoAnalysis.bind(this);
  },
  undoAnalysis({ _id }, cb) {
    this.modal().callMethod(undoAnalysis, { _id }, cb);
  },
  updateStandardsDateFn() {
    return this.updateStandardsDate.bind(this);
  },
  updateStandardsDate({ _id, date }, cb) {
    const { timezone } = this.organization();
    const tzDate = getTzTargetDate(date, timezone);

    this.modal().callMethod(setStandardsUpdateDate, { _id, targetDate: tzDate }, cb);
  },
  updateStandardsFn() {
    return this.updateStandards.bind(this);
  },
  updateStandards({ _id }, cb) {
    this.modal().callMethod(updateStandards, { _id }, cb);
  },
  undoStandardsUpdateFn() {
    return this.undoStandardsUpdate.bind(this);
  },
  undoStandardsUpdate({ _id }, cb) {
    this.modal().callMethod(undoStandardsUpdate, { _id }, cb);
  },
});
