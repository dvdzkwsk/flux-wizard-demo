Halcyon
-------
A lightweight, Flux-oriented Wizard platform for React. Wizards and steps provide clean life cycle hooks, and the flux stores are designed to support concurrent (nested) wizards.

Requirements
------------
* React ^0.13.0
* ES6 (with ES7 flags enabled) transpiler until this package bundles a dist vesion.

Getting Started
---------------
Halcyon is designed to work in a traditional Flux architecture, but doesn't implement its own dispatcher so you'll need to perform a one-time configuration to register it. Include the following at the root of your application:

```js
import Halcyon from 'halcyon';

Halcyon.registerWithDispatcher(YourDispatcher);
```

That's it! This convenience method will inform all Halcyon stores to register with your dispatcher so that Halcyon can be fully integrated with your app's life cycle.

Creating a Wizard
-----------------
Halcyon exposes a `Wizard` component class that you can extend to take advantage of included navigation, rendering, and life cycle hooks. Here's an example:

```js
import React from 'react';
import { Wizard as HalyconWizard } from 'halcyon';

class ExampleWizard extends HalyconWizard {
  constructor () {
    super();
  }
};

export default ExampleWizard;
```

If you wish to provide default steps to your wizard, you don't have to do anything special, just use React's `defaultProps`:

```js
import React from 'react';
import { Wizard as HalyconWizard } from 'halcyon';
import FirstStep from '../steps/first';
import SecondStep from '../steps/second';
import ThirdStep from '../steps/third';

class ExampleWizard extends HalyconWizard {
  constructor () {
    super();
  }
};

ExampleWizard.defaultProps = {
  steps : [FirstStep, SecondStep, ThirdStep]
};

export default ExampleWizard;
```

Creating Steps
--------------

Component Life Cycle
--------------------

### Wizard

* #### shouldWizardNavigate `(nextStepIndex)`
Determines whether or not the wizard should navigate to a new step. Returns `true` by default, but by returning `false` you can prevent navigation.

* #### wizardWillNavigate `(nextStepIndex)`
Called on the tick before the wizard navigates to a new step. At this point the wizard _will_ be navigating and cannot be stopped. Provides the next step index as an argument.

* #### wizardDidNavigate `(previousStepIndex)`
Called on the tick immediately after the wizard navigates to a new step; provides the previous step index as the only argument.

### Step
* #### shouldStepExit `(void)`
Determines whether or not a step can be navigated away from, returns `true` by default, similar to `shouldWizardNavigate`.

* #### stepWillExit `(void)`
Called on the tick before a step is exited; at this point the navigation can no longer be stopped.

Flux Action Creators
--------------------


TODO
----
* /dist version that's already transpiled
