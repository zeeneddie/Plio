import { SubsManager } from 'meteor/meteorhacks:subs-manager';

const OrgSubs = new SubsManager();
const UserSubs = new SubsManager({

  // subscriptions will expire after 20 minutes, if they won't be subscribed again
  expireIn: 20,
});
const CountSubs = new SubsManager({
  expireIn: 20,
});
const WorkItemSubs = new SubsManager({
  expireIn: 10,
});
const DiscussionSubs = new SubsManager({
  expireIn: 10,
});
const MessageSubs = new SubsManager({
  expireIn: 10,
});
const DocumentLayoutSubs = new SubsManager({
  expireIn: 10,
});
const DocumentCardSubs = new SubsManager({
  expireIn: 10,
});
const DocumentsListSubs = new SubsManager({
  expireIn: 10,
});
const OrgSettingsDocSubs = new SubsManager({
  expireIn: 15,
});
const BackgroundSubs = new SubsManager({
  expireIn: 10,
});

const AuditLogsSubs = new SubsManager({
  expireIn: 10,
});

const LastHumanLogSubs = new SubsManager({
  expireIn: 10,
});

const LogsCountSubs = new SubsManager({
  expireIn: 10,
});

const RisksSubs = new SubsManager({
  expireIn: 10,
});

export {
  OrgSubs,
  UserSubs,
  CountSubs,
  WorkItemSubs,
  DiscussionSubs,
  MessageSubs,
  DocumentLayoutSubs,
  DocumentCardSubs,
  DocumentsListSubs,
  OrgSettingsDocSubs,
  BackgroundSubs,
  AuditLogsSubs,
  LastHumanLogSubs,
  LogsCountSubs,
  RisksSubs,
};
