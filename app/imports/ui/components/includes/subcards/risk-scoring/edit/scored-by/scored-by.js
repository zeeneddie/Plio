import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.RiskScoring_ScoredBy_Edit.viewmodel({
  scoredBy: '',
  label: 'Scored by',
  placeholder: 'Scored by',
  selectFirstIfNoSelected: false,
  disabled: false,
  selectArgs() {
    const {
      scoredBy: value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
    } = this.data();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      onUpdate: (viewmodel) => {
        const { selected: scoredBy } = viewmodel.getData();

        this.scoredBy(scoredBy);

        return invoke(this.parent(), 'update', { scoredBy });
      },
    };
  },
});
