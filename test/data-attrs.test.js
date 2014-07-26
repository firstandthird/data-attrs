/*global describe,it,expect,before*/
describe('data-attrs', function() {

  describe('named', function() {

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

  describe('action', function() {

    before(function(done) {
      $('a').off('click');
      done();
    });

    it('should trigger on click', function(done) {
      var a = $('[data-action="test"]');
      $.action('test', function(el) {
        expect(el).to.not.equal(undefined);
        done();
      });

      a.click();
    });

    it('should pass back values', function(done) {
      $.action('test-values', function(el, values) {
        expect(el).to.not.equal(undefined);
        expect(values).to.deep.equal({
          id: '123',
          slug: 'blah'
        });
        done();
      });

      $('[data-action="test-values"]').click();
    });
  });

});
