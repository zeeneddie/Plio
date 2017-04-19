import assert from 'assert';
import moment from 'moment-timezone';
import { Organizations } from '../imports/share/collections/organizations';
import { getTimezones } from '../imports/startup/cron/helpers';
import ReviewReminderSender from '../imports/reminders/review/ReviewReminderSender';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';

describe('Review Reminder ', function () {
  const organization1 = Organizations.findOne({ _id: '8bcNPN8sKTtJFw4uy' });
  const organization2 = Organizations.findOne({ _id: 'KwKXz5RefrE5hjWJ2' });
  const annualDate = new Date('04-15-2017');
  const todayDate = new Date('04-17-2017 05:00');
  /**
   * Show when need send Review Reminder notification
   * deadline = annualDate + frequency;
      annualDate     deadline - start       deadline     deadline + until
   <--------*------------------*------------------*--------------*------->
   ____________________________++++++$++++++++$+++++++++$+++++++++________
                                interval  interval   interval
   todayDay ->0000000000000000000000010000000010000000001000000000000000000
                                    pass     pas       pass
  **/

  const frequency = {
    timeValue: 3, // todayDate + timeValue = deadline;
    timeUnit: 'days'
  };
  const reminders = {
    start: {
      timeValue: 1, // deadline - timeValue = passDate
      timeUnit: 'days'
    },
    interval: {
      timeValue: 1, // - every day
      timeUnit: 'days'
    },
    until: {
      timeValue: 1, // deadline + timeValue = passDate
      timeUnit: 'days'
    }
  };

  it(`it should find time zones [Europe/London] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const todayMoment = moment(todayDate);
    const timezones = getTimezones(todayMoment.format('hh:mm'), todayDate);
    assert.notEqual(timezones.includes('Europe/London'), false);
  });

  it(`it should find organization with time zone  on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const timezones = getTimezones(moment(todayDate).format('hh:mm'), todayDate);
    const query = { timezone: { $in: timezones } };

    const organizationCount = Organizations.find(query).count();
    assert.notEqual(organizationCount, 0);
  });

  it(`it should date pass for [${organization1.name}] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const organization = organization1;

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const result = new ReviewReminderSender(organization, todayDate).
      _isDateScheduled(organization.review.standards);

    assert.equal(result, true);
  });

  it(`it should find Risks or Standards with status [AwaitingReview] for [${organization1.name}] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const organization = organization1;

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    // const itHasRisks = new ReviewReminderSender(organization, todayDate).
    //     _isHasStatusAwaitingReview(Risks, organization.review.risks);
    const itHasStandards = new ReviewReminderSender(organization, todayDate).
    _isHasStatusAwaitingReview(Standards, organization.review.standards,);

    assert.equal(itHasStandards, true);
  });

  it(`it should send Notification for [${organization1.name}] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const organization = organization1;

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const isSend = new ReviewReminderSender(organization, todayDate).send();

    assert.equal(isSend, true);
  });

  it(`it should date pass for [${organization2.name}] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const organization = organization2;

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const result = new ReviewReminderSender(organization, todayDate).
    _isDateScheduled(organization.review.standards);

    assert.equal(result, true);
  });


  it(`it should find Risks or Standards with status [AwaitingReview] for [${organization2.name}] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const organization = organization2;

    organization.review.standards.annualDate  = annualDate;
    organization.review.standards.frequency  = frequency;
    organization.review.standards.reminders  = reminders;

    const itHasRisks = new ReviewReminderSender(organization, todayDate).
    _isHasStatusAwaitingReview(Risks, organization.review.risks);
    const itHasStandards = new ReviewReminderSender(organization, todayDate).
    _isHasStatusAwaitingReview(Standards, organization.review.standards,);

    assert.equal(itHasRisks || itHasStandards, true);
  });


  it(`it should send Notification for [${organization2.name}] on [${moment(todayDate).format('MM-DD-YYYY')}]`, function () {
    const organization = organization2;

    organization.review.risks.annualDate  = annualDate;
    organization.review.risks.frequency  = frequency;
    organization.review.risks.reminders  = reminders;

    const isSend = new ReviewReminderSender(organization, todayDate).send();

    assert.equal(isSend, true);
  });

});