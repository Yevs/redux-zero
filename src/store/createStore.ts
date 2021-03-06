export default function createStore(state = {}) {
  const listeners = []
  return {
    setState(update) {
      state = typeof update === "function" ? update(state) : state

      listeners.forEach(f => f(state))
    },
    subscribe(f) {
      listeners.push(f)
      return () => {
        listeners.splice(listeners.indexOf(f), 1)
      }
    },
    getState() {
      return state
    }
  }
}
