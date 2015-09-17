import React     from 'react';
import Immutable from 'immutable';
import invariant from 'invariant';

function createStepComponent (name, Component) {
  return class HalcyonStep extends React.Component {
    static propTypes = {
      name  : React.PropTypes.string
    }

    static defaultProps = {
      title : name
    }

    constructor () {
      super();
      this.state = {
        dirty : false
      };
    }

    /**
    * We don't want to mutate the canonincal (pure) Wizard model, so we
    * store it in local state. This provides the added benefit of a free
    * "undo changes" since we can reset to the wizard model if the local
    * model diverges. One additional benefit of this is that the wizard does
    * not have to worry about copying its model before sending it to the step,
    * thereby eliminating extra checks from the wizard when a step is cancelled.
    */
    componentWillMount () {
      const { model } = this.props;

      invariant(
        Immutable.Map.isMap(model) || Immutable.List.isList(model),
        'Model provided to step must be an Immutable.Map or Immutable.List'
      );
      this.setState({ model });
    }

    /**
    * Sets local dirty state based on whether or not the model has changed
    * from the previous state.
    */
    componentDidUpdate (nextProps, nextState) {
      if (
        !nextState.dirty &&
        this.state.model !== nextState.model
      ) {
        this.setState({ dirty : true });
      }
    }

    /**
    * @returns {Boolean} whether or not the current step is valid. If the
    * step component does not provide an `isStepValid` method, it will return
    * true by default.
    */
    isStepValid () {
      if (typeof this.refs.step.isStepValid === 'function') {
        return this.refs.step.isStepValid();
      }
      return true;
    }

    /**
    * @returns {Boolean} whether or not the current step can be safely exited.
    * If the step component does not provide a `shouldStepExit` method, it will
    * return true by default. Use this to prevent navigation away from steps
    * that are performing asynchronous operations or have some other limiting
    * factor that must complete before the step can safely exit. Note that
    * this is entirely separate from whether or not the step is valid.
    */
    shouldStepExit () {
      if (typeof this.refs.step.shouldStepExit === 'function') {
        return this.refs.step.shouldStepExit();
      }
      return true;
    }

    /**
    * @param {Immutable.Map|Immutable.List} model - updated model to apply
    * to the step.
    *
    * @returns {undefined} no return value, but produces a re-render.
    */
    setModel (model) {
      this.setState({ model });
    }

    /**
    * @param {String|Array} path - sequence of properties to access on the
    * model when setting the target value.
    * @param {any} value - value to apply to the target model property.
    *
    * @returns {undefined} no return value, but produces a re-render by
    * updating the internal model.
    */
    setProperty (path, value) {
      const pathArr = Array.isArray(path) ? path : path.split('.');

      this.setState({
        model : this.state.model.setIn(pathArr, value)
      });
    }

    /**
    * @param {String|Array} path - sequence of properties to access on the
    * model when getting/setting the target value.
    *
    * @returns {Object} properties to apply to an input element.
    * @returns {Object.value} - current value of the property on the model.
    * @returns {Object.onChange} - event handler that receives a synthetic
    * onChange event and applies the event's target value to the model.
    */
    bindTo (path) {
      const pathArr = Array.isArray(path) ? path : path.split('.');

      return {
        value    : this.state.model.getIn(pathArr),
        onChange : (e) => this.setProperty(pathArr, e.target.value)
      };
    }

    /**
    * Discards the any model modifications in the current step session by
    * re-applying the model received through props from the wizard component.
    *
    * @returns {undefined} no return value but produces a re-render.
    */
    resetModel () {
      this.setState({
        dirty : false,
        model : this.props.model
      });
    }

    /**
    * @returns {DOM} renders a "reset model" button that will discard all
    * changes applied to the model during this step session.
    */
    renderResetModelButton () {
      return (
        <button className='btn btn-block btn-default halcyon__step__reset'
                onClick={::this.resetModel}>
          Undo Changes
        </button>
      );
    }

    render () {
      return (
        <div>
          <Component ref='step'
                     model={this.state.model.toJS()}
                     setModel={::this.setModel}
                     setProperty={::this.setProperty}
                     bindTo={::this.bindTo} />
          {this.state.dirty && this.renderResetModelButton()}
        </div>
      );
    }
  };
}

export default function halcyonStepDecorator (name) {
  return function createHalcyonStep (Component) {
    return createStepComponent(name, Component);
  };
}
