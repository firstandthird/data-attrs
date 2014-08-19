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

  $.action = function(name, handler) {

    $.named(name, 'action').on('click', function() {
      var el = $(this);
      var values = el.serializeAttrs('action');
      handler(el, values);
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
