jest.unmock('../within-viewport')

import React from 'react'
import WithinViewport from '../within-viewport'
import { mount } from 'enzyme'

describe('WithinViewport()(Component)', () => {
  let subject
  const Header = ({ title }) => (<h1>{title}</h1>)
  Header.propTypes = { title: React.PropTypes.string }

  describe('when composing with default options', () => {
    const Decorated = WithinViewport()(Header)

    beforeEach(() => {
      subject = mount(<Decorated title={'My title'} />)
      subject.setState({ ready: true })
    })

    it('renders', () => { expect(subject).toBeTruthy() })
    it('renders inner component', () => { expect(subject.find(Header).length).toBe(1) })
    it('defines a displayName', () => {
      expect(Decorated.displayName).toBe('withinViewport(Header)')
    })
    it('injects property inViewport', () => {
      expect(subject.find(Header).prop('inViewport')).not.toBeUndefined()
    })
  })

  describe('when composing with a custom transform function', () => {
    const Decorated = WithinViewport({ transform: (v) => ({ insideViewport: v }) })(Header)

    beforeEach(() => {
      subject = mount(<Decorated title={'My title'} />)
      subject.setState({ ready: true })
    })

    it('injects property insideViewport', () => {
      expect(subject.find(Header).prop('insideViewport')).not.toBeUndefined()
    })
  })

  describe('when composing with a diferent default value', () => {
    const Decorated = WithinViewport({ defaultAnswer: false })(Header)

    beforeEach(() => {
      subject = mount(<Decorated title={'My title'} />)
      subject.setState({ updated: false })
    })

    it('changes the default answer', () => {
      expect(subject.find(Header).prop('inViewport')).toBe(false)
    })
  })

  describe('when composed is smaller than viewport', () => {
    describe('and inside viewport', () => {
      const Decorated = WithinViewport({
        getHeight: () => 20,
        getWidth: () => 20,
        getTop: () => 0,
        getLeft: () => 0,
        getViewportHeight: () => 200,
        getViewportWidth: () => 200,
      })(Header)

      beforeEach(() => {
        subject = mount(<Decorated title={'My title'} />)
        subject.setState({ ready: true })
      })

      it('flags inViewport true', () => {
        expect(subject.find(Header).prop('inViewport')).toBe(true)
      })
    })

    describe('and outside (top left) of viewport', () => {
      const Decorated = WithinViewport({
        getHeight: () => 20,
        getWidth: () => 20,
        getTop: () => -30,
        getLeft: () => -30,
        getViewportHeight: () => 200,
        getViewportWidth: () => 200,
      })(Header)

      beforeEach(() => {
        subject = mount(<Decorated title={'My title'} />)
        subject.setState({ ready: true })
      })

      it('flags inViewport false', () => {
        expect(subject.find(Header).prop('inViewport')).toBe(false)
      })
    })

    describe('and outside (far right) of viewport', () => {
      const Decorated = WithinViewport({
        getHeight: () => 20,
        getWidth: () => 20,
        getTop: () => 0,
        getLeft: () => 300,
        getViewportHeight: () => 200,
        getViewportWidth: () => 200,
      })(Header)

      beforeEach(() => {
        subject = mount(<Decorated title={'My title'} />)
        subject.setState({ ready: true })
      })

      it('flags inViewport false', () => {
        expect(subject.find(Header).prop('inViewport')).toBe(false)
      })
    })

    describe('and outside (far bottom) of viewport', () => {
      const Decorated = WithinViewport({
        getHeight: () => 20,
        getWidth: () => 20,
        getTop: () => 300,
        getLeft: () => 0,
        getViewportHeight: () => 200,
        getViewportWidth: () => 200,
      })(Header)

      beforeEach(() => {
        subject = mount(<Decorated title={'My title'} />)
        subject.setState({ ready: true })
      })

      it('flags inViewport false', () => {
        expect(subject.find(Header).prop('inViewport')).toBe(false)
      })
    })
  })

  describe('when composed is bigger than viewport', () => {
    describe('and inside viewport', () => {
      const Decorated = WithinViewport({
        getHeight: () => 300,
        getWidth: () => 300,
        getTop: () => -50,
        getLeft: () => -50,
        getViewportHeight: () => 200,
        getViewportWidth: () => 200,
      })(Header)

      beforeEach(() => {
        subject = mount(<Decorated title={'My title'} />)
        subject.setState({ ready: true })
      })

      it('flags inViewport true', () => {
        expect(subject.find(Header).prop('inViewport')).toBe(true)
      })
    })
  })
})
