# Plio

A software tool for managing continuous improvement processes, including quality improvement and compliance management

Plio is built using the Meteor JS and Apollo frameworks.

# Motivation

Plio is a tool that integrates document management, workflow and team collaboration to provide a more streamlined way of managing continuous improvement processes.

With Plio, teams can eliminate the drudgery from running quality improvement and compliance management processes whilst simultaneously finding ways to reduce cost and waste.

Plio helps an organization to create and maintain a standards book for its key processes and policies, supporting real-time discussion around each process.  It also helps streamline the management of corrective and preventative actions that are implemented to improve these processes and policies.

![Continuous Improvement](https://cloud.githubusercontent.com/assets/2095940/14455609/0322fe72-00a9-11e6-8efb-f781c30e0a7b.png)

Source: https://www.getvetter.com/posts/129-define-continuous-improvement-8-experts-definitions

Also see: http://www.oceg.org/resources/leangrc-lean-grc-series/

# Getting started

## 1. Clone this repository ##

`cd <PROJECTS_FOLDER>`

`git clone https://github.com/sives/Plio.git`

## 2. Install Meteor ##

### OS X or Linux ###
Install the latest official Meteor release from your terminal:
`curl https://install.meteor.com/ | sh`
### Windows ###
[Download the official Meteor installer](https://install.meteor.com/windows)

## 3. Run a Meteor project locally ##

Go to the Meteor project directory (/app) and execute
`meteor`

**Note!**

- You will need to execute the `meteor npm install` command if you you'll get a similiar error:

`Error: Can't find npm module 'handlebars'.`

This means that someone added a new npm module and you need to install it.

- If you're getting an error *'Can't listen on port 3000. Perhaps another Meteor is running?
'*, you'll need to specify the port explicitly (and choose some other available port):

`meteor -p 2000`


#DEVELOPMENT


## Contribution process

In order to contribute to this repository you should follow next steps:

1. Run in root dir of cloned repository `npm run install` for install dev dependencies.
2. Choose unassigned card from Trello's "Backlog" or take already assigned to you card.
3. Move your card into "In progress" column.
4. Create new branch based on `devel`. Give you branch name that makes sense. Include the id of the task if there is any (like `PL2-org-settings`).
5. Start working on your task. If you don't know how to do something, then google it. If you stuck on something for more that 15 minutes, ask your colleagues for help.
6. When card is finished, review your code and refactor complex/hard to understand parts of it (usually long functions or lines of code).
7. Test all features that was changed/edited/improved by you. Fix all bugs you found. Next, run `npm run lint app` or `npm run lint background-app` and fix all linter errors.
8. If there are new commits on `devel` merge `devel` to your branch using `--no-ff` flag (see "Merging" section for details).
9. Create pull to `devel`. The name of PR (Pull Request) should contain the id and short description. It should be simple but not ambiguous. Put your pull request's url into related card's description.
10. Move your card into Trello's "Review" column. Someone of your collegues will review\* it. If your pull request was merged go to step #10. If your pull request is closed you should review comments in pull request go to step #1. If you don't understand any comment on your pull request, ask reviewer about it.
11. Congratulations! Your task is done! Go to step 1.

\* All pull requests should be __reviewed__ by other team member before merging with `devel`.


## Merging

Always merge your code with `--no-ff` option, so git will create separate commit for merging and you will be able to review changes after merging on github.

This approach allows to avoid old code appearing in merged version.

## Style Guide

* [Javascript Style Guide by Airbnb](https://github.com/airbnb/javascript) - **this style guide must be complied with for any code contributions.**

### General recomendations:
* Use variable's names that makes sense.
* Use `let` and `const` instead of `var`.
* Extract complex logic into separate class.
* Don't use global variables.
* Avoid unovious solutions. If you are using unobvious solution, then you should write a comment that expalins it.
* Don't leave `console.log` or any other __debuging/commented__ code in pull request's code.
* Do not put function into `Namespace` if it only used in 1 or 2 files.
* If your function has more than 15 lines it makes sense to split it on 2 or couple separate functions.
* Use single quotes instead of double (`'my string'` instead of `"my string"`).
* Use `Collection.find({ _id: id })` instead of `Collection.find(id)`.
* Write `{ someProperty: itsValue }` instead of `{ "someProperty": itsValue }` (except cases when property contains dot or other special character like `{ 'profile.fristname': 'Test' }`).
* Use ES6 string extrapolation (e.g. `"Hello, ${username}!"`) and dynamic attributes (e.g. `{ [myPropertyName]: someValue }`).
* IF YOU ARE WORKING WITH UNSATISFIED QUALITY CODE, PELASE, REWRITE IT FOLLOWING THIS GUIDE.

### Client side (Blaze):
* Correct order for Blaze's template configuration methods: `onCreated, onRendered, helpers, events, onDestroyed`.
* Don't use `Session` if you can pass data using template context.
* Don't use global JQuery selectors (use `this.$('.my-element')` instead of `$('.my-element')`).
* Don't use dynamic data attributes (e.g. `data-id="{{_id}}"`)
* Use `this.autorun` and `this.subscribe` (not `Meteor.autorun` and `Meteor.subscribe`) inside template.
* Don't use jquery if you can write the same thing through Blaze.
* Don't use inline styles.
* Isolate your styles using SaaS's namespacing feature:

```
.my-custom-component {
   ul > li {
     width: 300px;
   }
}
```

### Server side:
* Each argument should be checked using `check(target, Type)` inside all publishers and methods.
* Use ValidatedMethods instead of regular Meteor methods.

## Exception handling

### Methods
```import { handleMethodResult } from '/imports/api/helpers.js';```

handleMethodResult function shows a toastr notification with the error.reason.
Therefore, each error **should contain** both error and reason properties.
E.g. ```throw new Meteor.Error('not-allowed', 'This operation is not allowed');

This function is a wrapper, so you can pass a callback as an argument.
``` 
update.call({ _id, name }, handleMethodResult((err, res) => { 
   this.setSavingState(false); 
}));
```

## Fixtures

All fixture documents are defined in the json format in `app/private/fixtures`.

To add a new document, you need to create a new json file under the proper directory.
Each directory stands for a Meteor collection.
To add a new collection, you need to create a new directory within the `app/private/fixtures` folder. Aso, you need to add names of the collection variable and the directory to the `app/private/fixtures/config.json` file like this:

```
"Meteor.users": "users"
```

+ "Meteor.users" is the users collection in Meteor.

+ "users" is the name of the directory that will store `Meteor.users` documents.

To add a new user, you need to create him via `Accounts.createUser` or a standard registration form to set a password (use a 'password' word as a password).

Then you need to find this document in the mongo database (`meteor mongo`) and copy the `services.password.bcrypt` value.
Use existing json files as an example.

Currently, there are two fixture users: 

email: mike@jssolutionsdev.com

password: password

email: steve.ives@pliohub.com

password: password

## Quill Editor

[Documentation.](http://quilljs.com/docs/quickstart/) Example:

```html
{{#QuillEditor}}
   <!-- This is the actual value -->
   <div>Hello World!</div>
   <div>Some initial <b>bold</b> text</div>
   <div><br></div>
{{/QuillEditor}}
```

#License

The source code for Plio is made available under the [AGPL v3.0](http://www.gnu.org/licenses/agpl-3.0.html) General Public License (a commercial license is also available from [Plio Ltd](http://pliohub.com)).
