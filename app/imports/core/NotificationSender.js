import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';
import NotificationsService from '/imports/api/notifications/notifications-service.js'

import HandlebarsCompiledCache from './HandlebarsCompiledCache';


const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;
const handlebarsCache = Meteor.isServer ? new HandlebarsCompiledCache({
  minimalisticEmail: getAssetPath('email', 'minimalistic-email'),
  personalEmail: getAssetPath('email', 'personal-email')
}) : false;


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
   * @param {string} subject notification's subject/title
   * @param {object} [templateData] data to render on template
   * @param {object} [options] additional configuration
   * @param {string} [options.senderId] user that sent notification
   * @param {object} [options.helpers] define you own formatting helpers
   * in others too
   * @constructor
   */
  constructor({ recipients, emailSubject, templateData, templateName, notificationData, options = {}}) {
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
      notificationData
    });
  }

  /**
   * Render Handlebars template
   * @returns {String}
   * @private
   */
  _renderTemplateWithData() {
    let templateData = this._options.templateData;
    let templateName = this._options.templateName;
    return handlebarsCache.render(templateName, templateData, this._options.helpers);
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
    } else {
      let user = Meteor.users.findOne(userId);
      return user && user.emails && user.emails.length ? user.emails[0].address : false;
    }
  }

  /**
   * Returns an array of emails of interested users
   * @param recipients
   * @returns {[String]}
   * @private
   */
  _getUserEmails(userIds) {
    let userEmails = [];
    userIds.forEach((userId) => {
      let email = this._getUserEmail(userId);
      email && userEmails.push(email);
    });
    return userEmails;
  }

  _sendEmailBasic(recipients, text) {
    let emailOptions = {
      subject: this._getEmailSubject(),
      from: this._getUserEmail(this._options.senderId) || `Plio (${this._options.templateData.organizationName})<noreply@pliohub.com>`,
      to: this._getUserEmails(recipients),
      html: text
    };

    Email.send(emailOptions);
  }

  /**
   * Sends email to specified recipients
   *
   * @param recipients user ID or email. May be an array of ids and/or emails
   */
  sendEmail() {
    const recipients = this._options.recipients || [];
    const templateName = this._options.templateName;
    let html = this._renderTemplateWithData(templateName);

    this._sendEmailBasic(recipients, html);

    return this;
  }

  _sendOnSiteBasic(recipients) {
    const notificationData = this._options.notificationData;
    if (!notificationData) {
      return;
    }

    notificationData.recipientIds = recipients;
    NotificationsService.insert(notificationData);
  }

  sendOnSite() {
    const recipients = this._options.recipients || [];

    this._sendOnSiteBasic(recipients);

    return this;
  }

  sendAll() {
    this.sendEmail();
    this.sendOnSite();
  }

  static getAbsoluteUrl(path) {
    return `${process.env.ROOT_URL}${path}`;
  }
}

Meteor.NotificationSender = NotificationSender;
