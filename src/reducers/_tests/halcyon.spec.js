import React          from 'react';
import TestUtils      from 'react-addons-test-utils';
import halcyonReducer from '../halcyon';
import Immutable      from 'immutable';
import mockReducer    from './_mock-reducer';
import {
  createWizard,
  destroyWizard,
  setWizardModel,
  changeWizardStep,
  openWizard
} from '../../actions/wizard';

const reducer = mockReducer(halcyonReducer);

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
        expect(_item.get('instance')).to.exist;
      });

      it('Should reference the "instance" property provided in the action payload.', function () {
        expect(_item.get('instance')).to.equal(_mockInstance);
      });

      it('Should define a property "stepIndex".', function () {
        expect(_item.get('stepIndex')).to.exist;
      });

      it('Should initialize the property "stepIndex" to 0.', function () {
        expect(_item.get('stepIndex')).to.be.a.number;
        expect(_item.get('stepIndex')).to.equal(0);
      });

      it('Should define a property "depth".', function () {
        expect(_item.get('depth')).to.exist;
      });

      it('Should define the property depth as item\'s index in the list of wizards.', function () {
        expect(_item.get('depth')).to.equal(0);

        expect(reducer.run(createWizard()).get(1).get('depth')).to.equal(1);
        expect(reducer.run(createWizard()).get(2).get('depth')).to.equal(2);
      });

      it('Should define a property "model".', function () {
        expect(_item.get('model')).to.exist;
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
      expect(afterSecondAdd.get(1)).to.exist;
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

    it('Should delete the state list entry whose property "instance" matches the target instance.', function () {
      const before   = reducer.getState();
      const deletedA = reducer.run(destroyWizard(_a));

      // Delete _a
      expect(deletedA.size).to.equal(2);
      expect(deletedA.find(w => w.get('instance') === _a)).to.be.undefined;
      expect(deletedA.find(w => w.get('instance') === _b)).to.exist;
      expect(deletedA.find(w => w.get('instance') === _c)).to.exist;

      // Delete _b
      const deletedB = reducer.run(destroyWizard(_b));
      expect(deletedB.size).to.equal(1);
      expect(deletedB.find(w => w.get('instance') === _a)).to.be.undefined;
      expect(deletedB.find(w => w.get('instance') === _b)).to.be.undefined;
      expect(deletedB.find(w => w.get('instance') === _c)).to.exist;

      // Attempt to delete _b again
      const deleteBAgain = reducer.run(destroyWizard(_b));
      expect(deleteBAgain.size).to.equal(1);
      expect(deleteBAgain.find(w => w.get('instance') === _a)).to.be.undefined;
      expect(deleteBAgain.find(w => w.get('instance') === _b)).to.be.undefined;
      expect(deleteBAgain.find(w => w.get('instance') === _c)).to.exist;
    });

  });

  describe('HALCYON_WIZARD_SET_MODEL', function () {
    var _a, _b, _c; // mock instances

    beforeEach(function () {
      reducer.run(createWizard(_a = {}));
      reducer.run(createWizard(_b = {}));
      reducer.run(createWizard(_c = {}));
    });

    it('(meta) Should initialize test with 3 mock wizards.', function () {
      expect(reducer.getState().size).to.equal(3);
    });

    it('Should set the supplied model on the entry that matches the target instance.', function () {
      const beforeModel = reducer.getState().first().get('model');
      const newModel    = {};
      const afterModel  = reducer.run(setWizardModel(_a, newModel)).first().get('model');

      expect(afterModel).to.not.equal(beforeModel);
      expect(afterModel).to.equal(newModel);
    });

    it('Should return a new state reference.', function () {
      const before = reducer.getState();
      const after  = reducer.run(setWizardModel(_a, {}));

      expect(before).to.not.equal(after);
    });

    it('Should not affect the models of the other entries.', function () {

      // models from the old state
      const aModel   = reducer.getState().get(0).get('model');
      const bModel   = reducer.getState().get(1).get('model');
      const cModel   = reducer.getState().get(2).get('model');
      const newModel = {};

      // models from the new state
      const after       = reducer.run(setWizardModel(_a, newModel));
      const afterAModel = after.get(0).get('model');
      const afterBModel = after.get(1).get('model');
      const afterCModel = after.get(2).get('model');

      expect(afterAModel).to.equal(newModel);
      expect(afterAModel).to.not.equal(aModel);

      expect(afterBModel).to.equal(bModel);
      expect(afterCModel).to.equal(cModel);
    });
  });

  describe('HALCYON_WIZARD_STEP_CHANGE', function () {
    var _a, _b, _c; // mock instances

    beforeEach(function () {
      reducer.run(createWizard(_a = {}));
      reducer.run(createWizard(_b = {}));
      reducer.run(createWizard(_c = {}));
    });

    it('(meta) Should initialize test with 3 mock wizards.', function () {
      expect(reducer.getState().size).to.equal(3);
    });

    it('Should update the "stepIndex" property on the target instance to match "index" in the action payload.', function () {
      expect(reducer.run(changeWizardStep(_a, 1)).first().get('stepIndex')).to.equal(1);
      expect(reducer.run(changeWizardStep(_a, 2)).first().get('stepIndex')).to.equal(2);
      expect(reducer.run(changeWizardStep(_a, 0)).first().get('stepIndex')).to.equal(0);
    });

    it('Should return a new state reference if the provided index is different from the current value.', function () {
      const before = reducer.getState();
      const after  = reducer.run(changeWizardStep(_a, 1));

      expect(before).to.not.equal(after);
    });

    it('Should not return a new state reference if the provided index is the same as the current value.', function () {
      const before = reducer.getState();
      const after  = reducer.run(changeWizardStep(_a, 0));

      expect(before).to.equal(after);
    });

    it('Should not affect the "stepIndex" property in the other entries.', function () {

      // indexes from the original state
      const beforeAIndex = reducer.getState().get(0).get('stepIndex');
      const beforeBIndex = reducer.getState().get(1).get('stepIndex');
      const beforeCIndex = reducer.getState().get(2).get('stepIndex');
      const newAIndex    = 2;

      // stepIndexes from the new state
      const after       = reducer.run(changeWizardStep(_a, newAIndex));
      const afterAIndex = after.get(0).get('stepIndex');
      const afterBIndex = after.get(1).get('stepIndex');
      const afterCIndex = after.get(2).get('stepIndex');

      expect(afterAIndex).to.equal(newAIndex);
      expect(afterAIndex).to.not.equal(beforeAIndex);

      expect(afterBIndex).to.equal(beforeBIndex);
      expect(afterCIndex).to.equal(beforeCIndex);
    });
  });
});
