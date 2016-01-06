/*!
 * data-attrs - A few utilities for data attributes
 * v1.1.0
 * https://github.com/firstandthird/data-attrs
 * copyright First+Third 2016
 * MIT License
*/

(function($) {
  $.named = function(name, key) {
    key = key || 'name';
    return $('[data-'+key+'="'+name+'"]');
  };

  $.fn.serializeAttrs = function(attrKey) {

    var el = $(this);
    attrKey = (attrKey) ? 'data-' + attrKey + '-' : 'data-';
    var attributes = el[0].attributes;
    var values = {};
    $.each(attributes, function(index, attr) {
      if (attr.name.indexOf(attrKey) != -1) {
        var name = $.camelCase(attr.name.replace(attrKey, ''));
        var value = el.attr(attr.name);
        values[name] = value;
      }
    });
    return values;
  };

  $.action = function(name, scope, handler) {
    if (typeof name === 'object') {
      for(var action in name) {
        if (!name.hasOwnProperty(action)) {
          continue;
        }

        $.action(action, scope, name[action]);
      }

      return this;
    }

    if (!handler) {
      handler = scope;
      scope = 'body';
    }
    scope = scope || 'body';

    $(scope).on('click', '[data-action="'+name+'"]', function(e) {
      var el = $(this);
      var values = el.serializeAttrs('action');
      handler.call(el, e, values);
    });

  };

  $.module = function(name, callback) {

    var mod = $('[data-module=' + name + ']');

    mod.each(function() {
      var el = $(this);
      var values = el.serializeAttrs('module');
      var els = {};
      el.find('[data-name]').each(function() {
        var subEl = $(this);
        els[subEl.data('name')] = subEl;
      });
      callback(el, values, els);
    });
  };

  $.declaritivePlugins = function() {
    $('[data-plugin]').each(function() {
      var el = $(this);

      var pluginName = el.data('plugin');

      if (!el.data('plugins')) {
        el.data('plugins', []);
      }

      if (!$.fn.hasOwnProperty(pluginName) || el.data('plugins').indexOf(pluginName) != -1) {
        return;
      }
      var values = el.serializeAttrs('plugin');
      el[pluginName](values);
      el.data('plugins').push(pluginName);
      el.trigger('declaritive:init', [pluginName, values]);
    });
  };
  //on window load
  if (!$.declaritivePlugins.skipAutoLoad) {
    $(function() {
      $.declaritivePlugins();
    });
  }
})(jQuery);
