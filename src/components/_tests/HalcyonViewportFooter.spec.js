import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import HalcyonViewportFooter from '../HalcyonViewportFooter';
import HalcyonDirectionalNavigation from '../HalcyonDirectionalNavigation';

function renderComponent (props) {
  return TestUtils.renderIntoDocument(<HalcyonViewportFooter {...props} />);
}

function shallowRenderComponent (props) {
  const renderer = TestUtils.createRenderer();

  renderer.render(<HalcyonViewportFooter {...props} />);
  return renderer.getRenderOutput();
}

describe('(Component) HalcyonViewportFooter', function () {
  let clickedOnNext, clickedOnPrevious, clickedOnCancel, clickedOnSubmit,
      component, rendered;

  beforeEach(function () {
    clickedOnNext = clickedOnPrevious = clickedOnCancel = clickedOnSubmit = 0;

    const defaultProps = {
      onNext     : () => clickedOnNext++,
      onPrevious : () => clickedOnPrevious++,
      onCancel   : () => clickedOnCancel++,
      onSubmit   : () => clickedOnSubmit++
    };

    component = shallowRenderComponent(defaultProps);
    rendered  = renderComponent(defaultProps);
  });

  describe('(Lifecycle) Render', function () {
    it('Should render to the DOM.', function () {
      expect(rendered).to.exist;
    });

    it('Should render as a <div>.', function () {
      expect(component.type).to.equal('div');
    });

    it('Should render a HalcyonDirectionalNavigation component.', function () {
      const nav = TestUtils.findRenderedComponentWithType(
        rendered, HalcyonDirectionalNavigation
      );

      expect(nav).to.exist;
    });

    describe('Cancel Button', function () {
      let cancel;

      beforeEach(function () {
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
          rendered, 'button'
        );

        cancel = buttons.filter(b => b.textContent.match(/Cancel/))[0];
      });

      it('Should render a cancel button in the DOM.', function () {
        expect(cancel).to.exist;
        expect(TestUtils.isDOMComponent(cancel)).to.be.true;
      });

      it('Should call props.onCancel when clicked.', function () {
        expect(clickedOnCancel).to.equal(0);
        TestUtils.Simulate.click(cancel);
        expect(clickedOnCancel).to.equal(1);
      });
    });

    describe('Submit Button', function () {
      let submit;

      beforeEach(function () {
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
          rendered, 'button'
        );

        submit = buttons.filter(b => b.textContent.match(/Submit/))[0];
      });

      it('Should render a submit button in the DOM.', function () {
        expect(submit).to.exist;
        expect(TestUtils.isDOMComponent(submit)).to.be.true;
      });

      it('Should be disabled by default.', function () {
        expect(submit.attributes.disabled).to.exist;
      });

      it('Should not call props.onSubmit when disabled and clicked.', function () {
        expect(clickedOnSubmit).to.equal(0);
        TestUtils.Simulate.click(submit);
        expect(clickedOnSubmit).to.equal(0);
      });

      it('Should be enabled when props.disableNext is true.', function () {
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
          renderComponent({
            onNext      : () => {},
            onPrevious  : () => {},
            onCancel    : () => {},
            onSubmit    : () => {},
            disableNext : true
          }),
          'button'
        );

        submit = buttons.filter(b => b.textContent.match(/Submit/))[0];
        expect(submit.attributes.disabled).to.not.exist;
      });

      it('Should called props.onSubmit when enabled and clicked.', function () {
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
          renderComponent({
            onNext      : () => {},
            onPrevious  : () => {},
            onCancel    : () => {},
            onSubmit    : () => clickedOnSubmit++,
            disableNext : true
          }),
          'button'
        );

        submit = buttons.filter(b => b.textContent.match(/Submit/))[0];
        expect(clickedOnSubmit).to.equal(0);
        TestUtils.Simulate.click(submit);
        expect(clickedOnSubmit).to.equal(1);
      });
    });
  });
});
