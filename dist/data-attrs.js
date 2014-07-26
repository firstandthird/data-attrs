/*!
 * data-attrs - A few utilities for data attributes
 * v0.0.1
 * https://github.com/firstandthird/data-attrs
 * copyright First+Third 2014
 * MIT License
*/

(function($) {
  $.named = function(name, key) {
    key = key || 'name';
    return $('[data-'+key+'="'+name+'"]');
  };

  $.action = function(name, handler) {

    var valueAttr = 'data-action-';
    $.named(name, 'action').on('click', function() {
      var el = $(this);
      var attributes = el[0].attributes;
      var values = {};
      $.each(attributes, function(index, attr) {
        if (attr.name.indexOf(valueAttr) != -1) {
          var name = attr.name.replace(valueAttr, '');
          var value = el.attr(attr.name);
          values[name] = value;
        }
      });
      handler(el, values);
    });

  };
})(jQuery);
