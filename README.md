# navy-admiral-sensu-notifier

Send notifications to a Sensu client after an Order is executed.

## Installation

Run the following on the same server that the [Admrial](https://github.com/microadam/navy-admiral) is installed on:

    npm install -g navy-admiral-sensu-notifier

## Usage

This plugin assumes that a `sensuNotifer` hash containing the following options has been added to the [Admiral](http://github.com/microadam/navy-admiral) for the application you want notifications to be posted for.

* slackChannel: Slack channel to which notification should be posted (required)
* orders: An array of Order names. If specified, notifications will only be posted for these Orders (optional. Default is all Orders)

* url: This may appear in the main object. This will be shown in the slack notification

An example [Admiral](http://github.com/microadam/navy-admiral) application configuration might look like:

    { "name": "My Application"
    , "appId": "myApp"
    , "url": "http://www.google.com"
    , "sensuNotifier":
      { "slackChannel": "general"
      , "orders": [ "orderName" ]
      }
    }
