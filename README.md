# react-within-viewport

Debounced React high order component to flag when it's container is inside the viewport.

## Usage

Let's build an example react component:

```js
const Header = ({ style }) => (<h1 style={style}>Header</h1>)
```

And decorate:

```js
import WithinViewport from 'react-within-viewport'

const Decorated = WithinViewport()(Header)
```

Now when you use `<Decorated />` it will pass the boolean property `inViewport`.

You can change the property name by passing a transformation function, example:

```js
const Decorated = WithinViewport(
  { transform: (inViewport) => ({ insideViewport: inViewport }) }
)(Header)
```

The property passed to the `Header` would change to `insideViewport`

You can also change the wrapper div style to meet your needs like:

```js
const Decorated = WithinViewport(
  { containerStyle: { display: 'inline-block' } }
)(Header)
```

## Contributing

First of all, **thank you** for wanting to help!

1. [Fork it](https://help.github.com/articles/fork-a-repo).
2. Create a feature branch - `git checkout -b more_magic`
3. Add tests and make your changes
4. Check if tests are ok - `npm test`
5. Commit changes - `git commit -am "Added more magic"`
6. Push to Github - `git push origin more_magic`
7. Send a [pull request](https://help.github.com/articles/using-pull-requests)! :heart: :sparkling_heart: :heart:
