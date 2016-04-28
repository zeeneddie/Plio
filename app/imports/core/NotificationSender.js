import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import './notification-templates';
import { OriginalHandlebars, Handlebars } from 'meteor/cmather:handlebars-server';

/**
 * Universal notification sender
 *
 * Right now supports only email sending
 *
 * Possible notification data entries formats: String, Number.
 *
 * Template data helpers
 * You can also define you own helpers
 * Note: notification helpers act as simple handlebars helpers.
 *
 * Usage example:
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
    this._options = _.extend(options, {
      subject,
      templateName,
      templateData
    });

    //register current notification helpers
    if (options && _.isObject(options.helpers)) {
      _.each(options.helpers, (helperFn, helperName) => {
        OriginalHandlebars.registerHelper(helperName, helperFn);
      });
    }
  }

  /**
   * Render Handlebars template
   * @param {'mobile'|'email'} [type=false]
   * @returns {String}
   * @private
   */
  _renderTemplateWithData(type) {
    let templateData = this._options.templateData;

    let basicTemplateName = this._options.templateName;

    let templateName = type && `${basicTemplateName}-${type}`;
    console.log(Handlebars.templates);
    return Handlebars.templates[templateName](templateData);
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
    let html = this._renderTemplateWithData('email');
    this._sendEmailBasic(receiver, html);
  }

  static getAbsoluteUrl(path) {
    return `${process.env.ROOT_URL}${path}`;
  }
}