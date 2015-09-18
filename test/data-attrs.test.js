/*global describe,it,expect,before*/
describe('data-attrs', function() {

  describe('$.named', function() {

    it('should return the element', function(done) {
      var el = $.named('element1');
      expect(el).to.not.equal(undefined);
      expect(el.length).to.equal(1);
      expect(el.selector).to.equal('[data-name="element1"]');
      done();
    });

    it('should support custom keys', function(done) {
      var el = $.named('element2', 'key');
      expect(el).to.not.equal(undefined);
      expect(el.length).to.equal(1);
      expect(el.selector).to.equal('[data-key="element2"]');
      done();
    });
  });

  describe('$.fn.serializeAttrs', function() {

    it('should return the values for an element', function() {
      var values = $.named('attrValues').serializeAttrs('attr');
      expect(values).to.deep.equal({
        test: '123',
        val: 'blah',
        multiWord: 'test'
      });
    });

    it('should return all data values if nothing passed', function() {
      var values = $.named('attrValues').serializeAttrs();
      expect(values).to.deep.equal({
        name: 'attrValues',
        'attrTest': '123',
        'attrVal': 'blah',
        'attrMultiWord': 'test'
      });
    });
  });

  describe('$.action', function() {

    before(function(done) {
      $('a').off('click');
      done();
    });

    it('should trigger on click', function(done) {
      var a = $('[data-action="test"]');
      $.action('test', function(e) {
        expect(this.data('action')).to.equal('test');
        expect(typeof e.preventDefault).to.equal('function');
        done();
      });

      a.click();
    });

    it('should pass back values', function(done) {
      $.action('test-values', function(e, values) {
        expect(this.data('action')).to.equal('test-values');
        expect(typeof e.preventDefault).to.equal('function');
        expect(values).to.deep.equal({
          id: '123',
          slug: 'blah'
        });
        done();
      });

      $('[data-action="test-values"]').click();
    });

    it('should delegate event', function(done) {
      $('body').append('<a data-action="testDelegate"></a>');

      var a = $('[data-action="testDelegate"]');
      $.action('testDelegate', function(e) {
        expect(this.data('action')).to.equal('testDelegate');
        expect(typeof e.preventDefault).to.equal('function');
        done();
      });

      a.click();
    });
  });

  describe('$.declaritivePlugins', function() {

    before(function() {
      $.declaritivePlugins.skipAutoLoad = true;
    });

    it('should not throw on invalid plugin', function(done) {
      $.declaritivePlugins();
      done();
    });

    it('should auto bind to a plugin', function(done) {
      $.fn.dummyPlugin1 = function() {
        var el = $(this);
        expect(el.data('plugin')).to.equal('dummyPlugin1');
        done();
      };
      $.declaritivePlugins();
      expect($('[data-plugin=dummyPlugin1]').data('plugins')).to.deep.equal([
        'dummyPlugin1'
      ]);
    });

    it('should not bind twice', function(done) {
      $.declaritivePlugins();
      expect($('[data-plugin=dummyPlugin1]').data('plugins')).to.deep.equal([
        'dummyPlugin1'
      ]);
      done();
    });

    it('should pass in values to a plugin', function(done) {
      $.fn.dummyPlugin2 = function(options) {
        var el = $(this);
        expect(el.data('plugin')).to.equal('dummyPlugin2');
        expect(options).to.deep.equal({
          name: 'Bob',
          age: '26'
        });
        done();
      };
      $.declaritivePlugins();
      expect($('[data-plugin=dummyPlugin2]').data('plugins')).to.deep.equal([
        'dummyPlugin2'
      ]);
    });

    it('should trigger event on binding', function(done) {

      $.fn.dummyPlugin3 = function() {
      };
      $('[data-plugin=dummyPlugin3]').on('declaritive:init', function(e, name, options) {
        //this should be element
        expect($(this).length).to.equal(1);
        expect(name).to.equal('dummyPlugin3');
        expect(options).to.deep.equal({
          name: 'Bob'
        });
        done();
      });

      $.declaritivePlugins();
    });

  });

});
