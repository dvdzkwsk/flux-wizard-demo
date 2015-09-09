import React         from 'react';
import TestUtils     from 'react-addons-test-utils';
import Immutable     from 'immutable';
import halcyonStep   from '../HalcyonStep';
import MockComponent from './MockComponent';

const SAMPLE_MODEL = Immutable.Map({
  firstName : 'Michael',
  lastName  : 'Scott'
});

function renderIntoDocument (props) {
  return TestUtils.renderIntoDocument(
    <MockComponent {...props} />
  );
}

describe('(Decorator) halcyonStep', function () {

  describe('First Invocation', function () {
    it('Should return a function.', function () {
      expect(halcyonStep()).to.be.a.function;
    });
  });

  describe('Second Invocation', function () {
    it('Should return a React Component.', function () {
      const component = halcyonStep()();

      expect(<component />).to.have.property('type', 'component');
    });
  });

  describe('Decorated Component', function () {
    var rendered;

    beforeEach(function () {
      rendered = renderIntoDocument({ model : SAMPLE_MODEL });

      const setState = rendered.setState.bind(rendered);
      var callCount  = 0;

      rendered.awaitStateChange = function (cb) {
        rendered.setState = function (state) {
          setState(state, () => {
            callCount++;

            if (typeof cb === 'function') {
              cb(callCount);
            } else if (typeof cb === 'object') {
              cb[callCount] && cb[callCount]();
            }
          });
        };
      };
    });

    it('Should be able to be rendered into the DOM.', function () {
      expect(rendered).to.exist;
    });

    it('Should have a defaultProp title matching the first decorator\'s first argument.', function () {
      expect(MockComponent.defaultProps).to.have.property('title', 'Mock Component Title');
      rendered.setModel(SAMPLE_MODEL);
    });

    describe('Initial State', function () {
      it('Should set "dirty" to false.', function () {
        expect(rendered.state.dirty).to.be.false;
      });

      it('Should set "model" to the model received from props.', function () {
        expect(rendered.state.model).to.equal(SAMPLE_MODEL);
      });
    });

    describe('(Lifecycle) isStepValid', function () {
      it('Should be a function.', function () {
        expect(rendered.isStepValid).to.be.a('function');
      });

      it('Should return true by default.', function () {
        expect(rendered.isStepValid()).to.be.true;
      });
    });

    describe('(Lifecycle) shouldStepExit', function () {
      it('Should be a function.', function () {
        expect(rendered.shouldStepExit).to.be.a('function');
      });

      it('Should return true by default.', function () {
        expect(rendered.shouldStepExit()).to.be.true;
      });
    });

    describe('(Method) bindTo', function () {
      it('Should be a function.', function () {
        expect(rendered).to.have.property('bindTo');
        expect(rendered.bindTo).to.be.a('function');
      });
    });

    describe('(Method) setProperty', function () {
      it('Should be a function.', function () {
        expect(rendered).to.have.property('setProperty');
        expect(rendered.setProperty).to.be.a('function');
      });

      it('Should apply the new value to the target path on the internal state\'s model.', function (done) {
        rendered.awaitStateChange(function () {
          expect(rendered.state.model.get('firstName')).to.equal('Michael');
          done();
        });

        rendered.setProperty('firstName', 'Michael');
      });

      it('Should accept path as a dot-delimited string.', function (done) {
        rendered.awaitStateChange(function () {
          const model = rendered.state.model.toJS();

          expect(model.address.zipcode).to.equal('123456');
          done();
        });

        rendered.setProperty('address.zipcode', '123456');
      });

      it('Should accept path as an array of property names.', function (done) {
        rendered.awaitStateChange(function () {
          const model = rendered.state.model.toJS();

          expect(model.address.zipcode).to.equal('000123');
          done();
        });

        rendered.setProperty(['address', 'zipcode'], '000123');
      });
    });

    describe('(Method) setModel', function () {

      it('Should be a function.', function () {
        expect(rendered).to.have.property('setModel');
        expect(rendered.setModel).to.be.a('function');
      });

      it('Should update "model" to the supplied argument.', function (done) {
        rendered.awaitStateChange(function () {
          expect(rendered.state.model).to.not.equal(SAMPLE_MODEL);
          done();
        });

        rendered.setModel(Immutable.Map({ foo : 'bar' }));
      });

      it('Should apply a second state update if the model has changed.', function (done) {
        rendered.awaitStateChange(function (called) {
          if (called === 1) {
            expect(rendered.state.model).to.not.equal(SAMPLE_MODEL);
          } else if (called === 2) {
            expect(rendered.state.dirty).to.be.true;
            done();
          }
        });

        rendered.setModel(Immutable.Map({ foo : 'bar' }));
      });

      it('Should set "dirty" state to true in the second state update.', function done() {
        rendered.awaitStateChange(function (called) {
          if (called === 1) {
            expect(rendered.state.model).to.not.equal(SAMPLE_MODEL);
          } else if (called === 2) {
            expect(rendered.state.dirty).to.be.true;
            done();
          }
        });

        rendered.setModel(Immutable.Map({ foo : 'bar' }));
      });
    });

    describe('(Method) resetModel', function () {
      it('Should reset this.state.model to match this.props.model.', function (done) {
        const newModel = Immutable.Map({ foo : 'bar' });

        rendered.awaitStateChange({
          1 : () => {
            expect(rendered.state.model).to.not.equal(SAMPLE_MODEL);
            rendered.resetModel();
          },
          2 : () => {
            expect(rendered.state.model).to.equal(SAMPLE_MODEL);
            done();
          }
        });

        expect(rendered.state.model).to.equal(SAMPLE_MODEL);
        rendered.setModel(Immutable.Map({ foo : 'bar' }));
      });
    });

    describe('Rendering', function () {
      var findResetModelButton;

      beforeEach(function () {
        findResetModelButton = () =>
          TestUtils.findRenderedDOMComponentWithClass(rendered, 'halcyon__step__reset');
      });

      it('Should render without a reset model button if state.dirty is false.', function () {
        expect(findResetModelButton).to.throw;
      });

      it('Should render with a reset model button if state.dirty is true.', function (done) {
        rendered.awaitStateChange({
          2 : () => {
            const button = findResetModelButton();

            expect(TestUtils.isDOMComponent(button)).to.be.true;
            done();
          }
        });

        rendered.setModel(Immutable.Map({ fizz : 'buzz' }));
      });
    });
  });
});
