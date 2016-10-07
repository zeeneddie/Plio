import { Template } from 'meteor/templating';


Template.UserPreferences_DailyRecap.viewmodel({
  mixin: ['collapse'],
  orgCount() {
    return 1;
  },
  orgsData() {
    return [{
      name: 'Clifton Asset Management Plc',
      selected: true
    }, {
      name: 'FE International Ltd',
      selected: false
    }];
  }
});
