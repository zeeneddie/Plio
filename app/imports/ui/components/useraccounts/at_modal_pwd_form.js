// Simply 'inherits' helpers from AccountsTemplates
Template.atModalPwdForm.helpers(AccountsTemplates.atPwdFormHelpers);


// This function is the same as here
// https://github.com/meteor-useraccounts/flow-routing/blob/master/lib/client/client.js
// but without redirection after password change, because we don't need it in the modal window
function submitCallback(error, state, onSuccess) {
  const onSubmitHook = AccountsTemplates.options.onSubmitHook;
  if (onSubmitHook) {
    onSubmitHook(error, state);
  }

  if (error) {
    if (_.isObject(error.details)) {
      if (error.error === 'validation-error') {
        // This error is a ValidationError from the mdg:validation-error package.
        // It has a well-defined error format

        // Record errors that don't correspond to fields in the form
        const errorsWithoutField = [];

        _.each(error.details, (fieldError) => {
          const field = AccountsTemplates.getField(fieldError.name);

          if (field) {
            // XXX in the future, this should have a way to do i18n
            field.setError(fieldError.type);
          } else {
            errorsWithoutField.push(fieldError.type);
          }
        });

        if (errorsWithoutField) {
          AccountsTemplates.state.form.set('error', errorsWithoutField);
        }
      } else {
        // If error.details is an object, we may try to set fields errors from it
        _.each(error.details, (error, fieldId) => {
          AccountsTemplates.getField(fieldId).setError(error);
        });
      }
    } else {
      let err = 'error.accounts.Unknown error';
      if (error.reason) {
        err = error.reason;
      }
      if (err.substring(0, 15) !== 'error.accounts.') {
        err = `error.accounts.${err}`;
      }
      AccountsTemplates.state.form.set('error', [err]);
    }
    AccountsTemplates.setDisabled(false);
    // Possibly resets reCaptcha form
    if (state === 'signUp' && AccountsTemplates.options.showReCaptcha) {
      grecaptcha.reset();
    }
  } else {
    if (onSuccess) {
      onSuccess();
    }

    if (state) {
      AccountsTemplates.setDisabled(false);
    }
  }
}


// this event handler is the same as here
// https://github.com/meteor-useraccounts/core/blob/master/lib/templates_helpers/at_pwd_form.js
// but with our custom submitCallback function
Template.atModalPwdForm.events({
  'submit #at-pwd-form': function (event, t) {
    event.preventDefault();
    t.$('#at-btn').blur();

    AccountsTemplates.setDisabled(true);

    const parentData = Template.currentData();
    const state = (parentData && parentData.state) || AccountsTemplates.getState();
    const preValidation = (state !== 'signIn');

    // Client-side pre-validation
    // Validates fields values
    // NOTE: This is the only place where password validation can be enforced!
    const formData = {};
    let someError = false;
    const errList = [];
    _.each(AccountsTemplates.getFields(), (field) => {
      // Considers only visible fields...
      if (!_.contains(field.visible, state)) { return; }

      const fieldId = field._id;

      const rawValue = field.getValue(t);
      const value = field.fixValue(rawValue);
      // Possibly updates the input value
      if (value !== rawValue) {
        field.setValue(t, value);
      }
      if (value !== undefined && value !== '') {
        formData[fieldId] = value;
      }

      // Validates the field value only if current state is not "signIn"
      if (preValidation && field.getStatus() !== false) {
        const validationErr = field.validate(value, 'strict');
        if (validationErr) {
          if (field.negativeValidation) { field.setError(validationErr); } else {
            const fId = T9n.get(field.getDisplayName(), markIfMissing = false);
            // errList.push(fId + ": " + err);
            errList.push({
              field: field.getDisplayName(),
              err: validationErr,
            });
          }
          someError = true;
        } else { field.setSuccess(); }
      }
    });

    // Clears error and result
    AccountsTemplates.clearError();
    AccountsTemplates.clearResult();
    AccountsTemplates.clearMessage();
    // Possibly sets errors
    if (someError) {
      if (errList.length) { AccountsTemplates.state.form.set('error', errList); }
      AccountsTemplates.setDisabled(false);
      // reset reCaptcha form
      if (state === 'signUp' && AccountsTemplates.options.showReCaptcha) {
        grecaptcha.reset();
      }
      return;
    }

    // Extracts username, email, and pwds
    const current_password = formData.current_password;
    let email = formData.email;
    const password = formData.password;
    const password_again = formData.password_again;
    let username = formData.username;
    let username_and_email = formData.username_and_email;
    // Clears profile data removing username, email, and pwd
    delete formData.current_password;
    delete formData.email;
    delete formData.password;
    delete formData.password_again;
    delete formData.username;
    delete formData.username_and_email;

    if (AccountsTemplates.options.confirmPassword) {
      // Checks passwords for correct match
      if (password_again && password !== password_again) {
        const pwd_again = AccountsTemplates.getField('password_again');
        if (pwd_again.negativeValidation) { pwd_again.setError(AccountsTemplates.texts.errors.pwdMismatch); } else {
          AccountsTemplates.state.form.set('error', [{
            field: pwd_again.getDisplayName(),
            err: AccountsTemplates.texts.errors.pwdMismatch,
          }]);
        }
        AccountsTemplates.setDisabled(false);
        // reset reCaptcha form
        if (state === 'signUp' && AccountsTemplates.options.showReCaptcha) {
          grecaptcha.reset();
        }
        return;
      }
    }

    // -------
    // Sign In
    // -------
    if (state === 'signIn') {
      const pwdOk = !!password;
      let userOk = true;
      let loginSelector;
      if (email) {
        if (AccountsTemplates.options.lowercaseUsername) {
          email = toLowercaseUsername(email);
        }

        loginSelector = { email };
      } else if (username) {
        if (AccountsTemplates.options.lowercaseUsername) {
          username = toLowercaseUsername(username);
        }
        loginSelector = { username };
      } else if (username_and_email) {
        if (AccountsTemplates.options.lowercaseUsername) {
          username_and_email = toLowercaseUsername(username_and_email);
        }
        loginSelector = username_and_email;
      } else { userOk = false; }

      // Possibly exits if not both 'password' and 'username' are non-empty...
      if (!pwdOk || !userOk) {
        AccountsTemplates.state.form.set('error', [AccountsTemplates.texts.errors.loginForbidden]);
        AccountsTemplates.setDisabled(false);
        return;
      }

      return Meteor.loginWithPassword(loginSelector, password, (error) => {
        AccountsTemplates.submitCallback(error, state);
      });
    }

    // -------
    // Sign Up
    // -------
    if (state === 'signUp') {
      // Possibly gets reCaptcha response
      if (AccountsTemplates.options.showReCaptcha) {
        const response = grecaptcha.getResponse();
        if (response === '') {
          // recaptcha verification has not completed yet (or has expired)...
          // ...simply ignore submit event!
          AccountsTemplates.setDisabled(false);
          return;
        }
        formData.reCaptchaResponse = response;
      }

      const hash = Accounts._hashPassword(password);
      const options = {
        username,
        email,
        password: hash,
        profile: formData,
      };

      // Call preSignUpHook, if any...
      const preSignUpHook = AccountsTemplates.options.preSignUpHook;
      if (preSignUpHook) {
        preSignUpHook(password, options);
      }

      return Meteor.call('ATCreateUserServer', options, (error) => {
        if (error && error.reason === 'Email already exists.') {
          if (AccountsTemplates.options.showReCaptcha) {
            grecaptcha.reset();
          }
        }
        AccountsTemplates.submitCallback(error, undefined, () => {
          if (AccountsTemplates.options.sendVerificationEmail && AccountsTemplates.options.enforceEmailVerification) {
            AccountsTemplates.submitCallback(error, state, () => {
              AccountsTemplates.state.form.set('result', AccountsTemplates.texts.info.signUpVerifyEmail);
              // Cleans up input fields' content
              _.each(AccountsTemplates.getFields(), (field) => {
                // Considers only visible fields...
                if (!_.contains(field.visible, state)) { return; }

                const elem = t.$(`#at-field-${field._id}`);

                // Naïve reset
                if (field.type === 'checkbox') elem.prop('checked', false);
                else elem.val('');
              });
              AccountsTemplates.setDisabled(false);
              AccountsTemplates.avoidRedirect = true;
            });
          } else {
            let loginSelector;

            if (email) {
              if (AccountsTemplates.options.lowercaseUsername) {
                email = toLowercaseUsername(email);
              }

              loginSelector = { email };
            } else if (username) {
              if (AccountsTemplates.options.lowercaseUsername) {
                username = toLowercaseUsername(username);
              }
              loginSelector = { username };
            } else {
              if (AccountsTemplates.options.lowercaseUsername) {
                username_and_email = toLowercaseUsername(username_and_email);
              }
              loginSelector = username_and_email;
            }

            Meteor.loginWithPassword(loginSelector, password, (error) => {
              AccountsTemplates.submitCallback(error, state, () => {
                AccountsTemplates.setState('signIn');
              });
            });
          }
        });
      });
    }

    //----------------
    // Forgot Password
    //----------------
    if (state === 'forgotPwd') {
      return Accounts.forgotPassword({
        email,
      }, (error) => {
        AccountsTemplates.submitCallback(error, state, () => {
          AccountsTemplates.state.form.set('result', AccountsTemplates.texts.info.emailSent);
          t.$('#at-field-email').val('');
        });
      });
    }

    //--------------------------------
    // Reset Password / Enroll Account
    //--------------------------------
    if (state === 'resetPwd' || state === 'enrollAccount') {
      const paramToken = AccountsTemplates.getparamToken();
      return Accounts.resetPassword(paramToken, password, (error) => {
        AccountsTemplates.submitCallback(error, state, () => {
          let pwd_field_id;
          if (state === 'resetPwd') { AccountsTemplates.state.form.set('result', AccountsTemplates.texts.info.pwdReset); } else // Enroll Account
          { AccountsTemplates.state.form.set('result', AccountsTemplates.texts.info.pwdSet); }
          t.$('#at-field-password').val('');
          if (AccountsTemplates.options.confirmPassword) { t.$('#at-field-password_again').val(''); }
        });
      });
    }

    //----------------
    // Change Password
    //----------------
    if (state === 'changePwd') {
      return Accounts.changePassword(current_password, password, (error) => {
        submitCallback(error, state, () => {
          AccountsTemplates.state.form.set('result', AccountsTemplates.texts.info.pwdChanged);
          t.$('#at-field-current_password').val('');
          t.$('#at-field-password').val('');
          if (AccountsTemplates.options.confirmPassword) { t.$('#at-field-password_again').val(''); }
        });
      });
    }

    //----------------
    // Resend Verification E-mail
    //----------------
    if (state === 'resendVerificationEmail') {
      return Meteor.call('ATResendVerificationEmail', email, (error) => {
        AccountsTemplates.submitCallback(error, state, () => {
          AccountsTemplates.state.form.set('result', AccountsTemplates.texts.info.verificationEmailSent);
          t.$('#at-field-email').val('');

          AccountsTemplates.avoidRedirect = true;
        });
      });
    }
  },
});
