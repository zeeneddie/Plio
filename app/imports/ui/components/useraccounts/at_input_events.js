export default {
  'focusin input'(e, tpl) {
    this.clearStatus();
  },
  'focusout input, change select'(e, tpl) {
    var parentData = Template.parentData();

    Meteor.setTimeout(() => {
      if (tpl.view.isDestroyed) {
        return;
      }

      if (tpl.$('input').is(':focus')) {
        return;
      }

      var fieldId = this._id;
      var rawValue = this.getValue(tpl);
      var value = this.fixValue(rawValue);
      // Possibly updates the input value
      if (value !== rawValue) {
        this.setValue(tpl, value);
      }

      // Client-side only validation
      if (!this.validation)
        return;

      var state = (parentData && parentData.state) || AccountsTemplates.getState();
      // No validation during signIn
      if (state === "signIn")
        return;
      // Special case for password confirmation
      if (value && fieldId === "password_again"){
        if (value !== $("#at-field-password").val())
          return this.setError(AccountsTemplates.texts.errors.pwdMismatch);
      }
      this.validate(value);
    }, 200);
  },
  'keyup input'(e, tpl) {
    var parentData = Template.parentData();

    if (e.keyCode === 13) {
      $("#at-pwd-form").trigger("submit");
    }

    Meteor.setTimeout(() => {
      if (tpl.view.isDestroyed) {
        return;
      }

      if (tpl.$('input').is(':focus')) {
        return;
      }

      // Client-side only continuous validation
      if (!this.continuousValidation)
        return;

      var state = (parentData && parentData.state) || AccountsTemplates.getState();
      // No validation during signIn
      if (state === "signIn")
        return;
      var fieldId = this._id;
      var rawValue = this.getValue(tpl);
      var value = this.fixValue(rawValue);
      // Possibly updates the input value
      if (value !== rawValue) {
        this.setValue(tpl, value);
      }
      // Special case for password confirmation
      if (value && fieldId === "password_again"){
        if (value !== $("#at-field-password").val())
          return this.setError(AccountsTemplates.texts.errors.pwdMismatch);
      }
      this.validate(value);
    }, 200);
  },
  'click .clear-field'(e, tpl) {
    e.preventDefault();
    tpl.$('input').focus().val('');
  }
};
