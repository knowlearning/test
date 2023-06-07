import { v1 as uuid } from 'uuid'
import chai from 'chai/chai.js'
import 'mocha/mocha.js'
import mutate from './mutate.js'
import watch from './watch.js'
import reconnect from './reconnect.js'
import { browserAgent } from '@knowlearning/agents'

import 'mocha/mocha.css'

window.Agent = browserAgent()

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

describe('Core API', function () {
  mutate()
  watch()
  reconnect()
})