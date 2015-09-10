import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import HalcyonStepSelector from '../HalcyonStepSelector';

const onSelect = () => {};
const defaultProps = {
  steps    : [
    { props : { title : 'A' }},
    { props : { title : 'B' }}
  ],
  onSelect : onSelect
};

function renderComponent (propOverrides) {
  const props = {...defaultProps, ...propOverrides};

  console.log(props.onSelect.toString());
  return TestUtils.renderIntoDocument(<HalcyonStepSelector {...props} />);
}

function shallowRenderComponent (propOverrides) {
  const props = {...defaultProps, ...propOverrides};

  const renderer = TestUtils.createRenderer();
  renderer.render(<HalcyonStepSelector {...props} />);
  return renderer.getRenderOutput();
}

describe('(Component) HalcyonStepSelector', function () {
  let component, rendered;

  beforeEach(function () {
    component = shallowRenderComponent({});
    rendered  = renderComponent({});
  });

  describe('(Lifecycle) Render', function () {
    it('Should render to the DOM.', function () {
      expect(rendered).to.exist;
    });

    it('Should render as an <ol>.', function () {
      expect(component.type).to.equal('ol');
    });

    it('Should render a direct child component for each step.', function () {
      expect(component.props.children).to.have.length(2);
    });

    describe('Step Title Card', function () {
      let stepComponents, renderedSteps;

      beforeEach(function () {
        stepComponents = component.props.children;
        renderedSteps  = TestUtils.scryRenderedDOMComponentsWithClass(rendered, 'halcyon-step-selector__card');
      });

      it('Should render as a <div>.', function () {
        stepComponents.forEach(node => {
          expect(node.type).to.equal('div');
        });
      });

      it('Should have a numerical attribute "key" matching the step index.', function () {
        stepComponents.forEach((node, idx) => {
          expect(+node.key).to.equal(idx);
        });
      });

      it('Should have a bound onClick handler.', function () {
        stepComponents.forEach(node => {
          expect(node.props.onClick).to.be.a('function');
        });
      });

      it('Should call props.onSelect when clicked.', function () {
        let clicked = 0;

        const customRender = renderComponent({
          onSelect : () => clicked++
        });
        const customSteps = TestUtils.scryRenderedDOMComponentsWithClass(
          customRender, 'halcyon-step-selector__card'
        );

        customSteps.forEach((node, idx) => {
          TestUtils.Simulate.click(node);
          expect(clicked).to.equal(idx + 1);
        });

        expect(clicked).to.be.gt(0);
        expect(clicked).to.equal(stepComponents.length);
      });

      it('Should render each step\'s "title" property in an h3.', function () {
        const titleNodes = TestUtils.scryRenderedDOMComponentsWithTag(rendered, 'h3');

        expect(titleNodes).to.exist;
        expect(titleNodes).to.not.be.empty;

        titleNodes.forEach((node, idx) => {
          expect(node.textContent).to.equal(defaultProps.steps[idx].props.title);
        });
      });
    });
  });
});
