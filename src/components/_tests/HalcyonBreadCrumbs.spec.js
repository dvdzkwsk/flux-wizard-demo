import Immutable  from 'immutable';
import React      from 'react';
import TestUtils  from 'react-addons-test-utils';
import { HalcyonWizard } from '../../index';
import { createMockWizardClass, getStoreState } from './_mock-wizard';
import {
  HalcyonBreadcrumbs,
  default as ConnectedHalcyonBreadcrumbs
} from '../HalcyonBreadcrumbs';

function renderComponent (component) {
  return TestUtils.renderIntoDocument(component)
}

function shallowRenderComponent (component, props = {}) {
  const shallowRenderer = TestUtils.createRenderer();

  shallowRenderer.render(component);
  return shallowRenderer.getRenderOutput();
}

// ------------------------------------
// Base HalcyonBreadcrumbs Component Tests
// ------------------------------------
describe('(Component) HalcyonBreadcrumbs', function () {
  const _model = { firstName : 'Michael' };
  let component, rendered, defaultProps, wizards, MockWizard;

  const shallowRenderWith = (props = {}) => {
    const mergedProps = {...defaultProps, ...props};

    return shallowRenderComponent(<HalcyonBreadcrumbs {...mergedProps} />);
  };

  const renderWith = (props) => {
    const mergedProps = {...defaultProps, ...props};

    return renderComponent(<HalcyonBreadcrumbs {...mergedProps} />);
  };

  beforeEach(function () {
    MockWizard = createMockWizardClass();

    renderComponent(<MockWizard model={_model}/>);
    wizards = getStoreState().halcyon;

    defaultProps = { wizards };
    component = shallowRenderWith();
    rendered  = renderWith();
  });

  it('(meta) Halcyon reducer should have 1 instantiated wizard.', function () {
    expect(wizards.size).to.equal(1);
  });

  describe('getBreadcrumbsForWizards()', function () {
    var breadcrumbs;

    beforeEach(function () {
      breadcrumbs = rendered.getBreadcrumbsForWizards(wizards);
    });

    it('Should return a regular JavaScript array.', function () {
      expect(breadcrumbs).to.be.an('array');
    });

    it('Should return two breadcrumbs for each wizard.', function () {
      expect(breadcrumbs).to.have.length(wizards.size * 2);
      expect(breadcrumbs).to.have.length.gt(0);
    });

    describe('Breadcrumb Data Item', function () {
      it('Should be an object.', function () {
        breadcrumbs.forEach(x => {
          expect(x).to.be.an('object');
        });
      });

      it('Should have a property "instance"', function () {
        breadcrumbs.forEach(x => {
          expect(x).to.have.property('instance');
        });
      });

      it('Should define "instance" as a CompositeComponent.', function () {
        breadcrumbs.forEach(x => {
          expect(TestUtils.isCompositeComponent(x.instance)).to.be.true;
        });
      });

      it('Should have a property "title"', function () {
        breadcrumbs.forEach(x => {
          expect(x).to.have.property('title');
        });
      });

      it('Should define "title" as a string', function () {
        breadcrumbs.forEach(x => {
          expect(x.title).to.be.a('string');
        });
      });
    });
  });

  describe('(Lifecycle) Render', function () {

    it('Should render as an <ol>.', function () {
      expect(component.type).to.equal('ol');
    });



  });
});

// ------------------------------------
// Connected HalcyonBreadcrumbs Component Tests
// ------------------------------------
describe('(Connected Component) HalcyonBreadcrumbs', function () {
  it('Should have a test.', function () {
    expect(true).to.be.true;
  });
});
