# PLIO
The first on-demand system for compliance management in the enterprise, using lean principles

This project should sould be developed with respect to the architecture, style guide and best practices defined in [Meteor Guide 1.3](guide.meteor.com).

# MOTIVATION
Plio is a collaborative software tool designed to support a new approach to compliance management based on the principles of continuous improvement.

Regulated organizations face particular challenges. Not only do they need to meet the requirements of customers but also the requirements of their regulatory agency. By applying the principles of continuous improvement, businesses can streamline the compliance management process whilst simultaneously finding ways to reduce cost and waste.

Plio helps an organization to create and maintain a standards book for its key processes and policies, supporting real-time discussion around each process.  It also helps streamline the management of corrective and preventative actions that are implemented to improve these processes and policies. 

Plio is built using the Meteor JS framework, following the architecture, style guide and best practices defined in Meteor Guide 1.3.  The source code for Plio is made available under the GNU General Public License v3.0 (commercial license also available).

![Continuous Improvement](https://cloud.githubusercontent.com/assets/2095940/14455609/0322fe72-00a9-11e6-8efb-f781c30e0a7b.png)

Source: https://www.getvetter.com/posts/129-define-continuous-improvement-8-experts-definitions

Also see: http://www.oceg.org/resources/leangrc-lean-grc-series/

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

`meteor -p 2000`

#License
The source code for Plio is made available under the GNU General Public License v3.0 (commercial license also available).
