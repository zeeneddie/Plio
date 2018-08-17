import { Template } from 'meteor/templating';

import { Organizations } from '/imports/share/collections/organizations';


Template.OrgSettings_DangerZone.viewmodel({
  mixin: 'modal',
  label: 'Danger zone',
  organizationId: '',
});
