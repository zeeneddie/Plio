import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.body.viewmodel({
  share: ['uploader'],
  mixin: ['organization', 'notifications'],
  lastMessage: new Mongo.Collection('lastOrganizationMessage'),
  onCreated(template) {
    template.autorun(() => {
      const currentUser = Meteor.user();
      if (currentUser && currentUser.areNotificationsEnabled() && this.organizationId()) {
        template.subscribe('organizationMessagesLast', this.organizationId());
      }
    });
  },
  notifyOnIncomeMessages() {
    const key = Random.id();
    const getItem = () => localStorage.getItem('tabKey');
    const setItem = value => localStorage.setItem('tabKey', value);
    const removeItem = () => localStorage.removeItem('tabKey');
    const compare = value => Object.is(getItem(), value);

    // set unique key for each tab to send notifications only to the first tab
    if (!getItem()) setItem(key);

    window.addEventListener('unload', () => compare(key) && removeItem());

    window.addEventListener('storage', (e) => {
      if (Object.is(e.key, 'tabKey') && !getItem()) {
        setItem(key);
      }
    });

    this.lastMessage().find().observe({
      changed: (newDoc) => {
        if (compare(key) && !Object.is(FlowRouter.getRouteName(), 'standardDiscussion')) {
          const {
            _id,
            createdBy,
            userFullNameOrEmail: title,
            text: body,
            userAvatar: icon,
            route = {},
          } = newDoc;

          if (createdBy === Meteor.userId()) return;

          this.sendNotification({
            _id,
            title,
            body,
            icon,
            url: FlowRouter.url(route.name, route.params, route.query),
          });
        }
      },
    });
  },
  onRendered() {
    window.onbeforeunload = () => {
      if (this.uploads() && this.uploads().length) {
        window.toastr.warning('File uploading is in progress');
        return true;
      }

      return undefined;
    };

    this.notifyOnIncomeMessages();
  },
});
