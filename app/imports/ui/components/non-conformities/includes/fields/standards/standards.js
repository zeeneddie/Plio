import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.NCStandards.viewmodel({
  mixin: 'organization',
  text: '',
  value: '',
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('standards', this.organizationId());
    });
  },
  standards() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  },
  select({ _id, title }) {
    this.text(title);
    this.value(_id);
  },
  events: {
    'focus input'() {
      this.text('');
    }
  }
});
