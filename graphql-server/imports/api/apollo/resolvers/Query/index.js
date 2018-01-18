import User from './User';

export default {
  ...User,
  // TEMP
  organizations: (r, a, { collections: { Organizations } }) => Organizations.find().fetch(),
  actions: (r, a, { collections: { Actions } }) => Actions.find().fetch(),
  risks: (r, a, { collections: { Risks } }) => Risks.find().fetch(),
};
