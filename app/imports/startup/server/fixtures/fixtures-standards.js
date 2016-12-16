import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Organizations } from '/imports/share/collections/organizations';
import { Standards } from '/imports/share/collections/standards';

const createFixture = (i, { organizationId, sectionId, typeId }) => ({
  organizationId,
  sectionId,
  typeId,
  _id: Random.id(),
  title: `ISO framework - introduction ${i + 1}`,
  isDeleted: false,
  owner: 'SQHmBKJ94gJvpLKLt',
  issueNumber: 1,
  status: 'issued',
  nestingLevel: 1,
  viewedBy: ['SQHmBKJ94gJvpLKLt', 'ABKpuGYiJHKhDwLDk'],
  notify: [
    'SQHmBKJ94gJvpLKLt',
  ],
  departmentsIds: [],
  improvementPlan: {
    reviewDates: [],
    fileIds: [],
  },
  createdAt: new Date(),
  createdBy: 'SQHmBKJ94gJvpLKLt',
});

const createFixtures = () => {
  let organizationId = 'KwKXz5RefrE5hjWJ2';
  let sectionId = 'sktksJAYjHYJmNYaM';
  let typeId = 'yPWb8k8fZ3RBx6SZE';

  if (process.env.NODE_ENV === 'production') {
    organizationId = 'bXJ3Qy2jA5izFk63F';
    sectionId = 's6FYBAguyZqRkpav2';
    typeId = '3x5MBqWGufQRahjk6';
  }

  if (Organizations.findOne({ _id: organizationId }) &&
      Standards.find({ organizationId }).count() < 100) {
    for (let i = 0; i <= 250; i++) {
      Standards.insert(createFixture(i, { organizationId, sectionId, typeId }));
    }
  }
};

Meteor.startup(createFixtures);
