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

    it('should allow for a scoped element and fire if inside that element', function(done) {
      var scopedContainer = $.named('scopedAction');

      var called = 0;
      $.action('scoped', scopedContainer, function() {
        called++;
      });

      scopedContainer.find('a').click();
      $('#out-of-scope').click();
      setTimeout(function() {
        expect(called).to.equal(1);
        done();
      });
    });

    it('should trigger on click as object', function(done) {
      var a = $('[data-action="test2"]');
      $.action({
        test2: function(e) {
          expect(this.data('action')).to.equal('test2');
          expect(typeof e.preventDefault).to.equal('function');
          done();
        }
      });

      a.click();
    });

    it('should trigger on click as object scoped', function(done) {
      var scopedContainer = $.named('scopedAction');

      var called = 0;
      $.action({
        'scoped': function() {
          called++;
        }
      }, scopedContainer);

      scopedContainer.find('a').click();
      $('#out-of-scope').click();
      setTimeout(function() {
        expect(called).to.equal(1);
        done();
      });
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

  describe('module', function() {
    it('should expose $.module', function(done) {
      expect(typeof $.module).to.equal('function');
      done();
    });

    it('should call callback if data-module="name" exists', function(done) {
      $.module('module', function(el, values) {

        expect(el.attr('id')).to.equal('module');
        expect(values).to.deep.equal({
          value: '123'
        });
        done();

      });
    });

    it('should not call callback if module doesnt exist', function(done) {
      var called = false;
      $.module('non-module', function() {
        called = true;
      });
      setTimeout(function() {
        expect(called).to.equal(false);
        done();
      });
    });

    it('should not allow multiple modules of the same name', function(done) {
      $.module('dupe', function() {});
      expect(function() {
        $.module('dupe', function() {});
      }).to.throw();
      done();
    });

    it('should call callback for each module that matches name', function(done) {
      var calls = 0;

      $.module('multi-module', function(el, values) {

        //see if first module
        if (calls === 0) {
          expect(values).to.deep.equal({
            value: '123'
          });
        } else if (calls == 1) {
          expect(values).to.deep.equal({
            value: '456'
          });
        }

        calls++;

      });
      setTimeout(function() {
        expect(calls).to.equal(2);
        done();
      });
    });

    it('should return all data-name elements', function(done) {
      $.module('moduleName', function(el, values, els) {

        expect(els.title).to.not.equal(undefined);
        expect(els.title.text()).to.equal('Title');
        done();

      });
    });

    it('should expose $.module.search to find new modules', function(done) {
      expect(typeof $.module.search).to.equal('function');
      done();
    });

    it('should only invoke a module once', function(done) {
      var count = 0;
      $.module('moduleOnce', function(el, values, els) {
        count++;
      });
      $.module.search();
      setTimeout(function() {
        expect(count).to.equal(1);
        done();
      });
    });

    it('should allow manually invoking module check', function(done) {
      var callCount = 0;
      $.module('injectedModule', function(el, values, els) {
        callCount++;
      });
      $('body').append('<div data-module="injectedModule"></div>');
      $.module.search();
      setTimeout(function() {
        expect(callCount).to.equal(1);
        done();
      }, 100);
    });

    it('should trigger $(window).on(init.module) when a module is run', function(done) {
      var initCount = 0;
      var runCount = 0;
      $(window).on('init.module', function(e, name, el) {
        initCount++;
        expect(typeof e).to.equal('object');
        expect(typeof name).to.equal('string');
        expect(typeof el).to.equal('object');
      });
      $.module('moduleInit', function() {
        runCount++;
      });
      setTimeout(function() {
        expect(initCount).to.equal(runCount);
        $(window).off('init.module');
        done();
      });
    });
  });

});
