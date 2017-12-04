import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

Template.IP_Owner_Edit.viewmodel({
  mixin: ['search', 'user', 'members'],
  owner: '',
  label: 'Owner',
  placeholder: 'Owner',
  selectFirstIfNoSelected: false,
  selectArgs() {
    const {
      owner: value,
      placeholder,
      selectFirstIfNoSelected,
    } = this.data();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      onUpdate: (viewmodel) => {
        const { selected: owner } = viewmodel.getData();

        this.owner(owner);

        invoke(this.parent(), 'update', { 'improvementPlan.owner': owner });
      },
    };
  },
  getData() {
    const { owner } = this.data();
    return { owner };
  },
});
