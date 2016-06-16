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

    beforeEach(() => { subject = mount(<Decorated title={'My title'} />) })

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
  })

  describe('when composing with a different default value', () => {
  })
})
