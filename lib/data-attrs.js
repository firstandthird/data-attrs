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
    var actions = [];

    function bindAction(action) {
      $(action.scope).on('click', '[data-action="'+action.name+'"]', function(e) {
        var el = $(this);
        var values = el.serializeAttrs('action');
        action.handler.call(el, e, values);
      });
    }

    if (typeof name === 'object') {
      for(var a in name) {
        if(!name.hasOwnProperty(a)) continue;

        actions.push({
          handler: name[a],
          name: a,
          scope: 'body'
        });
      }
    } else {
      if (!handler) {
        handler = scope;
        scope = 'body';
      }

      actions.push({
        scope: scope,
        handler: handler,
        name: name
      });
    }

    for(var i = 0, c = actions.length; i < c; i++) {
      var action = actions[i];

      bindAction(action);
    }
  };

  $.module = function(name, callback) {

    var mod = $('[data-module=' + name + ']');

    mod.each(function() {
      var el = $(this);
      var values = el.serializeAttrs('module');
      callback(el, values);
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
