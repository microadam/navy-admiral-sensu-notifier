module.exports = function generatePacket(action, requestData, appData) {
  var version = 'Unknown'

  if (requestData.orderArgs && requestData.orderArgs[0]) {
    version = requestData.orderArgs[0]
    if (version.charAt(0) === 'v') {
      version = version.substring(1)
    }
  }

  var packet =
    { action: action
    , timestamp: Math.floor(Date.now() / 1000)
    , server: ''
    , handlers: [ 'deployment' ]
    , name: 'deployment'
    , output: 'Deployment Notification'
    , type: 'metric'
    , status: 0
    , nodeVersion: appData.nodeVersion
    , commits: []
    , build:
      { version: version
      , by: requestData.username
      , environment: requestData.environment
      }
    , site:
      { name: appData.name
      , url: appData.url
      , projectId: appData.appId
      , clientId: appData.client
      }
    }

  if (appData.sensuNotifier && appData.sensuNotifier.slackChannel) {
    packet.slackChannel = '#' + appData.sensuNotifier.slackChannel
  }

  return packet
}
