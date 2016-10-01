const OrgSubs = new SubsManager();
const UserSubs = new SubsManager({

  // subscriptions will expire after 20 minutes, if they won't be subscribed again
  expireIn: 20
});
const CountSubs = new SubsManager({
  expireIn: 20
});
const WorkItemSubs = new SubsManager({
  expireIn: 10
});
const DiscussionSubs = new SubsManager({
  expireIn: 10
});
const MessageSubs = new SubsManager({
  expireIn: 10
});
const DocumentCardSubs = new SubsManager({
  expireIn: 10
});
const DocumentsListSubs = new SubsManager({
  expireIn: 10
});
const OrgSettingsDocSubs = new SubsManager({
  expireIn: 15
});

export {
  OrgSubs,
  UserSubs,
  CountSubs,
  WorkItemSubs,
  DiscussionSubs,
  MessageSubs,
  DocumentCardSubs,
  DocumentsListSubs,
  OrgSettingsDocSubs
};
