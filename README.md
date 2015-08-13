Halcyon
-------
A lightweight Flux-based Wizard platform for React.

Requirements
------------
* React `^0.13.0`
* ES6 (with ES7 flags enabled) transpiler until this package bundles a dist version.

Getting Started
---------------
Halcyon is designed to work in a traditional Flux architecture, and by default bundles its own dispatcher so it works even if your application is not built on Flux. If you'd prefer to incorporate Halcyon into your app's life cycle, simply use the following hook:

```js
import Halcyon from 'Halcyon';

Halcyon.registerStoresWithDispatcher(YourDispatcher);
```

That's it! This convenience method will inform all Halcyon stores to unregister with the active dispatcher and re-register with the one you provide.

Creating a Wizard
-----------------
Halcyon exposes a `Wizard` component class that you can extend to take advantage of included navigation, rendering, and life cycle hooks. Here's an example:

TODO

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

Example Wizard
--------------
Halcyon currently comes pre-packaged with an example wizard implementation. Make sure all `devDepencies`. After cloning the repo and running `npm install`, run the webpack dev server with `npm run dev` and check it out at `http://localhost:3000`.

TODO
----
* Document wizard properties (steps, model, etc.)
* Document action creators
* Wizard setup actions (async model loading)
* Wizard submission actions
* Wizard exit/cancel actions
* /dist version that's already transpiled
* Step animations?
* Default dispatcher that can be used if a dispatcher isn't registered?
* Host and link to example wizard
