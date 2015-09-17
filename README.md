Halcyon
=======
[![Build Status](https://travis-ci.org/davezuko/halcyon.svg?branch=master)](https://travis-ci.org/davezuko/halcyon)

A lightweight Wizard platform for React.

Table of Contents
-----------------
1. [Features](#features)
1. [Requirements](#requirements)
1. [Installation](#installation)
1. [Components](#components)
  * [HalcyonWizard](#halcyon-wizard)
    * [Attributes](#attributes)
  * [HalcyonStep](#halcyon-step)
    * [Injected Properties](#injected-properties)
    * [Hooks](#hooks)
1. [Lifecycle](#lifecycle)
1. [FAQ](#faq)

Features
--------

* Automatic model management
  * Emphasizes immutability
    * Wizard model remains pure at all times
    * All changes to the core model produce a new reference
  * Steps provide "sessions"
    * Higher order step components handle the exchange between the immutable
      model received from the wizard and what's injected into your step.
    * Model changes are performed by a clean API injected through props
    * Free "undo changes" ability to revert all changes made in a step session
* Intuitive lifecycle hooks for step components
* Support for nested wizards
* Generates core UI components
  * Automatic breadcrumb generation
  * Step selector sidebar panel
  * Action buttons (previous, next, cancel, submit)
* Accepts callback hooks for core wizard events
* Built with reusability in mind
  * Steps can be dropped into any wizard and rearranged at will
  * Core wizard functionality is decoupled from submission and cancellation events
* Easily integrated into a larger Redux application


Requirements
------------

**Node**: Node.js `^4.0.0`

**Build**: Build system capable of performing ES6 to ES5 transpilation. If you wish to use the decorator syntax (e.g. with `@halcyonStep`) you must enable support for it in your transpiler (Babel, Traceur).

**Redux**: The wizard currently relies on Redux for state management. See [Installation](#installation) for more details on how to integrate it.

Installation
------------

Components
----------

### HalcyonWizard

#### Example

```js
import React             from 'react';
import { HalcyonWizard } from 'halcyon';
import FirstStep         from './YourFirstStep';
import SecondStep        from './YourSecondStep';

class YourWizard extends React.Component {
  constructor () {
    super();
  }

  // This will be called if your wizard is cancelled for any reason.
  onCancel () {}

  // This will be called when the wizard is able to submit. The new model
  // will be passed to the callback.
  onSubmit (model) {}

  // Let's just assume that you have an object (POJO) on your state that
  // can be used as the model for the wizard.
  render () {
    return (
      <HalcyonWizard model={this.state.model}
                     onCancel={::this.onCancel}
                     onSubmit={::this.onSubmit}>
        <FirstStep />
        <SecondStep />
      </HalcyonWizrd>
    );
  }
}
```

#### Attributes

##### `[Object] model`
A plain JavaScript object. Halcyon makes no distinction between loading/loaded states for your model; instead, you should only render the wizard once your model is ready. If you pass a POJO, halcyon will instantiate it as an Immutable object internally. This way, the model you provide is _never_ mutated.

##### `[Function] onSubmit`
Handler invoked when the wizard submits. This will provide the wizard model as its only argument.

##### `[Function] onCancel`
Handler invoked when the wizard is cancelled for any reason.

##### `[Int] stepIndex`
Optional step override. Halcyon will only notice this property the first time it is received, allowing you to modify the initial step or override the current one, but the wizard will be allowed to proceed as normal afterward.

### HalcyonStep

#### Example
```js
import React           from 'react';
import { halcyonStep } from 'halcyon';

@halcyonStep('Default Title')
class YourStep extends React.Component {
  constructor () {
    super();
  }

  // the halcyonStep higher order component injects the model and
  // convenience functions into your component. The great thing is, by updating
  // your model via this API the internal model remains immutable the whole
  // time, but you don't have to worry about it! Just _react_ to its changes.
  render () {
    const { model } = this.props;

    return (
      <div>
        <input {...this.bindTo('firstName')} />
      </div>
    );
  }
}
```

#### Injected Properties

**NOTE**: I'm documenting `Rerender` as a return type for the function signatures. This isn't technically correct, but the functions produce the controlled side effect of updating the internal step model, which then triggers a rerender. They technically return `undefined`, since you are not expected to manually receive the updated model.

##### `[Object] model`
POJO version of the current model.

##### `[Function] setProperty : (String|Array) -> * -> Rerender`
Function that takes two parameters, the first is either an array of nested properties (single level is OK) or a string whose properties are dot-separated. This will produce a new representation of your model and subsequently trigger a re-render.

**NOTE**: This method will trigger a re-render for your step.
**NOTE**: This method is simply a wrapper around ImmutableJS's "setIn" method in order to support string-based paths.

Example:
```js
// this.props.model = { firstName : 'Michael' };

// update the property first Name
this.props.setValue('firstName', 'Dwight');

// update a nested property (objects will be created if necessary)
this.props.setValue('address.zipcode', '49024');

/**
updated model
{
  firstName : 'Dwight',
  address   : {
    zipcode : '49024'
  }
}
*/
```

##### `bindTo : (String|Array) -> ({ onChange : (Event -> Rerender), value : * })`
Returns an object to be applied to as attributes to an input. Contains the current value of the target property (as "value") and an event handler that will apply the event's target value to the model with onChange. Uses `setProperty` internally.

**NOTE**: This method will trigger a re-render for your step.

##### `[Function] setModel : Object -> Rerender`
Sets the model to the provided object

**NOTE**: This method will trigger a re-render for your step.

Lifecycle
---------

FAQ
---
