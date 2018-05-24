import { Template } from 'meteor/templating';

import { SUPPORT_EMAIL } from '../../api/constants';

Template.TransitionalLayout.viewmodel({
  Constants: {
    SUPPORT_EMAIL,
  },
});
