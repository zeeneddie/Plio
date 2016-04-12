# PLIO
The first on-demand system for compliance management in the enterprise, using lean principles

This project should sould be developed with respect to the architecture, style guide and best practices defined in [Meteor Guide 1.3](guide.meteor.com).

# GETTING STARTED
## 1. Clone this repository ##
`cd <PROJECTS_FOLDER>`

`git clone https://github.com/sives/Plio.git`

## 2. Install Meteor ##
### OS X or Linux ###
Install the latest official Meteor release from your terminal:
`curl https://install.meteor.com/ | sh`
### Windows ###
[Download the official Meteor installer](https://install.meteor.com/windows)

## 3. Run a Meteor project locally ###
Go to the Meteor project directory (/app) and execute
`meteor`

**Note!** 

If you're getting an error *'Can't listen on port 3000. Perhaps another Meteor is running?
'*, you'll need to specify the port explicitly (and choose some other available port):

`meteor -p 2000 --settings ../config/development/settings.json`
