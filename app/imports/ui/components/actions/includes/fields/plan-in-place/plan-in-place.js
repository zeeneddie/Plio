import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionPlanOptions } from '/imports/share/constants.js';


Template.Actions_PlanInPlace.viewmodel({
  planInPlace: ActionPlanOptions.NO,
  planInPlaceOptions() {
    return _.map(ActionPlanOptions, val => ({ text: val, value: val }));
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { value: planInPlace } = viewmodel.getData();

    if (planInPlace === this.templateInstance.data.planInPlace) {
      return;
    }

    this.planInPlace(planInPlace);

    this.parent().update && this.parent().update({ planInPlace });
  },
  getData() {
    return { planInPlace: this.planInPlace() };
  },
});
