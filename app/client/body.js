import { Template } from 'meteor/templating';
import { terminateUploading } from '/imports/api/files/methods.js';
import NotificationSender from '/imports/core/NotificationSender';

Template.body.viewmodel({
  share: ['uploader'],
  mixin: ['organization', 'notifications'],
  lastMessage: new Mongo.Collection('lastOrganizationMessage'),

  onCreated(template) {
    template.autorun(() => {
      const currentUser = Meteor.user();
      if (currentUser && currentUser.areNotificationsEnabled()) {
        template.subscribe('organizationMessagesLast', this.organizationId());
      }
    });
  },
  notifyOnIncomeMessages() {
    const self = this;

		this.lastMessage().find().observe({
			changed(newDoc, oldDoc) {
        if (newDoc.createdBy === Meteor.userId()) {
          return;
        }

        const route = newDoc.route || {};
        self.sendNotification({
          _id: newDoc._id,
          title: newDoc.userFullNameOrEmail,
          body: newDoc.text,
          icon: newDoc.userAvatar,
          url: FlowRouter.url(route.name, route.params, route.query)
        })
			}
		});
	},
  onRendered() {
    window.onbeforeunload = () => {
      if (this.uploads() && this.uploads().length) {
        toastr.warning('File uploading is in progress');
        return true;
      }
    };

    this.notifyOnIncomeMessages();
  }
});
