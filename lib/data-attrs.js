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
        var name = attr.name.replace(attrKey, '');
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
})(jQuery);
