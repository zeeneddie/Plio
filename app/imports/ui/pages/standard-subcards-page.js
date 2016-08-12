import { Template } from 'meteor/templating';

Template.StandardSubcardsPage.viewmodel({
  autorun() {
    const NCIds = ["P98SExuNHZ4y8bhjc"];
    this.templateInstance.subscribe('occurrencesByNCIds', NCIds)
  }
});
