import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';

import { Notifications } from '../collections/notifications.js';
import HandlebarsCache from './handlebars-cache.js';


/**
 * Universal notification sender
 *
 * Possible notification data entries formats: String, Number.
 *
 * Usage example:
 *
 * ```
 * new NotificationSender({
 *  recipients: userId,
 *  emailSubject,
 *  templateName: 'minimalisticEmail',
 *  templateData
 * }).sendBoth('kfZMbk62tgFSxmDen');
 *
 * ```
 */
export default class NotificationSender {
  /**
   * @param {object} [config] Notification configuration
   * @param {array | string} [config.recipients] An array of emails and/or _ids or email/_id string
   * @param {string} [config.emailSubject] Subject of the email
   * @param {object} [config.templateData] Template data scope
   * @param {string} [config.templateName] Name of template
   * @param {object} [config.notificationData] Notification configuration (Check out Notification API)
   * @param {string} [config.options] Additional options
   * @constructor
   */
  constructor({ recipients, emailSubject, templateData, templateName, notificationData, options = {} }) {
    if (Meteor.isClient) {
      throw new Meteor.Error(500, 'You cannot send notifications from client side');
    }

    if (typeof recipients === 'string') {
      recipients = [recipients];
    }

    this._options = _.extend(options, {
      recipients,
      emailSubject,
      templateData,
      templateName,
      notificationData,
    });
  }

  /**
   * Render Handlebars template
   * @returns {String}
   * @private
   */
  _renderTemplateWithData() {
    const templateData = this._options.templateData;
    const templateName = this._options.templateName;
    return HandlebarsCache.render(templateName, templateData, this._options.helpers);
  }

  _getEmailSubject() {
    return this._options.emailSubject;
  }

  /**
   * Returns an email of interested user
   * @param userId
   * @returns {String | boolean}
   * @private
   */
  _getUserEmail(userId) {
    if (userId && userId.indexOf('@') > -1) {
      return userId;
    }

    const user = Meteor.users.findOne(userId);
    return user && user.emails && user.emails.length ? user.emails[0].address : false;
  }

  /**
   * Returns default Plio email
   * @returns {String}
   * @private
   */
  _getDefaultEmail() {
    const orgName = this._options.templateData.organizationName;

    if (orgName) return `Plio (${orgName})<noreply@pliohub.com>`;

    return 'Plio <noreply@pliohub.com>';
  }

  /**
   * Returns an array of emails of interested users
   * @param recipients
   * @returns {[String]}
   * @private
   */
  _getUserEmails(userIds) {
    const userEmails = [];
    userIds.forEach((userId) => {
      const email = this._getUserEmail(userId);
      email && userEmails.push(email);
    });
    return userEmails;
  }

  _sendEmailBasic({ recipients, html, isReportEnabled = false }) {
    const emails = this._getUserEmails(recipients);
    const bcc = [];
    if (isReportEnabled) {
      // Reporting of beta user activity
      bcc.push('steve.ives@pliohub.com', 'jamesalexanderives@gmail.com');
    }

    const emailOptions = {
      subject: this._getEmailSubject(),
      from: this._getUserEmail(this._options.senderId) || this._getDefaultEmail(),
      to: emails,
      bcc,
      html,
      // text: htmlToPlainText(html),
    };

    Email.send(emailOptions);
  }

  /**
   * Sends email to specified recipients
   */
  sendEmail({ isReportEnabled } = {}) {
    const recipients = this._options.recipients || [];
    const templateName = this._options.templateName;
    const html = this._renderTemplateWithData(templateName);

    this._sendEmailBasic({ recipients, html, isReportEnabled });

    // enables method chaining
    return this;
  }

  _sendOnSiteBasic(recipients) {
    const notificationData = this._options.notificationData;
    if (!notificationData) {
      return;
    }

    notificationData.recipientIds = recipients;
    Notifications.insert(notificationData);
  }

  /**
   * Sends browser notification to specified recipients
   */
  sendOnSite() {
    const recipients = this._options.recipients || [];

    this._sendOnSiteBasic(recipients);

    // enables method chaining
    return this;
  }

  sendAll() {
    this.sendEmail();
    this.sendOnSite();
    // we don't need method chaining here
  }

  static getAbsoluteUrl(path) {
    return `${process.env.ROOT_URL}${path}`;
  }
}
