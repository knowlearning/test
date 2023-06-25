import { v1 as uuid } from 'uuid'
import chai from 'chai/chai.js'
import 'mocha/mocha.js'
import mutate from './tests/mutate.js'
import watch from './tests/watch.js'
import reconnect from './tests/reconnect.js'
import arrays from './tests/arrays.js'
import { browserAgent } from '@knowlearning/agents'

import 'mocha/mocha.css'

window.Agent = browserAgent()

//Agent.debug()

//  set up some globals for ease of use in test files
window.expect = chai.expect
window.uuid = uuid

chai.should()

mocha
  .setup({
    ui: 'bdd',
    reporter: 'HTML',
    rootHooks: {
      beforeEach(done) {
        done()
      }
    }
  })

const container = document.createElement('div')
container.id = 'mocha'
document.body.appendChild(container)

mocha.run()

Agent.debug()

describe('Core API', function () {
  mutate()
  arrays()
  watch()
  reconnect()
})