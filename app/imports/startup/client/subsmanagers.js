const OrgSubs = new SubsManager();
const UserSubs = new SubsManager({

  // subscriptions will expire after 20 minutes, if they won't be subscribed again
  expireIn: 10
});
const CountSubs = new SubsManager({
  expireIn: 5
});

export { OrgSubs, UserSubs, StandardSubs, CountSubs };