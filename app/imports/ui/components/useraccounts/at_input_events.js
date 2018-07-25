export default {
  'focusin input': function (e, tpl) {
    this.clearStatus();
  },
  'focusout input, change select': function (e, tpl) {
    const parentData = Template.parentData();

    Meteor.setTimeout(() => {
      if (tpl.view.isDestroyed) {
        return;
      }

      if (tpl.$('input').is(':focus')) {
        return;
      }

      const fieldId = this._id;
      const rawValue = this.getValue(tpl);
      const value = this.fixValue(rawValue);
      // Possibly updates the input value
      if (value !== rawValue) {
        this.setValue(tpl, value);
      }

      // Client-side only validation
      if (!this.validation) { return; }

      const state = (parentData && parentData.state) || AccountsTemplates.getState();
      // No validation during signIn
      if (state === 'signIn') { return; }
      // Special case for password confirmation
      if (value && fieldId === 'password_again') {
        if (value !== $('#at-field-password').val()) { return this.setError(AccountsTemplates.texts.errors.pwdMismatch); }
      }
      this.validate(value);
    }, 200);
  },
  'keyup input': function (e, tpl) {
    e.preventDefault();

    const parentData = Template.parentData();

    if (e.keyCode === 13) {
      $('#at-pwd-form').trigger('submit');
    }

    Meteor.setTimeout(() => {
      if (tpl.view.isDestroyed) {
        return;
      }

      if (tpl.$('input').is(':focus')) {
        return;
      }

      // Client-side only continuous validation
      if (!this.continuousValidation) { return; }

      const state = (parentData && parentData.state) || AccountsTemplates.getState();
      // No validation during signIn
      if (state === 'signIn') { return; }
      const fieldId = this._id;
      const rawValue = this.getValue(tpl);
      const value = this.fixValue(rawValue);
      // Possibly updates the input value
      if (value !== rawValue) {
        this.setValue(tpl, value);
      }
      // Special case for password confirmation
      if (value && fieldId === 'password_again') {
        if (value !== $('#at-field-password').val()) { return this.setError(AccountsTemplates.texts.errors.pwdMismatch); }
      }
      this.validate(value);
    }, 200);
  },
  'click .clear-field': function (e, tpl) {
    e.preventDefault();
    tpl.$('input').focus().val('');
  },
};
