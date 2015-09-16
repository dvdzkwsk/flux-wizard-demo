import React     from 'react';
import Immutable from 'immutable';
import TestUtils from 'react-addons-test-utils';
import * as wizardActions from '../../actions/wizard';
import { createMockWizard, getStoreState } from './_mock-wizard';
import {
  activeWizardOnly,
  HalcyonWizard,
  default as ConnectedHalcyonWizard
} from '../HalcyonWizard';

// ------------------------------------
// Base HalcyonWizard Component Tests
// ------------------------------------
describe('(Component) HalcyonWizard', function () {
  let component, rendered, spies;


  beforeEach(function () {
    const shallowRenderer = TestUtils.createRenderer();
    const model  = { foo : 'bar' };

    spies  = {};
    props  = {
      children : ['A', 'B'].map(x => <h1>{x}</h1>),
      dispatch : (spies.dispatch = sinon.spy()),
      onSubmit : (spies.onSubmit = sinon.spy()),
      onCancel : (spies.onCancel = sinon.spy()),
      model    : model,
      wizards  : Immutable.List()
    };

    shallowRenderer.render(<HalcyonWizard {...props} />);
    component = shallowRenderer.getRenderOutput();
    rendered  = TestUtils.renderIntoDocument(<HalcyonWizard {...props} />);

    // force reset spies
    for (prop in spies) { spies[prop].reset(); }
  });


  describe('(Method) bindActionCreatorsToSelf', function () {
    let _this, fn1, fn2;

    beforeEach(function () {
      spies.dispatch.reset();
      fn1   = sinon.spy();
      fn2   = sinon.spy();
      _this = { props : { dispatch : spies.dispatch } };

      rendered.bindActionCreatorsToSelf.call(_this, {
        fn1, fn2
      });
    });

    it('Should create an object "_actions" on the instance.', function () {
      expect(_this._actions).to.be.an('object');
    });

    it('Should have properties for each function on "_actions".', function () {
      expect(_this._actions.fn1).to.be.a('function');
      expect(_this._actions.fn2).to.be.a('function');
    });

    it('Should call dispatch when an action is invoked.', function () {
      spies.dispatch.should.not.have.been.called;

      _this._actions.fn1();
      spies.dispatch.should.have.been.calledOnce;
      _this._actions.fn2();
      spies.dispatch.should.have.been.calledTwice;
      _this._actions.fn1();
      spies.dispatch.should.have.been.calledThrice;
    });

    it('Should call action with its first argument as "this".', function () {
      _this._actions.fn1();
      fn1.should.have.been.calledWith(_this);
    });

    it('Should accept aditional arguments after "this".', function () {
      _this._actions.fn1();
      fn1.should.have.been.calledWith(_this);

      _this._actions.fn1(1);
      fn1.should.have.been.calledWith(_this, 1);

      _this._actions.fn1(1, 2, 3);
      fn1.should.have.been.calledWith(_this, 1, 2, 3);
    });

    describe('Default Actions', function () {

      it('Should have actions automatically bound after mounting.', function () {
        expect(rendered._actions).to.be.an('object');
      });

      it('Should bind an action for "createWizard".', function () {
        expect(rendered._actions.createWizard).to.be.a('function');
      });

      it('Should bind an action for "destroyWizard".', function () {
        expect(rendered._actions.destroyWizard).to.be.a('function');
      });

      it('Should bind an action for "changeWizardStep".', function () {
        expect(rendered._actions.changeWizardStep).to.be.a('function');
      });

      it('Should bind an action for "setWizardModel".', function () {
        expect(rendered._actions.setWizardModel).to.be.a('function');
      });

      it('Should bind all actions from wizardActions.', function () {
        for (let prop in wizardActions) {
          expect(rendered._actions[prop]).to.be.a('function');
        }
      });

      it('Should dispatch action when action method is invoked.', function () {
        for (let prop in rendered._actions) {
          spies.dispatch.reset();
          rendered._actions[prop]();
          spies.dispatch.should.have.been.calledOnce;
        }
      });
    });
  });

  describe('(Deorator) activeWizardOnly', function () {
    let _instance;
    const fn = sinon.spy();

    beforeEach(function () {
      class Foo {
        @activeWizardOnly
        test () { fn(); return 'hello'; }
      }

      fn.reset();
      _instance = new Foo();
    });

    it('Should return a function.', function () {
      expect(_instance.test).to.be.a('function');
    });

    it('Should return null if "this.isActive()" returns false.', function () {
      _instance.isActive = () => false;

      expect(_instance.test()).to.equal(null);
    });

    it('Should not call the original method if "this.isActive() returns false".', function () {
      _instance.isActive = () => false;

      _instance.test();
      fn.should.not.have.been.called;
    });

    it('Should call the original method if "this.isActive() returns true".', function () {
      _instance.isActive = () => true;

      _instance.test();
      fn.should.have.been.calledOnce;
    });


    it('Should return the result of the original method if "this.isActive()" returns true.', function () {
      _instance.isActive = () => true;

      expect(_instance.test()).equal('hello');
    });
  });

  describe('(Method) setModel', function () {
    it('Should dispatch an action.', function () {
      spies.dispatch.should.not.have.been.called;

      rendered.setModel();

      const args = spies.dispatch.args[0];
      expect(args[0]).to.be.an('object');
      expect(args[0]).to.have.property('type');
      expect(args[0]).to.have.property('payload');
      spies.dispatch.should.have.been.called;
    });

    it('Should dispatch an action of type "HALCYON_WIZARD_SET_MODEL".', function () {
      rendered.setModel();

      const args = spies.dispatch.args[0];
      expect(args[0]).to.have.property('type', 'HALCYON_WIZARD_SET_MODEL');
    });

    it('Should convert a POJO into an Immutable object.', function () {
      let args;

      // Verify conversion from {} -> Immutable.Map
      rendered.setModel({});

      args = spies.dispatch.args[0];
      expect(Immutable.Map.isMap(args[0].payload.model)).to.be.true;

      // Verify conversion from [] -> Immutable.List
      spies.dispatch.reset();
      rendered.setModel([]);

      args = spies.dispatch.args[0];
      expect(Immutable.List.isList(args[0].payload.model)).to.be.true;
    });
  });

  describe('(Lifecycle) renderBreadcrumbs', function () {

    it('Should check the wizard active state.', function () {
      let isActive = rendered.isActive = sinon.spy();

      isActive.should.not.have.been.called;
      rendered.renderBreadcrumbs();
      isActive.should.have.been.called;
    });

    it('Should return null if the wizard is inactive.', function () {
      rendered.isActive = () => false;

      const result = rendered.renderBreadcrumbs();
      expect(result).to.be.null;
    });
  });

  describe('(Lifecycle) renderSidebar', function () {

    it('Should check the wizard active state.', function () {
      let isActive = rendered.isActive = sinon.spy();

      isActive.should.not.have.been.called;
      rendered.renderSidebar();
      isActive.should.have.been.called;
    });

    it('Should return null if the wizard is inactive.', function () {
      rendered.isActive = () => false;

      const result = rendered.renderSidebar();
      expect(result).to.be.null;
    });
  });

  describe('(Lifecycle) renderViewportFooter', function () {

    it('Should check the wizard active state.', function () {
      let isActive = rendered.isActive = sinon.spy();

      isActive.should.not.have.been.called;
      rendered.renderViewportFooter();
      isActive.should.have.been.called;
    });

    it('Should return null if the wizard is inactive.', function () {
      rendered.isActive = () => false;

      const result = rendered.renderViewportFooter();
      expect(result).to.be.null;
    });
  });

  describe('(Lifecycle) Render', function () {
    it('Should render as a <div>.', function () {
      expect(component.type).to.equal('div');
    });
  });
});

// ------------------------------------
// Connected HalcyonWizard Tests
// ------------------------------------
describe('(Connected Component) HalcyonWizard', function () {
  let _rendered, _component, _props, _spies, _model;

  beforeEach(function () {
    const MockWizard = createMockWizard();

    _spies = {};
    _props = {
      dispatch : (_spies.dispatch = sinon.spy()),
      onSubmit : (_spies.onSubmit = sinon.spy()),
      onCancel : (_spies.onCancel = sinon.spy()),
      model    : (_model = { foo : 'bar' })
    };

    const container = TestUtils.renderIntoDocument(<MockWizard {..._props} />);
    _rendered = TestUtils.findRenderedComponentWithType(container, HalcyonWizard);
  });

  it('Should create a wizard entry in the global Halcyon state.', function () {
    const state = getStoreState().halcyon;

    expect(state.size).to.equal(1);
  });

  it('Should have a local state reference that matches its global state.', function () {
    const state = getStoreState().halcyon;

    expect(Immutable.Map.isMap(_rendered._state)).to.be.true;
    expect(_rendered._state).to.equal(getStoreState().halcyon.first());
  });

  it('Should be active.', function () {
    expect(_rendered.isActive()).to.be.true;
  });

  describe('(Lifecycle) Render', function () {
    it('(meta) should have two steps.', function () {
      expect(_rendered.props.children).to.have.length(2);
    });

    it('Should render with an active class.', function () {
      const active = TestUtils.findRenderedDOMComponentWithClass(_rendered, 'halcyon-wizard--active');

      expect(active).to.exist;
    });

    describe('(Viewport) Step', function () {
      it('Should exist.', function () {
        const vp = TestUtils.findRenderedDOMComponentWithClass(
          _rendered, 'halcyon-wizard__viewport__step'
        );

        expect(vp).to.exist;
      });
    });

    describe('(Button) Previous', function () {
      let _prev;

      beforeEach(function () {
        const btns = TestUtils.scryRenderedDOMComponentsWithTag(_rendered, 'button');
        _prev = btns.filter(btn => /Previous/.test(btn.textContent))[0];
      });

      it('Should exist.', function () {
        expect(_prev).to.exist;
      });

      it('Should be disabled when wizard cannot navigate backward.', function () {
        _rendered.canNavigateBackward = () => false;

        _rendered.forceUpdate();
        expect(_prev.attributes.disabled).to.exist;
      });

      it('Should be enabled when wizard can navigate backward.', function () {
        _rendered.canNavigateBackward = () => true;

        _rendered.forceUpdate();
        expect(_prev.attributes.disabled).to.not.exist;
      });
    });

    describe('(Button) Next', function () {
      let _next;

      beforeEach(function () {
        const btns = TestUtils.scryRenderedDOMComponentsWithTag(_rendered, 'button');
        _next = btns.filter(btn => /Next/.test(btn.textContent))[0];
      });

      it('Should exist.', function () {
        expect(_next).to.exist;
      });

      it('Should be disabled when wizard cannot navigate forward.', function () {
        _rendered.canNavigateForward = () => false;

        _rendered.forceUpdate();
        expect(_next.attributes.disabled).to.exist;
      });

      it('Should be enabled when wizard can navigate forward.', function () {
        _rendered.canNavigateForward = () => true;

        _rendered.forceUpdate();
        expect(_next.attributes.disabled).to.not.exist;
      });
    });
  });
});
