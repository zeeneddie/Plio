/**
 * Universal notification sender
 *
 * Supports emails and build-in notifications
 * If you need send notification you probably should use it
 *
 * Possible notification data entries formats: String, Number.
 *
 * Note: If your notification data contains dates you should
 * format it in appropriate location's timezone.
 *
 * Also you can use `_notificationId` in your template to
 * link notification's metadata with notification itself.
 * This feature may be used in server side routes for
 * processing any notification's actions.
 * Use `{{_notificationId}}` - in templates and `this._notificationId` - in helpers
 *
 * Template data helpers
 * You can also define you own helpers
 * Note: notification helpers act as simple handlebars helpers.
 * `_notificationId` will be also included in root context.
 *
 * Usage examples:
 * ```
 *  new NotificationSender('Test1', 'test', {username: 'User'})
 *  .sendEmail('kfZMbk62tgFSxmDen');
 *
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
class NotificationSender {
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

    let templateName = type && Handlebars.templates[`${basicTemplateName}-${type}`] &&
      `${basicTemplateName}-${type}` || basicTemplateName;

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
   * @param receiver - user ID or email
   */
  sendEmail(receiver) {
    let html = this._renderTemplateWithData('email');
    this._sendEmailBasic(receiver, html);
  }
}