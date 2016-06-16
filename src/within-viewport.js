import React, { Component } from 'react'
import wrapDisplayName from 'recompose/wrapDisplayName'

const withinViewport = ({
  transform = ((inViewport) => ({ inViewport })),
  containerStyle = ({
    width: '100%',
    height: '100%',
    padding: 0,
    border: 0,
  }),
} = {}) => (BaseComponent) => class extends Component {
  static displayName = wrapDisplayName(BaseComponent, 'withinViewport')

  render() {
    return (
      <div
        ref={'withinViewportContainer'}
        style={containerStyle}
      >
        <BaseComponent
          {...transform(true)}
          {...this.props}
        />
      </div>
    )
  }
}

export default withinViewport
