import React          from 'react';
import TestUtils      from 'react-addons-test-utils';
import halcyonReducer from '../halcyon';
import Immutable      from 'immutable';
import {
  createWizard,
  destroyWizard,
  setWizardModel,
  changeWizardStep,
  openWizard
} from '../../actions/wizard';

const reducer = (function (reducer, _state) {
  const runWithState = (state, action) => _state = reducer(state, action);

  return {
    run    : (action) => runWithState(_state, action),
    runWithState : runWithState,
    resetState   : runWithState.bind(null, undefined, {}),
    getState     : () => _state
  };
})(halcyonReducer);

describe('(Reducer) Halcyon', function () {

  beforeEach(function () {
    reducer.resetState();
  });

  describe('Initial State', function () {

    it('Should be an instance of Immutable.List.', function () {
      expect(Immutable.List.isList(reducer.getState())).to.be.true;
    });

    it('Should be an empty list.', function () {
      expect(reducer.getState().size).to.equal(0);
    });
  });

  describe('HALCYON_WIZARD_CREATE', function () {

    it('Should return a new state reference.', function () {
      const before = reducer.getState();
      const after  = reducer.run(createWizard());

      expect(before).to.not.equal(after);
    });

    it('Should initialize the new entry as an Immutable.Map.', function () {
      const state = reducer.run(createWizard());

      expect(Immutable.Map.isMap(state.get(0))).to.be.true;
    });

    describe('Initialized Properties', function () {
      var _mockInstance, _mockModel, _item;

      beforeEach(function () {
        _mockInstance = {};
        _mockModel = {};

        _item = reducer.run(createWizard(_mockInstance, _mockModel)).first();
      });

      it('Should define a property "instance".', function () {
        expect(_item.get('instance')).to.be.defined;
      });

      it('Should reference the "instance" property provided in the action payload.', function () {
        expect(_item.get('instance')).to.equal(_mockInstance);
      });

      it('Should define a property "stepIndex".', function () {
        expect(_item.get('stepIndex')).to.be.defined;
      });

      it('Should initialize the property "stepIndex" to 0.', function () {
        expect(_item.get('stepIndex')).to.be.a.number;
        expect(_item.get('stepIndex')).to.equal(0);
      });

      it('Should define a property "depth".', function () {
        expect(_item.get('depth')).to.be.defined;
      });

      it('Should define a property model.', function () {
        expect(_item.get('model')).to.be.defined;
      });

      it('Should reference the "model" property provided in action payload.', function () {
        expect(_item.get('model')).to.equal(_mockModel);
      });
    });

    it('Should insert a new item in the current list of wizards.', function () {
      const before = reducer.getState();
      const after  = reducer.run(createWizard());

      expect(after.size).to.equal(1);
    });

    it('Should insert the new item to the back of the list.', function () {
      const first = reducer.run(createWizard()).first();
      const afterSecondAdd = reducer.run(createWizard());

      expect(afterSecondAdd.size).to.equal(2);
      expect(afterSecondAdd.get(1)).to.be.defined;
      expect(afterSecondAdd.get(0)).to.equal(first);
      expect(afterSecondAdd.get(1)).to.not.equal(first);
    });
  });

  describe('HALCYON_WIZARD_DESTROY', function () {
    var _a, _b, _c; // mock instances

    beforeEach(function () {
      reducer.run(createWizard(_a = {}));
      reducer.run(createWizard(_b = {}));
      reducer.run(createWizard(_c = {}));
    });

    it('(meta) Should initialize test with 3 mock wizards.', function () {
      expect(reducer.getState().size).to.equal(3);
    });

    it('Should return a new state reference.', function () {
      const before = reducer.getState();

      expect(reducer.run(destroyWizard(_b))).to.not.equal(before);
    });

    it('Should return the same state reference if the target instance is not found.', function () {
      const before = reducer.getState();
      const after  = reducer.run(destroyWizard());

      expect(after.size).to.equal(3);
      expect(after).to.equal(before);
    });

  });

  describe('HALCYON_WIZARD_SET_MODEL', function () {

  });

  describe('HALCYON_WIZARD_STEP_CHANGE', function () {

  });
});
