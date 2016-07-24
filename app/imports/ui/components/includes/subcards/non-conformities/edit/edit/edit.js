import { Template } from 'meteor/templating';


Template.NC_Subcard_Edit.viewmodel({
  NCId() {
    const { _id } = (this.NC && this.NC()) || {};
    return _id;
  },
  update({ ...args }) {
    this.parent().update({ ...args });
  },
  getUpdateAnalysisDateFn() {
    return ({ date }) => {
      this.parent().callUpdate(this.updateAnalysisDateFn, {
        _id: this.NCId(),
        date
      });
    };
  },
  getCompleteAnalysisFn() {
    return () => {
      this.parent().callUpdate(this.completeAnalysisFn, {
        _id: this.NCId(),
      });
    };
  },
  getUndoAnalysisFn() {
    return () => {
      this.parent().callUpdate(this.undoAnalysisFn, {
        _id: this.NCId(),
      });
    };
  },
  getUpdateStandardsDateFn() {
    return ({ date }) => {
      this.parent().callUpdate(this.updateStandardsDateFn, {
        _id: this.NCId(),
        date
      });
    };
  },
  getUpdateStandardsFn() {
    return () => {
      this.parent().callUpdate(this.updateStandardsFn, {
        _id: this.NCId(),
      });
    };
  },
  getUndoStandardsUpdateFn() {
    return () => {
      this.parent().callUpdate(this.undoStandardsUpdateFn, {
        _id: this.NCId(),
      });
    };
  },
  getData() {
    return this.child('NC_Card_Edit_Main').getData();
  }
});
