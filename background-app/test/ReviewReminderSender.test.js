import assert from 'assert';
import moment from 'moment-timezone';
import { Organizations } from '../imports/share/collections/organizations';
import { getTimezones } from '../imports/startup/cron/helpers';
import ReviewReminderSender from '../imports/reminders/review/ReviewReminderSender';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';

describe('Review Reminder ', function () {
  const organization1 = Organizations.findOne({ _id: 'KwKXz5RefrE5hjWJ2' });
  const organization2 = Organizations.findOne({ _id: '8bcNPN8sKTtJFw4uy' });
  const annualDate = new Date('04-04-2017');

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
  it('it should find time zones at 05:00', function () {
    const todayDate = new Date('04-05-2017 05:00');
    const timezones = getTimezones('05:00', todayDate);
    assert.notEqual(timezones.length, 0);
  });

  it('it should not find time zones at 05:01', function () {
    const todayDate = new Date('04-05-2017 05:01');
    const timezones = getTimezones('05:00', todayDate);
    assert.equal(timezones.length, 0);
  });

  it('it should find time zones from current date', function () {
    const todayDate = new Date('04-05-2017 05:01');
    const todayMoment = moment(todayDate);
    const timezones = getTimezones(todayMoment.format('hh:mm'), todayDate);
    assert.notEqual(timezones.length, 0);
  });

  it('it should find organization with time zone', function () {
    const todayDate = new Date('04-05-2017 05:00');
    const timezones = getTimezones(moment(todayDate).format('hh:mm'), todayDate);
    const query = { timezone: { $in: timezones } };
    const organizationCount = Organizations.find(query).count();
    assert.notEqual(organizationCount, 0);
  });

  it(`it should date pass for [${organization1.name}] on [04-05-2017]`, function () {
    const organization = organization1;
    const todayDate = new Date('04-05-2017');

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const result = new ReviewReminderSender(organization, todayDate).
      _isDateScheduled(organization.review.standards);

    assert.equal(result, true);
  });

  it(`it should find Risks or Standards with status [AwaitingReview] for [${organization1.name}]`, function () {
    const organization = organization1;
    const todayDate = new Date('04-05-2017');

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const itHasRisks = new ReviewReminderSender(organization, todayDate).
        _isHasStatusAwaitingReview(Risks, organization.review.risks);
    const itHasStandards = new ReviewReminderSender(organization, todayDate).
    _isHasStatusAwaitingReview(Standards, organization.review.standards,);

    assert.equal(itHasRisks || itHasStandards, true);
  });

  it(`it should send Notification for [${organization1.name}] on [04-05-2017]`, function () {
    const organization = organization1;
    const todayDate = new Date('04-05-2017');

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const isSend = new ReviewReminderSender(organization, todayDate).send();

    assert.equal(isSend, true);
  });

  it(`it should date pass for [${organization2.name}] on [04-05-2017]`, function () {
    const organization = organization2;
    const todayDate = new Date('04-05-2017');

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const result = new ReviewReminderSender(organization, todayDate).
    _isDateScheduled(organization.review.standards);

    assert.equal(result, true);
  });

  it(`it should find Risks or Standards with status [AwaitingReview] for [${organization2.name}]`, function () {
    const organization = organization2;
    const todayDate = new Date('04-05-2017');

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const itHasRisks = new ReviewReminderSender(organization, todayDate).
    _isHasStatusAwaitingReview(Risks, organization.review.risks);
    const itHasStandards = new ReviewReminderSender(organization, todayDate).
    _isHasStatusAwaitingReview(Standards, organization.review.standards,);

    assert.equal(itHasRisks || itHasStandards, true);
  });

  it(`it should send Notification for [${organization2.name}] on [04-05-2017]`, function () {
    const organization = organization2;
    const todayDate = new Date('04-05-2017');

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const isSend = new ReviewReminderSender(organization, todayDate).send();

    assert.equal(isSend, true);
  });

})