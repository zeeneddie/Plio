import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

Template.Subcards_RiskScoring_Edit.viewmodel({
  mixin: ['riskScore', 'date', 'addForm'],
  label: 'Risk scoring',
  scores: '',
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
  getScoreLabel({ value } = {}) {
    return value
              ? `<span>${this.getNameByScore(value)}</span>
                 <span class="label impact-${this.getClassByScore(value)}">
                   ${value}
                 </span>`
              : '';
  },
  add() {
    this.addForm(
      'SubCard_Edit',
      {
        content: 'Subcards_RiskScore',
        _lText: 'New risk score',
        tableData: this.tableData(),
        insertFn: this.insertFn(),
        removeFn: this.removeFn()
      }
    );
  },
  onUpdate() {},
  insertFn() {
    return ({ ...args }, cb) => {
      const options = {
        $addToSet: {
          scores: {
            _id: Random.id(),
            ...args
          }
        }
      };

      this.onUpdate({ options }, cb)
    };
  },
  removeFn() {
    return (viewmodel, cb) => {
      const { _id } = viewmodel;

      if (!_id) {
        viewmodel.destroy();
      } else {
        const options = {
          $pull: {
            scores: { _id }
          }
        };

        this.onUpdate({ options }, cb);
      }
    };
  },
  getData() {
    const { score } = this.data();
    return { score };
  }
});
