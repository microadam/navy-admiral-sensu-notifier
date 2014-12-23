var dgram = require('dgram')
  , generatePacket = require('./generate-packet')

module.exports = function createSendNotification(serviceLocator) {

  function sendNotification(action, requestData, appData) {
    var client = dgram.createSocket('udp4')
      , packet = generatePacket(action, requestData, appData)
      , message = new Buffer(JSON.stringify(packet))

    client.send(message
    , 0
    , message.length
    , 3030
    , '127.0.0.1'
    , function (error) {
        if (error) {
          serviceLocator.logger.error(error)
        }
        client.close()
      }
    )
  }

  return sendNotification
}
