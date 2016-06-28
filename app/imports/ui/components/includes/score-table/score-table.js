import { Template } from 'meteor/templating';

Template.ScoreTable_Edit.viewmodel({
  score: '',
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
  onUpdateCb() {
    return this.update.bind(this);
  },
  onUpdate() {},
  update({ rowId, value }) {
    this.onUpdate({ rowId, value });
  },
  getData() {
    const { active } = this.data();
    return { active };
  }
});
