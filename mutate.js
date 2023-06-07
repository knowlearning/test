export default function () {
  describe('Mutable State', function () {
    // TODO: test clearing a runstate

    it('Sets new fields and values when starting from null', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)
      const newValues = { a: 1, b: 2, c: 3 }
      Object.assign(state, newValues)
      const finalState = await Agent.state(id)
      finalState.should.deep.equal(newValues)
    })

    it('Deletes fields as expected', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)

      const oldValues = { a: 1, b: 2, c: 3 }
      Object.assign(state, oldValues)

      Object.keys(state).forEach(key => delete state[key])

      const newValues = { arr: [1, 2, 3] }
      Object.assign(state, newValues)

      const finalState = await Agent.state(id)
      finalState.should.deep.equal(newValues)
    })

    it('Appends values to existing arrays', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)

      Object.assign(state, { arr: [1, 2, 3] })
      state.arr.push(4)

      const expectedValues = { arr: [1, 2, 3, 4] }
      const finalState = await Agent.state(id)
      finalState.should.deep.equal(expectedValues)
    })

    it('Removes values from existing arrays', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)

      Object.assign(state, { arr: [1, 2, 3] })
      state.arr.splice(1, 1)

      const expectedValues = { arr: [1, 3] }
      const finalState = await Agent.state(id)
      finalState.should.deep.equal(expectedValues)
    })

    it('Can persist mutations on nested objects', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)
      state.testObj = {}
      state.testObj.testVal = 1000
      const resultState = await Agent.state(id)
      expect(resultState).to.deep.equal({ testObj: { testVal: 1000 } })
    })

    it('Cannot nest same mutable object at different paths', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)
      state.testObj = {}
      let causedError = null
      try { state.secondTestObjectReference = state.testObj }
      catch (error) { causedError = error }
      expect(causedError).to.not.equal(null)
    })

    it('Gets empty object in place of null', async function () {
      const id = uuid()
      const state = await Agent.mutate(id)
      expect(state).to.deep.equal({})
    })

/*
    function disconnectionTest(disconnectionEvent) {
      return async function() {
        const state = {}
        interact(state)
        const numFirstConnectionWrites = 5
        for (let i=0; i<numFirstConnectionWrites; i++) {
          state['connected' + i] = true
          interact(state)
        }
        Core.send(disconnectionEvent)
        const numDisconnectedWrites = 5
        const beforeDisconnectedState = JSON.parse(JSON.stringify(state))
        const beforeDisconnectedStatePromise = Core.send({ type: 'state' })

        //  spread out diconnected writes over disconnection interval
        for (let i=0; i<numDisconnectedWrites; i++) {
          state['disconnected' + i] = true
          interact(state)
        }
        const { state: beforeResult } = await beforeDisconnectedStatePromise
        beforeResult.should.deep.equal(beforeDisconnectedState)

        const { state: result } = await Core.send({ type: 'state' })
        result.should.deep.equal(state)
      }
    }

    it(
      'Restablishes watcher after disconnect and reconnect',
      async function () {
        console.log('SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSTART')
        this.timeout(5000)
        await interact(null)
        const expectedStates = [
          { a: 're-establish test' },
          { a: 're-establish test concat' },
          { a: 're-establish test', b: 'add field' },
          { a: 're-establish test reconcat', b: 'add field' },
          { a: 're-establish test reconcat', b: 'change field' },
          { a: 're-establish test reconcat change', b: 'change both fields' }
        ]

        const expectedStatePromises = expectedStates.map(state => {
          let resolve, reject
          const promise = new Promise((res, rej) => {
            resolve = res
            reject = rej
          })
          promise.resolve = resolve
          promise.reject = reject
          return promise
        })

        let seenStatesIndex = 0
        const { close } = await Core.send({ type: 'state' }, ({ state }) => {
          console.log('INTERACTING RESPONSE', state, seenStatesIndex)
          try {
            expect(seenStatesIndex).to.be.lessThan(expectedStates.length)
            expect(state).to.deep.equal(expectedStates[seenStatesIndex])
            expectedStatePromises[seenStatesIndex].resolve()
            seenStatesIndex += 1
          }
          catch (error) {
            expectedStatePromises[seenStatesIndex].reject(error)
            console.log(state, 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEND')
            close()
          }
        })
        for (let i=0; i<expectedStates.length; i++) {
          const state = expectedStates[i]
          console.log('INTERACTING', state, i)
          if (i === 3) {
            Core.send({ type: 'disconnect', end: 'local' })
          }
          await interact(state)
        }
        await Promise.all(expectedStatePromises)
        await close()
      }
    )

    it(
      'Disconnects locally then reconnects with expected state',
      disconnectionTest({ type: 'disconnect', end: 'local' })
    )

    it(
      'Disconnects remotely then reconnects with expected state',
      disconnectionTest({ type: 'disconnect', end: 'remote', condition: 'error' })
    )
    */
  })
}
