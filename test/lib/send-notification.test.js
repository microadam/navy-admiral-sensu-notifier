var assert = require('assert')
  , sinon = require('sinon')
  , rewire = require('rewire')
  , createSendNotification = rewire('../../lib/send-notification')

describe('send-notification', function () {

  it('should send a buffer as a udp packet with no errors', function (done) {

    var clientSendStubCalled = false
    function clientSendStub(message, offset, length, port, address, cb) {
      clientSendStubCalled = true
      assert.equal(message.toString(), '{"a":1}')
      assert.equal(offset, 0)
      assert.equal(length, 7)
      assert.equal(port, 3030)
      assert.equal(address, '127.0.0.1')
      cb()
    }

    var clientCloseSpy = sinon.spy()
      , dgramClient =
        { send: clientSendStub
        , close: clientCloseSpy
        }
      , errorSpy = sinon.spy()
      , logger = { error: errorSpy }
      , serviceLocator = { logger: logger }

    createSendNotification.__set__('dgram', { createSocket: function () { return dgramClient } })
    createSendNotification.__set__('generatePacket', function () { return { a: 1 } })

    var sendNotification = createSendNotification(serviceLocator)
    sendNotification()

    process.nextTick(function () {
      assert.equal(clientSendStubCalled, true, 'client send not called')
      assert.equal(clientCloseSpy.callCount, 1, 'client close not called')
      assert.equal(errorSpy.callCount, 0, 'error logger should not have been called')
      done()
    })
  })

  it('should send a buffer as a udp packet and log any errors', function (done) {

    var clientSendStubCalled = false
    function clientSendStub(message, offset, length, port, address, cb) {
      clientSendStubCalled = true
      cb(new Error('error'))
    }

    var clientCloseSpy = sinon.spy()
      , dgramClient =
        { send: clientSendStub
        , close: clientCloseSpy
        }
      , errorSpy = sinon.spy()
      , logger = { error: errorSpy }
      , serviceLocator = { logger: logger }

    createSendNotification.__set__('dgram', { createSocket: function () { return dgramClient } })
    createSendNotification.__set__('generatePacket', function () { return { a: 1 } })

    var sendNotification = createSendNotification(serviceLocator)
    sendNotification()

    process.nextTick(function () {
      assert.equal(clientSendStubCalled, true, 'client send not called')
      assert.equal(clientCloseSpy.callCount, 1, 'client close not called')
      assert.equal(errorSpy.callCount, 1, 'error logger should not have been called')
      done()
    })
  })

})
