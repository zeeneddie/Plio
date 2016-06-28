import { Template } from 'meteor/templating';

Template.Subcards_RiskAnalysis_Edit.viewmodel({
  score: '',
  tableData() {
    return {
      xHeading: 'Probability',
      yHeading: 'Impacts',
      data: [
        {
          _id: 1,
          label: 'Catastrophic',
          rows: [45, 65, 91, 95, 100]
        },
        {
          _id: 2,
          label: 'Significant',
          rows: [35, 60, 75, 80, 85]
        },
        {
          _id: 3,
          label: 'Moderate',
          rows: [26, 51, 54, 59, 66]
        },
        {
          _id: 4,
          label: 'Minor',
          rows: [15, 26, 30, 36, 42]
        },
        {
          _id: 5,
          label: 'Limited',
          rows: [1, 8, 12, 16, 20]
        },
        {
          _id: 6,
          label: '',
          rows: ['V.Low', 'Low', 'Med', 'High', 'V.High'],
        }
      ]
    };
  },
  getScore() {
    return this.score() ? this.score().value : '';
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update({ rowId, value }) {
    const score = { rowId, value };
    this.parent().update({ score });
  },
  getData() {
    const { score } = this.data();
    return { score };
  }
});
