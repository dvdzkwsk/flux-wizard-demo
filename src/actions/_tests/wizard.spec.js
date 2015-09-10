import {
  createWizard,
  destroyWizard,
  setWizardModel,
  changeWizardStep
} from '../wizard';

describe('(Actions) HalcyonWizard', function () {

  describe('createWizard', function () {
    it('Should be a function.', function () {
      expect(createWizard).to.be.a('function');
    });

    it('Should return an action object.', function () {
      const action = createWizard();

      expect(action).to.be.an('object');
      expect(action.type).to.be.a('string');
      expect(action.payload).to.be.an('object');
    });

    it('Should specify an action type of "HALCYON_WIZARD_CREATE".', function () {
      const action = createWizard();

      expect(action.type).to.equal('HALCYON_WIZARD_CREATE');
    });

    it('Should set the first argument as the payload\'s "instance" property.', function () {
      const instance = {};
      const action   = createWizard(instance);

      expect(action.payload.instance).to.equal(instance);
    });

    it('Should set the second argument as the payload\'s "model" property.', function () {
      const model  = {};
      const action = createWizard(null, model);

      expect(action.payload.model).to.equal(model);
    });
  });

  describe('destroyWizard', function () {
    it('Should be a function.', function () {
      expect(destroyWizard).to.be.a('function');
    });

    it('Should return an action object.', function () {
      const action = destroyWizard();

      expect(action).to.be.an('object');
      expect(action.type).to.be.a('string');
      expect(action.payload).to.be.an('object');
    });

    it('Should specify an action type of "HALCYON_WIZARD_DESTROY".', function () {
      expect(destroyWizard().type).to.equal('HALCYON_WIZARD_DESTROY');
    });

    it('Should set the first argument as the payload\'s "instance" property.', function () {
      const instance = {};
      const action   = destroyWizard(instance);

      expect(action.payload.instance).to.equal(instance);
    });
  });

  describe('setWizardModel', function () {
    it('Should be a function.', function () {
      expect(setWizardModel).to.be.a('function');
    });

    it('Should return an action object.', function () {
      const action = setWizardModel();

      expect(action).to.be.an('object');
      expect(action.type).to.be.a('string');
      expect(action.payload).to.be.an('object');
    });

    it('Should specify an action type of "HALCYON_WIZARD_SET_MODEL".', function () {
      expect(setWizardModel().type).to.equal('HALCYON_WIZARD_SET_MODEL');
    });

    it('Should set the first argument as the payload\'s "instance" property.', function () {
      const instance = {};
      const action   = setWizardModel(instance);

      expect(action.payload.instance).to.equal(instance);
    });

    it('Should set the second argument as the payload\'s "model" property.', function () {
      const model = {};

      expect(setWizardModel(null, model).payload.model).to.equal(model);
    });
  });

  describe('changeWizardStep', function () {
    it('Should be a function.', function () {
      expect(changeWizardStep).to.be.a('function');
    });

    it('Should return an action object.', function () {
      const action = changeWizardStep();

      expect(action).to.be.an('object');
      expect(action.type).to.be.a('string');
      expect(action.payload).to.be.an('object');
    });

    it('Should specify an action type of "HALCYON_WIZARD_STEP_CHANGE".', function () {
      expect(changeWizardStep().type).to.equal('HALCYON_WIZARD_STEP_CHANGE');
    });

    it('Should set the first argument as the payload\'s "instance" property.', function () {
      const instance = {};
      const action   = changeWizardStep(instance);

      expect(action.payload.instance).to.equal(instance);
    });

    it('Should set the second argument as the payload\'s "index" property.', function () {
      expect(changeWizardStep(null, 0).payload.index).to.equal(0);
      expect(changeWizardStep(null, 2).payload.index).to.equal(2);
    });
  });
});
