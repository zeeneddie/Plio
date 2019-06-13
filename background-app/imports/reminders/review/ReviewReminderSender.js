/* eslint-disable new-cap */

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';
import get from 'lodash.get';

import { Organizations } from '/imports/share/collections/organizations';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';
import ReviewWorkflow from '/imports/share/utils/ReviewWorkflow';
import { reviewConfigSchema } from '/imports/share/schemas/organization-schema';
import { DocumentTypes, SystemName } from '/imports/share/constants';
import NotificationSender from '/imports/share/utils/NotificationSender';
import { capitalize, getDocTypePlural } from '/imports/share/helpers';
import { getCollectionUrlByDocType } from '../../helpers/url';
import { getPrettyTzDate } from '../../helpers/date';
import { DEFAULT_EMAIL_TEMPLATE } from '../../constants';

const REMINDER_EMAIL_TEMPLATE = DEFAULT_EMAIL_TEMPLATE;

export default class ReviewReminderSender {
  constructor(organizationId) {
    this._organizationId = organizationId;
  }

  _prepare() {
    const query = { _id: this._organizationId };
    const organization = Organizations.findOne(query);
    if (!organization) {
      throw new Error('Organization does not exist');
    }

    this._organization = organization;
    this._timezone = organization.timezone || 'UTC';

    this._date = moment()
      .tz(this._timezone)
      .startOf('day')
      .toDate();

    this._reminders = [];
  }

  send() {
    this._prepare();

    const { review } = this._organization;

    this._checkReviewConfiguration(review);

    this._createReviewReminder(Risks, review.risks, DocumentTypes.RISK);
    this._createReviewReminder(Standards, review.standards, DocumentTypes.STANDARD);

    this._sendReminders();
  }

  _checkReviewConfiguration(reviewConfig) {
    const schema = new SimpleSchema({
      standards: { type: reviewConfigSchema },
      risks: { type: reviewConfigSchema },
    });

    try {
      schema.validate(reviewConfig);
    } catch (err) {
      throw new Error(`Review config is not valid: ${err}`);
    }
  }

  _createReviewReminder(collection, reviewConfig, docType) {
    if (this._shouldSendReminder(collection, reviewConfig)) {
      this._reminders.push({ collection, reviewConfig, docType });
    }
  }

  _shouldSendReminder(collection, reviewConfig) {
    const isStatusAwaitingReview = (doc) => {
      const workflow = new ReviewWorkflow(doc, reviewConfig, this._timezone);

      return workflow && workflow.getStatus && workflow.getStatus() === 1;
    };

    const query = {
      organizationId: this._organizationId,
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
    };
    const options = { fields: { _id: 1, createdAt: 1 } };
    const docs = collection.find(query, options).fetch();
    const result = docs.some(isStatusAwaitingReview);

    return result;
  }

  _getReminderEmailData({ collection, reviewConfig, docType }) {
    const receivers = this._getReceivers({ collection, reviewConfig, docType });

    if (!receivers.length) return false;

    const prettyAnnualDate = getPrettyTzDate(reviewConfig.annualDate, this._timezone, 'MMMM DD');
    const title = `${getDocTypePlural(docType)}`;
    const emailSubject = `The ${title} documents need a review`;
    const emailText = `
      The ${title} documents for "${this._organization.name}"
      are scheduled for review on ${prettyAnnualDate}.
      Please go to the ${capitalize(title)} screen to review them.
    `;
    const { serialNumber } = this._organization;

    const buttonLabel = `Go to ${title}`;
    const buttonUrl = getCollectionUrlByDocType(docType, serialNumber);

    const templateData = {
      organizationName: this._organization.name,
      title: emailSubject,
      text: emailText,
      button: {
        label: buttonLabel,
        url: buttonUrl,
      },
    };

    return {
      emailSubject,
      templateData,
      recipients: receivers,
    };
  }

  _getReceivers({ docType }) {
    const docTypePlural = getDocTypePlural(docType);
    const reviewerId = get(this._organization, `review.${docTypePlural}.reviewerId`);

    if (reviewerId && reviewerId !== SystemName) return [reviewerId];

    const ownerId = typeof this._organization.ownerId === 'function' &&
      this._organization.ownerId();

    return ownerId ? [ownerId] : [];
  }

  _sendReminders() {
    this._reminders.forEach((reminder) => {
      const reminderEmailData = this._getReminderEmailData(reminder);

      if (!reminderEmailData) return;

      new NotificationSender({
        templateName: REMINDER_EMAIL_TEMPLATE,
        ...reminderEmailData,
      }).sendEmail();
    });
  }
}
