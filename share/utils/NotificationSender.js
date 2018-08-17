import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';

import { Notifications } from '../collections/notifications';

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
   * @param {object} [config.notificationData] Notification configuration
   & (Check out Notification API)
   * @param {string} [config.options] Additional options
   * @param {boolean} [config.options.isImportant] Whether or not
   * recipient's email notification preference should be ignored
   * @constructor
   */
  constructor({
    recipients,
    emailSubject,
    templateData,
    templateName,
    notificationData,
    options = {},
  }) {
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
  async _renderTemplateWithData() {
    const { default: HandlebarsCache } = await import('./handlebars-cache');
    const { templateData, templateName } = this._options;
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
    // check if recipient has email notifications enabled or the notification is important
    const shouldSend = user => user && (
      this._options.isImportant ||
      user.preferences && user.preferences.areEmailNotificationsEnabled
    );

    if (userId && userId.indexOf('@') > -1) {
      const query = { 'emails.address': userId };
      const user = Meteor.users.findOne(query);

      return shouldSend(user) ? userId : false;
    }

    const user = Meteor.users.findOne({ _id: userId });
    const email = (
      user &&
      user.emails &&
      user.emails[0] &&
      user.emails[0].address
    );

    return shouldSend(user) && email || false;
  }

  /**
   * Returns default Plio email
   * @returns {String}
   * @private
   */
  _getDefaultEmail() {
    const orgName = this._options.templateData.organizationName;

    if (orgName) return `"Plio (${orgName})"<noreply@pliohub.com>`;

    return 'Plio <noreply@pliohub.com>';
  }

  /**
   * Returns an array of emails of interested users
   * @param recipients
   * @returns {[String]}
   * @private
   */
  _getUserEmails(userIds) {
    const userEmails = userIds.reduce((prev, userId) => {
      const email = this._getUserEmail(userId);
      return email ? prev.concat(email) : prev;
    }, []);
    return userEmails;
  }

  _sendEmailBasic({ recipients, html, isReportEnabled = false }) {
    const emails = this._getUserEmails(recipients);

    if (!emails.length) return;

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
  async sendEmail({ isReportEnabled } = {}) {
    const recipients = this._options.recipients || [];
    const { templateName } = this._options;
    const html = await this._renderTemplateWithData(templateName);

    this._sendEmailBasic({ recipients, html, isReportEnabled });

    // enables method chaining
    return this;
  }

  _sendOnSiteBasic(recipients) {
    const { notificationData } = this._options;

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
