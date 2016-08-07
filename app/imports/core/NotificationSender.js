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
 * new NotificationSender('Test3', 'test', {
 *     username: 'User',
 *     persons: [
 *         {name: 'John'},
 *         {name: 'James'},
 *         {name: 'Jim'}
 *     ]
 * }, {
 *     helpers: {
 *         greeting: function () {
 *             return 'Hello, ' + this.name;
 *         }
 *     }
 * }).sendBoth('kfZMbk62tgFSxmDen');
 *
 * ```
 */
export default class NotificationSender {
  /**
   * @param {string} subject notification's subject/title
   * @param {string} templateName handlebars template name
   * @param {object} [templateData] data to render on template
   * @param {object} [options] additional configuration
   * @param {string} [options.senderId] user that sent notification
   * @param {object} [options.helpers] define you own formatting helpers
   * in others too
   * @constructor
   */
  constructor(subject, templateName, templateData, options = {}) {
    if (Meteor.isClient) {
      throw new Meteor.Error(500, 'You cannot send notifications from client side');
    }

    this._options = _.extend(options, {
      subject,
      templateName,
      templateData
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

  _getSubject() {
    return this._options.subject;
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
      subject: this._getSubject(),
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
  sendEmail(recipients) {
    let html = this._renderTemplateWithData();
    if (typeof recipients === 'string') {
      recipients = [recipients];
    }
    this._sendEmailBasic(recipients, html);
  }

  _sendOnSiteBasic(recipients) {
    if (typeof recipients === 'string') {
      recipients = [recipients];
    }

    console.log('this._options', this._options);

    NotificationsService.insert({
      recipientIds: recipients,
      subject: this._getSubject(),
      body: this._options.body
    });
  }

  sendOnSite(recipients) {
    this._sendOnSiteBasic(recipients);
  }

  static getAbsoluteUrl(path) {
    return `${process.env.ROOT_URL}${path}`;
  }
}

Meteor.NotificationSender = NotificationSender;
