import * as React from "react"

import shallowEqual from "../../utils/shallowEqual"
import propValidation from "../../utils/propsValidation"
import bindActions from "../../utils/bindActions"

export class Connect extends React.Component<any> {
  static contextTypes = {
    __redux_zero_store: propValidation
  }
  unsubscribe
  state = this.getProps()
  actions = this.getActions()
  componentWillMount() {
    this.unsubscribe = this.context.__redux_zero_store.subscribe(this.update)
  }
  componentWillUnmount() {
    this.unsubscribe(this.update)
  }
  getProps() {
    const { mapToProps } = this.props
    const state =
      (this.context.__redux_zero_store &&
        this.context.__redux_zero_store.getState()) ||
      {}
    return mapToProps(state, this.props)
  }
  getActions() {
    const { actions } = this.props
    return bindActions(
      typeof actions === "function"
        ? actions(this.context.__redux_zero_store)
        : actions,
      this.context.__redux_zero_store
    )
  }
  update = () => {
    const mapped = this.getProps()
    if (!shallowEqual(mapped, this.state)) {
      this.setState(mapped)
    }
  }
  render() {
    return this.props.children({
      store0: this.context.__redux_zero_store,
      ...this.state,
      ...this.actions
    })
  }
}

export default function connect(mapToProps, actions = {}) {
  return Child => props => (
    <Connect mapToProps={mapToProps} actions={actions}>
      {mappedProps => <Child {...mappedProps} {...props} />}
    </Connect>
  )
}
