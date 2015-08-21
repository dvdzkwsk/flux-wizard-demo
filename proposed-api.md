Pressing Questions
------------------

### Stack (List) or Map Implementation for Tracking Wizard State?
Do we go with an instance-based (Map) or a stack-based design? Instance-based gives us more control over individual wizards (and is more performant), but requires more work to do things that can be assumed by a stack implementation.

Benefits of a stack
-------------------
* Can make assumptions about other wizards
  - i.e. hide all navigation except for the current wizard

Drawbacks of a stack
--------------------
* Potentially limit ourselves in the future by making assumptions

1) If an action requires us to specify what instance to perform it on, then it's less performant as we have to look it up in the collection of wizards every time.
  1.a) if we mitigate this by assuming that all actions should occur on the most recently-created wizard, then we lose control over other wizards. Is this a problem?
    1.a.1) if we do this mitigation, our Flux actions/stores are no longer pure since calling an action doesn't necessarily produce the same result.

The same problems that occured with our stack-based solution in Angular will be mitigated in React since wizards delete themselves during the "componentDidUnmount" lifecycle hook (parent wizards don't unmount themselves when a child is opened, since it's an implementation detail of the step).

Step
----

#### `shouldStepClose`

#### `stepWillClose`

#### `stepDidClose`

Wizard
------

#### `shouldWizardNavigate`

#### `wizardWillNavigate`

#### `wizardDidNavigate`

#### `wizardWillSubmit`

#### `shouldWizardClose`

#### `wizardWillClose`

#### `wizardDidClose`
