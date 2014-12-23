var assert = require('assert')
  , sinon = require('sinon')
  , EventEmitter = require('events').EventEmitter
  , rewire = require('rewire')
  , createSensuNotifier = rewire('../')

describe('navy-admiral-sensu-notifier', function () {

  it('should send a notification when no orders specified', function (done) {
    var sendNotificationSpy = sinon.spy()
      , messageBus = new EventEmitter()
      , serviceLocator =
          { messageBus: messageBus
          }
      , sensuOptions = {}

    createSensuNotifier.__set__('createSendNotification', function () { return sendNotificationSpy })

    var sensuNotifier = createSensuNotifier({ serviceLocator: serviceLocator })
    sensuNotifier()

    messageBus.emit('orderComplete', { order: 'myOrder' }, { name: 'Test App', sensuNotifier: sensuOptions })
    process.nextTick(function () {
      var callCount = sendNotificationSpy.callCount
      assert.equal(callCount, 1, 'sendNotification should have been called. Called: ' + callCount)
      assert.equal(sendNotificationSpy.calledWith('finished')
      , true
      , 'sendNotification not called with "finished" action'
      )
      done()
    })
  })

  it('should not send a notification when order is not in specified orders', function (done) {
    var sendNotificationSpy = sinon.spy()
      , messageBus = new EventEmitter()
      , serviceLocator =
          { messageBus: messageBus
          }
      , sensuOptions =
          { orders: [ 'myOrder' ]
          }

    createSensuNotifier.__set__('createSendNotification', function () { return sendNotificationSpy })

    var sensuNotifier = createSensuNotifier({ serviceLocator: serviceLocator })
    sensuNotifier()

    messageBus.emit('orderComplete', { order: 'doNotNotify' }, { name: 'Test App', sensuNotifier: sensuOptions })
    process.nextTick(function () {
      var callCount = sendNotificationSpy.callCount
      assert.equal(callCount, 0, 'sendNotification should not have been called. Called: ' + callCount)
      done()
    })
  })

  it('should send a notification when order is in specified orders', function (done) {
    var sendNotificationSpy = sinon.spy()
      , messageBus = new EventEmitter()
      , serviceLocator =
          { messageBus: messageBus
          }
      , sensuOptions =
          { orders: [ 'myOrder' ]
          }

    createSensuNotifier.__set__('createSendNotification', function () { return sendNotificationSpy })

    var sensuNotifier = createSensuNotifier({ serviceLocator: serviceLocator })
    sensuNotifier()

    messageBus.emit('orderComplete', { order: 'myOrder' }, { name: 'Test App', sensuNotifier: sensuOptions })
    process.nextTick(function () {
      var callCount = sendNotificationSpy.callCount
      assert.equal(callCount, 1, 'sendNotification should have been called. Called: ' + callCount)
      assert.equal(sendNotificationSpy.calledWith('finished')
      , true
      , 'sendNotification not called with "finished" action'
      )
      done()
    })
  })

})
