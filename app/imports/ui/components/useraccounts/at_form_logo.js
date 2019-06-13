import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '../../../share/collections';

Template.atFormLogo.onCreated(function () {
  this.autorun(() => {
    const template = FlowRouter.getQueryParam('template');
    if (template) {
      this.subscribe('templateOrganization', template);
    }
  });
});

Template.atFormLogo.helpers({
  template() {
    const template = FlowRouter.getQueryParam('template');
    return template ? Organizations.findOne({ signupPath: template }) : undefined;
  },
});
