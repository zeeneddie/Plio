import { Template } from 'meteor/templating';

Template.ScoreTable_Item.viewmodel({
  mixin: 'riskScore',
  score: {
    rowId: '',
    value: ''
  },
  rowId: '',
  label: '',
  rows: '',
  tableData: '',
  row: '',
  onUpdate() {},
  onClick(value) {
    const data = {
      rowId: this.rowId(),
      value
    };
    this.onUpdate(data);
  },
  isActive(val) {
    if (!this.score()) return false;
    const { rowId, value } = this.score();
    return this.rowId() === rowId && val === value;
  },
  isLast() {
    return _.last(this.tableData().data)._id === this.rowId();
  }
});
