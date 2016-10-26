import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

import { Organizations } from '/imports/share/collections/organizations.js';
import { updateUserSettings } from '/imports/api/organizations/methods.js';


Template.UserPreferences_DailyRecap.viewmodel({
  mixin: ['modal', 'collapse'],
  userId: '',
  orgsCount() {
    return _(this.orgsData()).filter(doc => doc.sendDailyRecap).length;
  },
  orgsData() {
    const userOrganizations = Organizations.find({
      users: {
        $elemMatch: {
          userId: this.userId(),
          isRemoved: false,
          removedBy: { $exists: false },
          removedAt: { $exists: false }
        }
      }
    }, {
      fields: { _id: 1, name: 1, users: 1 },
      sort: { name: 1 }
    });

    return userOrganizations.map((org) => {
      const orgUserDoc = _(org.users).find((userDoc) => {
        return userDoc.userId === this.userId();
      });

      return {
        orgId: org._id,
        orgName: org.name,
        sendDailyRecap: orgUserDoc.sendDailyRecap
      };
    });
  },
  updateDailyRecapSetting(e) {
    const { orgId, sendDailyRecap } = Blaze.getData(e.target);

    this.modal().callMethod(updateUserSettings, {
      organizationId: orgId,
      sendDailyRecap: !sendDailyRecap
    });
  }
});
