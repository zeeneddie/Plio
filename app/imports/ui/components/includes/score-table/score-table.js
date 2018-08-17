import { Template } from 'meteor/templating';

Template.ScoreTable_Edit.viewmodel({
  disabled: false,
  score: '',
  tableData() {
    return {
      xHeading: '',
      yHeading: '',
      data: [
        {
          label: '',
          rows: [],
        },
      ],
    };
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  onUpdate() {},
  update({ rowId, value }) {
    this.onUpdate({ rowId, value });
  },
  onGuidePanelToggle() {},
  events: {
    'click .toggle-collapse': function (e) {
      this.onGuidePanelToggle(this);
    },
  },
});
