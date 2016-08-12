import { Template } from 'meteor/templating';

Template.StandardsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization', 'standard'],
  _subHandlers: [],
  isReady: false,
  isDiscussionOpened: false,
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      const standardId = this.standardId();
      let _subHandlers = [
        template.subscribe('departments', organizationId),
        template.subscribe('standardImprovementPlan', standardId),
        template.subscribe('nonConformitiesByStandardId', standardId),
        template.subscribe('workItems', organizationId)
      ];

      if (this.isDiscussionOpened()) {
        _subHandlers = _subHandlers.concat([
          template.subscribe('discussionsByStandardId', standardId),
  				template.subscribe('messagesByStandardId', standardId)
        ]);
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  }
});
