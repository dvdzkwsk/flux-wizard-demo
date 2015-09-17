import React     from 'react';
import TestUtils from 'react-addons-test-utils';
import HalcyonWizardSidebar from '../HalcyonWizardSidebar';

describe('(Component) HalcyonWizardSidebar', function () {
  let _rendered, _component, _spies;

  beforeEach(function () {
    _spies = {};
    const props = {
      onSelect : (_spies.onSelect = sinon.spy()),
      steps    : ['A', 'B'].map(x => <h1>{x}</h1>)
    };


    const shallowRenderer = TestUtils.createRenderer();
    shallowRenderer.render(<HalcyonWizardSidebar {...props} />);
    _component = shallowRenderer.getRenderOutput();

    _rendered = TestUtils.renderIntoDocument(
      <HalcyonWizardSidebar {...props} />
    );
  });

  it('Should render as a <div>.', function () {
    expect(_component).to.exist;
    expect(_component.type).to.equal('div');
  });
});
