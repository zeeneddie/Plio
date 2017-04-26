/* eslint-disable new-cap */

import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';
import get from 'lodash.get';

import { Organizations } from '/imports/share/collections/organizations';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';
import ReviewWorkflow from '/imports/share/utils/ReviewWorkflow';
import { reviewConfigSchema } from '/imports/share/schemas/organization-schema';
import { DocumentTypes, SystemName, DefaultDateFormat } from '/imports/share/constants';
import { capitalize, getDocTypePlural } from '/imports/share/helpers';
import { getCollectionUrlByDocType } from '../../helpers/url';
import { isDateScheduled, getPrettyTzDate } from '../../helpers/date';
import NotificationSender from '/imports/share/utils/NotificationSender';

const REMINDER_EMAIL_TEMPLATE = 'defaultEmail';

export default class ReviewReminderSender {
  constructor(organization, date = new Date()) {
    this._organization = organization;
    this._timezone = organization.timezone || 'UTC';
    this._date = moment(date).tz(this._timezone).startOf('day').toDate();
    this._reminders = [];
  }

  send() {

    const { review } = this._organization;

    this._checkReviewConfiguration(review);

    this._createReviewReminder(Risks, review.risks, DocumentTypes.RISK);
    this._createReviewReminder(Standards, review.standards, DocumentTypes.STANDARD);

    return this._sendReminders();
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

  _isDateScheduled(reviewConfig) {
    return isDateScheduled(
      reviewConfig.reminders,
      reviewConfig.annualDate,
      this._timezone,
      this._date,
    );
  }
  _isHasStatusAwaitingReview(collection, reviewConfig) {
    const isStatusAwaitingReview = (doc) => {
      const workflow = new ReviewWorkflow(doc, reviewConfig, this._timezone);
      return workflow && workflow.getStatus && workflow.getStatus() === 1;
    };

    const query = {
      organizationId: this._organization._id,
      isDeleted: false,
      deletedAt: { $exists: false },
      deletedBy: { $exists: false },
    };
    const options = { fields: { _id: 1, createdAt: 1 } };
    const docs = collection.find(query, options).fetch();
    return docs.some(isStatusAwaitingReview);
  }

  _shouldSendReminder(collection, reviewConfig) {
    if (!this._isDateScheduled(reviewConfig)) {
      return false;
    }

    return this._isHasStatusAwaitingReview(collection, reviewConfig);
  }

  _getReminderEmailData({ collection, reviewConfig, docType }) {
    const receivers = this._getReceivers({ collection, reviewConfig, docType });

    if (!receivers.length) return false;

    const prettyAnnualDate = moment(reviewConfig.annualDate).format(DefaultDateFormat);
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
    const reminderEmailDataList = this._reminders
      .map(reminder => this._getReminderEmailData(reminder)).
      filter(n => !!n);

    reminderEmailDataList.forEach(reminderEmailData =>
      new NotificationSender({
        templateName: REMINDER_EMAIL_TEMPLATE,
        ...reminderEmailData,
      }).sendEmail());

    return !!reminderEmailDataList.length;
  }
}
