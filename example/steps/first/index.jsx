import React from 'react';
import { Step as HalcyonStep } from 'halcyon';
import TitleInput from './title-input';

class FirstStep extends HalcyonStep {
  constructor () {
    super();
  }

  shouldStepExit () {
    const { title } = this.props.model;

    if (!title || title.length === 0) {
      console.error('Validation Error: a title is required to continue.');
      return false;
    }
    return true;
  }

  render () {
    const { model } = this.props;

    return (
      <div>
        <TitleInput value={model.title} leaf={['title']} />
      </div>
    );
  }
};

export default FirstStep;
