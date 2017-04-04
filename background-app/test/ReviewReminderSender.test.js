import assert from 'assert';
import { Organizations } from '../imports/share/collections/organizations';
import { getTimezones } from '../imports/startup/cron/helpers';
import ReviewReminderSender from '../imports/reminders/review/ReviewReminderSender';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';

describe('Review Reminder ', function () {
  const REMINDERS_SENDING_TIME = '05:00';
  const organization1 = Organizations.findOne({ _id: 'KwKXz5RefrE5hjWJ2' });
  const annualDate = new Date(`04-10-2017 ${REMINDERS_SENDING_TIME}`);

  const frequency = {
    timeValue: 3,
    timeUnit: 'days'
  };
  const reminders = {
    start: {
      timeValue: 2,
      timeUnit: 'days'
    },
    interval: {
      timeValue: 1,
      timeUnit: 'days'
    },
    until: {
      timeValue: 3,
      timeUnit: 'days'
    }
  };

  it('it should find organization with time zome', function () {
    const todayDate = new Date(`04-11-2017 ${REMINDERS_SENDING_TIME}`);
    const timezones = getTimezones(REMINDERS_SENDING_TIME, todayDate);
    const query = { timezone: { $in: timezones } };
    const organizationCount = Organizations.find(query).count();
    console.log('organizationCount ->', organizationCount)
    assert.notEqual(organizationCount, 0);
  });

  it(`it should date pass for [${organization1.name}] on [04-11-2017]`, function () {
    const organization = organization1;
    const todayDate = new Date(`04-11-2017 ${REMINDERS_SENDING_TIME}`);

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const result = new ReviewReminderSender(organization, todayDate).
      _isDateScheduled(organization.review.risks);

    assert.equal(result, true);
  });

  it(`it should find Risks with status [AwaitingReview] for [${organization1.name}]`, function () {
    const organization = organization1;
    const todayDate = new Date(`04-11-2017 ${REMINDERS_SENDING_TIME}`);

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const itHasRisks = new ReviewReminderSender(organization, todayDate).
        _isHasStatusAwaitingReview(Risks, organization.review.risks);

    assert.equal(itHasRisks, true);
  });

  it(`it should find Standards with status [AwaitingReview] for [${organization1.name}]`, function () {
    const organization = organization1;
    const todayDate = new Date(`04-11-2017 ${REMINDERS_SENDING_TIME}`);

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const itHasStandards = new ReviewReminderSender(organization, todayDate).
        _isHasStatusAwaitingReview(Standards, organization.review.standards,);

    assert.equal(itHasStandards, true);
  });

  it(`it should not date pass for  [${organization1.name}] on [04-09-2017]`, function () {
    const organization = organization1;
    const todayDate = new Date(`04-09-2017 ${REMINDERS_SENDING_TIME}`);

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const result = new ReviewReminderSender(organization, todayDate).
    _isDateScheduled(organization.review.risks);

    assert.equal(result, false);
  })
})