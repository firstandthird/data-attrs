# Data Attrs

A set of utility plugins to deal with data attributes.  Data attributes are great when you want to separate your javascript completely from IDs and classes.

## Install

`bower install data-attrs --save`

## Utilities

### $.named

`$.named('element')` will search for `<div data-name="element"></div>`

### $.action

`$.action('delete', handler)` will get called when `<a data-action="delete">Delete</a>` is clicked.

If it will also pass back values, so if you had `<a data-action="approve" data-action-id="123">Approve</a>` you could have something like this:

```
$.action('approve', function(e, values) {
	//this is the a tag that was clicked
	//e is the click event
	//values is an object that looks like { id: '123' }
});
```

### Declaritive Plugins

Declaritive Plugins will automatically bind elements to jQuery plugins.

With something like this:

```
<div data-plugin='slider' data-plugin-pages="3"></div>
```

It will automatically call this behind the scenes:

```
$(el).slider({ pages: 3 });
```

