import { Template } from 'meteor/templating';

Template.Subcards_RiskScore.viewmodel({
  disabled: false,
  tableData: '',
  score: '',
  guidePanelCollapsed: true,
  guideHtml: '',
  tableDataWithGuidelines() {
    const { tableData = {} } = this.data();
    const { data = [] } = tableData;
    const withoutLast = data.slice(0, data.length - 1);
    const last = _.last(data);
    last.label = this.guidelinesText();
    const newData = withoutLast.concat([last]);
    tableData.data = newData;
    return tableData;
  },
  guidelinesText() {
    const text = this.guidePanelCollapsed() ? 'Guidelines' : 'Hide guidelines';

    return (`<button type="button" class="btn btn-link btn-collapse toggle-collapse no-padding">
               <span>${text}</span>
             </button>`);
  },
  onGuidePanelToggle() {
    return (viewmodel) => {
      const child = this.child('RiskScoring_Guidelines');

      if (!child) return;

      this.guidePanelCollapsed(!child.collapsed());

      return child.toggleCollapse();
    };
  },
  onScoreUpdate() {
    return ({ rowId, value }) => {
      const { score: { rowId:ri, value:v, ...rest } } = this.data();

      this.score({ rowId, value, ...rest });
    };
  },
  update({ ...args }) {
    const { score = [] } = this.data();
    _.keys(args).forEach(key => score[key] = args[key]);
    this.score(score);
  },
  getData() {
    const { score } = this.data();
    return { ...score };
  }
});
