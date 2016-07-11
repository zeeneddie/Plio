SimpleSchema.messages({
  "regEx": [
    {msg: "Failed regular expression validation"},
    {exp: SimpleSchema.RegEx.Email, msg: '"[value]" must be a valid e-mail address'},
  ],
  "regEx number": [
    {msg: '"[value]" is not a valid phone number'},
  ],
  "minNumber timeValue": "Please, set correct time for reminders (can`t be [value])"
});
