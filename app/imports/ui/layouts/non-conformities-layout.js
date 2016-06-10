import { Template } from 'meteor/templating';
import { Problems } from '/imports/api/problems/problems.js';

Template.NCLayout.viewmodel({
  mixin: 'organization',
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const org = this.organization();
      const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');
      const NCIds = ((() => {
        const query = { organizationId: _id, type: 'non-conformity' };
        return Problems.find(query).fetch().map(({ _id }) => _id);
      })());

      this._subHandlers([
        this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        this.templateInstance.subscribe('organizationUsers', userIds),
        this.templateInstance.subscribe('problems', _id),
        this.templateInstance.subscribe('standards', _id),
        this.templateInstance.subscribe('lessons', _id),
        this.templateInstance.subscribe('occurencesByNCIds', NCIds)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
