import React from 'react';
import * as Halcyon from './index';

describe('(API) Halcyon', function () {
  it('Should export a function "HalcyonWizard".', function () {
    expect(Halcyon.HalcyonWizard).to.be.a('function');
  });

  it('Should export a function "halcyonStep".', function () {
    expect(Halcyon.halcyonStep).to.be.a('function');
  });

  it('Should export an object "reducers".', function () {
    expect(Halcyon.reducers).to.be.an('object');
  });
});
