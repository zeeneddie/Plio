import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '../../../share/collections';

Template.fullPageAtForm.onCreated(function () {
  this.autorun(() => {
    const template = FlowRouter.getQueryParam('template');
    if (template) {
      this.subscribe('templateOrganization', template);
    }
  });
});

Template.fullPageAtForm.helpers({
  template() {
    const template = FlowRouter.getQueryParam('template');
    return Organizations.findOne({ signupPath: template });
  },
});
