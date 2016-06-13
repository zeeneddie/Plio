// We need to overwright the atPwdFormBtnHelpers method to disable button during the loading
const atPwdFormBtnHelpers = AccountsTemplates.atPwdFormBtnHelpers
atPwdFormBtnHelpers.submitDisabled = () => {
  if (AccountsTemplates.disabled()) {
    return "disabled";
  }

  const disable = _.chain(AccountsTemplates.getFields()).map((field) => {
    return field.hasError() || field.isValidating();
  }).some().value();

  if (disable) {
    return "disabled";
  }
};

Template.atPwdFormBtn.helpers(atPwdFormBtnHelpers);