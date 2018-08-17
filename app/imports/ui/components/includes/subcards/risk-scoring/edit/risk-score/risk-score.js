import { Template } from 'meteor/templating';
import { RisksHelp } from '/imports/api/help-messages';
import { mapByIndex } from '/imports/api/helpers';

Template.Subcards_RiskScore.viewmodel({
  mixin: 'utils',
  disabled: false,
  tableData: '',
  score: '',
  guidePanelCollapsed: true,
  guideHtml: '',
  riskSocringFieldHelp: RisksHelp.riskScoringScoreType,
  tableDataWithGuidelines() {
    const { tableData = {} } = this.data();
    const { data = [] } = tableData;
    const newData = mapByIndex({ label: this.guidelinesText() }, data.length - 1, data);
    return { ...tableData, data: newData };
  },
  guidelinesText() {
    const text = this.guidePanelCollapsed() ? 'Guidelines' : 'Hide guidelines';

    return (`<button type="button" class="btn btn-link btn-collapse toggle-collapse no-padding">
               <span>${text}</span>
             </button>`);
  },
  onGuidePanelToggle() {
    return (viewmodel) => {
      const ref = this.guidelinesRef;

      if (ref) {
        this.guidePanelCollapsed(!ref.collapsed());

        return ref.toggleCollapse();
      }
    };
  },
  onScoreUpdate() {
    return ({ rowId, value }) => {
      const { score: { rowId: ri, value: v, ...rest } } = this.data();

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
  },
});
