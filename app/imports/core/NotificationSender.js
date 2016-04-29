import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';

import HandlebarsCompiledCache from './HandlebarsCompiledCache';


const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;
const handlebarsCache = Meteor.isServer ? new HandlebarsCompiledCache({
  applicationInvitationEmail: getAssetPath('email', 'application-invitation'),
  invitedToOrganizationEmail: getAssetPath('email', 'invited-to-organization')
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
   * @param {string} [options.senderId] user that sanded notification
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

  _getEmailSubject() {
    return `[Plio] | ${this._options.subject}`;
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

    let user = Meteor.users.findOne(userId);
    return user && user.emails && user.emails.length ? user.emails[0].address : false;
  }

  _sendEmailBasic(receiver, text) {
    let emailOptions = {
      subject: this._getEmailSubject(),
      from: this._getUserEmail(this._options.senderId) || 'no-reply@pliohub.com',
      to: this._getUserEmail(receiver),
      html: text
    };

    Email.send(emailOptions);
  }

  /**
   * Sends email to specified receiver
   *
   * @param receiver user ID or email
   */
  sendEmail(receiver) {
    let html = this._renderTemplateWithData();
    this._sendEmailBasic(receiver, html);
  }

  static getAbsoluteUrl(path) {
    return `${process.env.ROOT_URL}${path}`;
  }
}