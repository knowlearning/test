export default function () {
  describe('Watchers', function () {

    it(
      'Gets the expected number of updates',
      async function () {
        this.timeout(5000)

        const id = uuid()
        const state = await Agent.mutate(id)
        const statePromise = Agent.state(id)
        const expectedUpdates = 3
        let numUpdates = 0

        let resolveExpectedUpdates
        const expectedUpdatesPromise = new Promise(r => resolveExpectedUpdates = r)

        statePromise.watch(() => {
          numUpdates += 1
          if (numUpdates === expectedUpdates) resolveExpectedUpdates()
        })

        Object.assign(state, {x:1, y:2, z:3})

        await expectedUpdatesPromise

        expect(numUpdates).to.equal(expectedUpdates)
      }
    )

    it(
      'Closes a listening connection after a close call',
      async function () {
        console.log('starting watch test')
        this.timeout(5000)

        const id = uuid()
        const state = await Agent.mutate(id)
        const statePromise = Agent.state(id)
        let updatesSeen = 0

        let resolveThirdUpdate
        const thirdUpdatePromise = new Promise(r => resolveThirdUpdate = r)

        // set up one watcher
        statePromise
          .watch(() => {
            updatesSeen += 1
            if (updatesSeen === 3) resolveThirdUpdate()
          })

        Object.assign(state, {x:1,y:2,z:3})

        // unwatch after 3 updates
        await thirdUpdatePromise
        statePromise.unwatch()

        let resolveAfterUnwatchPromise
        const finalUpdatesPromise = new Promise(r => resolveAfterUnwatchPromise = r)

        const expectedValues = {x:2,y:3,z:4}
        Object.assign(state, expectedValues)

        //  set up another watcher
        let afterUnwatchUpdates = 0
        const finalStatePromise = Agent.state(id)
        finalStatePromise
          .watch(() => {
            afterUnwatchUpdates += 1
            if (afterUnwatchUpdates === 3) resolveAfterUnwatchPromise()
          })
        await finalUpdatesPromise
        finalStatePromise.unwatch()

        const finalState = await finalStatePromise
        finalState.should.deep.equal(expectedValues)

        //  make sure first watcher didn't get any other updates
        expect(updatesSeen).to.equal(3)
      }
    )
  })
}
