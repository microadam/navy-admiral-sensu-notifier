var assert = require('assert')
  , generatePacket = require('../../lib/generate-packet')

describe('generate-packet', function () {

  it('should generate a valid packet with default values', function () {
    var requestData = { username: 'user', environment: 'testing' }
      , appData =
        { nodeVersion: '0.10.33'
        , client: 'client'
        , appId: 'testApp'
        , name: 'My Project'
        , url: 'http://google.com'
        }
      , packet = generatePacket('finished', requestData, appData)

    assert.equal(packet.action, 'finished')
    assert(packet.timestamp, 'timestamp missing')
    assert.equal(packet.server, '')
    assert.equal(packet.handlers[0], 'deployment')
    assert.equal(packet.name, 'deployment')
    assert.equal(packet.output, 'Deployment Notification')
    assert.equal(packet.type, 'metric')
    assert.equal(packet.status, 0)
    assert.equal(packet.nodeVersion, appData.nodeVersion)
    assert.equal(packet.commits.length, 0)
    assert.equal(packet.build.version, 'Unknown')
    assert.equal(packet.build.by, requestData.username)
    assert.equal(packet.build.environment, requestData.environment)
    assert.equal(packet.site.name, appData.name)
    assert.equal(packet.site.url, appData.url)
    assert.equal(packet.site.projectId, appData.appId)
    assert.equal(packet.site.clientId, appData.client)
  })

  it('should generate a valid packet with slack channel defined', function () {
    var requestData = {}
      , appData = { sensuNotifier: { slackChannel: 'channel' } }
      , packet = generatePacket('finished', requestData, appData)

    assert.equal(packet.slackChannel, '#channel')
  })

  it('should generate a valid packet with a version number stripped of its v', function () {
    var requestData = { orderArgs: [ 'v1.0.0' ] }
      , appData = {}
      , packet = generatePacket('finished', requestData, appData)

    assert.equal(packet.build.version, '1.0.0')
  })

  it('should generate a valid packet with an untouched version', function () {
    var requestData = { orderArgs: [ 'test' ] }
      , appData = {}
      , packet = generatePacket('finished', requestData, appData)

    assert.equal(packet.build.version, 'test')
  })

})
