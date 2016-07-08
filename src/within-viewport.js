import React, { Component } from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'
import shallowEqual from 'recompose/shallowEqual'
import debounce from 'lodash.debounce'

const defaultGetHeight = (elem = {}) => {
  if (elem && elem.getBoundingClientRect) {
    return elem.getBoundingClientRect().height
  }
  if (elem) {
    return elem.clientHeight
  }
  return null
}

const defaultGetWidth = (elem = {}) => {
  if (elem && elem.getBoundingClientRect) {
    return elem.getBoundingClientRect().width
  }
  if (elem) {
    return elem.clientWidth
  }
  return null
}

const defaultGetTop = (elem = {}) => {
  if (elem && elem.getBoundingClientRect) {
    return elem.getBoundingClientRect().top
  }
  if (elem) {
    return elem.clientTop
  }
  return null
}

const defaultGetLeft = (elem = {}) => {
  if (elem && elem.getBoundingClientRect) {
    return elem.getBoundingClientRect().left
  }
  if (elem) {
    return elem.clientLeft
  }
  return null
}

const defaultGetViewportHeight = (_window = {}, _document = {}) => {
  if (_window || _document) {
    return _window.innerHeight || _document.clientHeight
  }
  return null
}

const defaultGetViewportWidth = (_window = {}, _document = {}) => {
  if (_window || _document) {
    return _window.innerWidth || _document.clientWidth
  }
  return null
}

const defaultTransform = ({ inViewport }) => ({ inViewport })

const defaultContainerStyle = {
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0,
}

function noop() {}

const withinViewport = ({
  transform = defaultTransform,
  containerStyle = defaultContainerStyle,
  getHeight = defaultGetHeight,
  getWidth = defaultGetWidth,
  getTop = defaultGetTop,
  getLeft = defaultGetLeft,
  getViewportHeight = defaultGetViewportHeight,
  getViewportWidth = defaultGetViewportWidth,
  defaultAnswer = true,
  wait = 200,
  onViewportEnter = noop,
  onViewportLeave = noop,
} = {}) => (BaseComponent) => class extends Component {
  static displayName = wrapDisplayName(BaseComponent, 'withinViewport')

  state = {
    containerWidth: null,
    containerHeight: null,
    containerTopOffset: null,
    containerLeftOffset: null,
    windowWidth: null,
    windowHeight: null,
    ready: false,
  }

  componentDidMount() {
    if (window && window.addEventListener) {
      this.debouncedUpdateResize = debounce(this.updateResize, wait)
      this.debouncedUpdateScroll = debounce(this.updateScroll, wait)
      window.addEventListener('resize', this.debouncedUpdateResize, { passive: true })
      window.addEventListener('scroll', this.debouncedUpdateScroll, { passive: true })
      this.updateResize()
      this.updateScroll()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const was = this.inViewport(prevState)
    const is = this.inViewport(this.state)

    if (prevState.ready === null && is === false) { onViewportLeave() }
    if (prevState.ready === null && is === true) { onViewportEnter() }
    if (was === true && is === false) { onViewportLeave() }
    if (was === false && is === true) { onViewportEnter() }
  }

  componentWillUnmount() {
    if (window && window.removeEventListener) {
      window.removeEventListener('resize', this.debouncedUpdateResize)
      window.removeEventListener('scroll', this.debouncedUpdateScroll)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(
        transform({ inViewport: this.inViewport(this.state), ...this.state }),
        transform({ inViewport: this.inViewport(nextState), ...nextState })
      )
    )
  }

  updateResize = () => {
    const update = () => {
      const elem = this.refs.withinViewportContainer

      const newState = {
        containerWidth: getWidth(elem),
        containerHeight: getHeight(elem),
        windowWidth: getViewportWidth(window, document),
        windowHeight: getViewportHeight(window, document),
      }

      this.setState({ ...newState, ready: this.isReady({ ...this.state, ...newState }) })
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => update())
    } else {
      update()
    }
  }

  updateScroll = () => {
    const update = () => {
      const elem = this.refs.withinViewportContainer

      const newState = {
        containerTopOffset: getTop(elem),
        containerLeftOffset: getLeft(elem),
      }
      this.setState({ ...newState, ready: this.isReady({ ...this.state, ...newState }) })
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => update())
    } else {
      update()
    }
  }

  isReady = (state = this.state) => (
    state.containerWidth !== null &&
    state.containerHeight !== null &&
    state.containerTopOffset !== null &&
    state.containerLeftOffset !== null &&
    state.windowHeight !== null &&
    state.windowWidth !== null
  )

  inViewport = (state = this.state) => {
    if (state.ready) {
      return (
        (
          state.containerTopOffset < 0 &&
          (state.containerHeight + state.containerTopOffset) > 0
        ) ||
        (
          state.containerTopOffset >= 0 &&
          state.containerTopOffset < state.windowHeight
        )
      ) &&
      (
        (
          state.containerLeftOffset < 0 &&
          (state.containerWidth + state.containerLeftOffset) > 0
        ) ||
        (
          state.containerLeftOffset >= 0 &&
          state.containerLeftOffset < state.windowWidth
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
          {...transform({ inViewport: this.inViewport(), ...this.state })}
          {...this.props}
        />
      </div>
    )
  }
}

export default withinViewport
