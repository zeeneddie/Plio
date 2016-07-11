SimpleSchema.messages({
  regEx: [
    {msg: "Failed regular expression validation"},
    {exp: SimpleSchema.RegEx.Email, msg: '"[value]" must be a valid e-mail address'},
  ]
});
