import { Template } from 'meteor/templating';

Template.StandardsPage.viewmodel({
  share: 'window',
  mixin: ['discussions', 'mobile', 'organization', 'standard'],
  _subHandlers: [],
  isReady: false,
  isDiscussionOpened: false,
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      const standardId = this.standardId();
      const arrDiscussionIds = this.getDiscussionIdsByStandardId(standardId);
      let _subHandlers = [
        template.subscribe('departments', organizationId),
        template.subscribe('standardImprovementPlan', standardId),
        template.subscribe('nonConformitiesByStandardId', standardId),
        template.subscribe('workItems', organizationId)
      ];

      if (this.isDiscussionOpened()) {
        _subHandlers = _subHandlers.concat([
          template.subscribe('discussionsByStandardId', standardId),
          template.subscribe('messagesByDiscussionIds', arrDiscussionIds)
        ]);
      }

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  styles() {
    return this.isDiscussionOpened() ? '' : this.display();
  }
});
