import { Template } from 'meteor/templating';

Template.Subcards_RiskAnalysis_Edit.viewmodel({
  tableData() {
    return {
      xHeading: 'Probability',
      yHeading: 'Impacts',
      data: [
        {
          label: 'Catastrophic',
          rows: [45, 65, 91, 95, 100]
        },
        {
          label: 'Significant',
          rows: [35, 60, 75, 80, 85]
        },
        {
          label: 'Moderate',
          rows: [26, 51, 54, 59, 66]
        },
        {
          label: 'Minor',
          rows: [15, 26, 30, 36, 42]
        },
        {
          label: 'Limited',
          rows: [1, 8, 12, 16, 20]
        },
        {
          label: '',
          rows: ['V.Low', 'Low', 'Med', 'High', 'V.High'],
        }
      ]
    };
  },
});
