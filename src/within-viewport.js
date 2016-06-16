import React, { Component } from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'
import debounce from 'lodash.debounce'

const withinViewport = ({
  transform = ((inViewport) => ({ inViewport })),
  containerStyle = ({
    width: '100%',
    height: '100%',
    padding: 0,
    border: 0,
  }),
  getHeight = ((elem) => elem.getBoundingClientRect().height),
  getWidth = ((elem) => elem.getBoundingClientRect().width),
  getTop = ((elem) => elem.getBoundingClientRect().top),
  getLeft = ((elem) => elem.getBoundingClientRect().left),
  getViewportHeight = ((_window, _document) => _window.innerHeight || _document.clientHeight),
  getViewportWidth = ((_window, _document) => _window.innerWidth || _document.clientWidth),
  defaultAnswer = true,
  wait = 200,
} = {}) => (BaseComponent) => class extends Component {
  static displayName = wrapDisplayName(BaseComponent, 'withinViewport')

  state = {
    containerWidth: null,
    containerHeight: null,
    containerTopOffset: null,
    containerLeftOffset: null,
    windowWidth: null,
    windowHeight: null,
    updated: false,
  }

  componentDidMount() {
    if (window && window.addEventListener) {
      this.debouncedUpdate = debounce(this.updateState, wait)
      window.addEventListener('resize', this.debouncedUpdate)
      window.addEventListener('scroll', this.debouncedUpdate)
      this.updateState()
    }
  }

  componentWillUnmount() {
    if (window && window.removeEventListener) {
      window.removeEventListener('resize', this.debouncedUpdate)
      window.removeEventListener('scroll', this.debouncedUpdate)
    }
  }

  updateState = () => {
    const update = () => {
      const elem = this.refs.withinViewportContainer

      this.setState({
        containerWidth: getWidth(elem),
        containerHeight: getHeight(elem),
        containerTopOffset: getTop(elem),
        containerLeftOffset: getLeft(elem),
        windowWidth: getViewportWidth(window, document),
        windowHeight: getViewportHeight(window, document),
        updated: true,
      })
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => update())
    } else {
      update()
    }
  }

  inViewport = () => {
    if (this.state.updated) {
      return (
        (
          this.state.containerTopOffset < 0 &&
          (this.state.containerHeight + this.state.containerTopOffset) > 0
        ) ||
        (
          this.state.containerTopOffset >= 0 &&
          this.state.containerTopOffset < this.state.windowHeight
        )
      ) &&
      (
        (
          this.state.containerLeftOffset < 0 &&
          (this.state.containerWidth + this.state.containerLeftOffset) > 0
        ) ||
        (
          this.state.containerLeftOffset >= 0 &&
          this.state.containerLeftOffset < this.state.windowWidth
        )
      )
    }
    return defaultAnswer
  }

  render() {
    return (
      <div
        ref={'withinViewportContainer'}
        style={containerStyle}
      >
        <BaseComponent
          {...transform(this.inViewport())}
          {...this.props}
        />
      </div>
    )
  }
}

export default withinViewport
