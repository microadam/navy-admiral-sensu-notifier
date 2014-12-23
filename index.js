var createSendNotification = require('./lib/send-notification')

module.exports = function createSensuNotifier(options) {

  var serviceLocator = options.serviceLocator
    , sendNotification = createSendNotification(serviceLocator)

  function sensuNotifier() {

    function onEvent(action, requestData, appData) {
      var orders = appData.sensuNotifier.orders || []

      if (!orders.length) {
        orders.push(requestData.order)
      }
      if (orders.indexOf(requestData.order) > -1) {
        sendNotification(action, requestData, appData)
      }
    }

    serviceLocator.messageBus.on('orderComplete', onEvent.bind(null, 'finished'))
  }

  return sensuNotifier
}
