import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import HalcyonDirectionalNavigation from '../HalcyonDirectionalNavigation';

const defaultProps = {
  onNext : () => {},
  onPrevious : () => {}
};

function renderComponent (propOverrides) {
  const props = {...defaultProps, ...propOverrides};

  return TestUtils.renderIntoDocument(<HalcyonDirectionalNavigation {...props} />);
}

function shallowRenderComponent (propOverrides) {
  const props = {...defaultProps, ...propOverrides};

  const renderer = TestUtils.createRenderer();
  renderer.render(<HalcyonDirectionalNavigation {...props} />);
  return renderer.getRenderOutput();
}

describe('(Component) HalcyonDirectionalNavigation', function () {
  let component, rendered;

  beforeEach(function () {
    component = shallowRenderComponent({});
    rendered  = renderComponent({});
  });

  describe('(Lifecycle) Render', function () {
    it('Should render as a div.', function () {
      expect(component.type).to.equal('div');
    });

    it('Should have a classname with "halcyon__directional-navigation".', function () {
      expect(component.props.className).to.match(/halcyon__directional-navigation/);
    });

    describe('Previous Button', function () {
      const findPreviousButton = (tree) => {
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'button');

        return buttons.filter(b => b.textContent.match(/Previous/))[0];
      };

      it('Should be a DOM component.', function () {
        const previous = findPreviousButton(rendered);

        expect(TestUtils.isDOMComponent(previous)).to.be.true;
      });

      it('Should be enabled by default.', function () {
        const previous = findPreviousButton(rendered);

        expect(previous.attributes.disabled).to.be.undefined;
      });

      it('Should be disabled if this.props.disablePrevious is true.', function () {
        const previous = findPreviousButton(renderComponent({
          disablePrevious : true
        }));

        expect(previous.attributes.disabled).to.exist;
      });

      it('Should be disabled if this.props.disabled is true.', function () {
        const previous = findPreviousButton(renderComponent({
          disabled : true
        }));

        expect(previous.attributes.disabled).to.exist;
      });

      it('Should call props.onPrevious on click.', function () {
        var clicked = false;
        const previous = findPreviousButton(renderComponent({
          onPrevious : () => { clicked = true }
        }));

        expect(clicked).to.be.false;
        TestUtils.Simulate.click(previous);
        expect(clicked).to.be.true;
      });

      it('Should not be clickable if disabled.', function () {
        var clicked = false;
        const previous = findPreviousButton(renderComponent({
          disabled   : true,
          onPrevious : () => { clicked = true }
        }));

        expect(clicked).to.be.false;
        TestUtils.Simulate.click(previous);
        expect(clicked).to.be.false;
      });
    });

    describe('Next Button', function () {
      const findNextButton = (tree) => {
        const buttons = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'button');

        return buttons.filter(b => b.textContent.match(/Next/))[0];
      };

      it('Should be a DOM component.', function () {
        const next = findNextButton(rendered);

        expect(TestUtils.isDOMComponent(next)).to.be.true;
      });

      it('Should be enabled by default.', function () {
        const next = findNextButton(rendered);

        expect(next.attributes.disabled).to.be.undefined;
      });

      it('Should be disabled if this.props.disableNext is true.', function () {
        const next = findNextButton(renderComponent({
          disableNext : true
        }));

        expect(next.attributes.disabled).to.exist;
      });

      it('Should be disabled if this.props.disabled is true.', function () {
        const next = findNextButton(renderComponent({
          disabled : true
        }));

        expect(next.attributes.disabled).to.exist;
      });

      it('Should call props.onNext on click.', function () {
        var clicked = false;
        const next = findNextButton(renderComponent({
          onNext : () => { clicked = true; }
        }));

        expect(clicked).to.be.false;
        TestUtils.Simulate.click(next);
        expect(clicked).to.be.true;
      });

      it('Should not be clickable if disabled.', function () {
        var clicked = false;
        const next = findNextButton(renderComponent({
          disabled : true,
          onNext   : () => { clicked = true; }
        }));

        expect(clicked).to.be.false;
        TestUtils.Simulate.click(next);
        expect(clicked).to.be.false;
      });
    });
  });
});
