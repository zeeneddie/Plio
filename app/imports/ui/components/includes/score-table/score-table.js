import { Template } from 'meteor/templating';

Template.ScoreTable_Edit.viewmodel({
  mixin: 'riskScore',
  tableData() {
    return {
      xHeading: '',
      yHeading: '',
      data: [
        {
          label: '',
          rows: []
        }
      ]
    };
  },
  isLast(elem) {
    return _.isEqual(_.last(this.tableData().data), elem);
  }
});
