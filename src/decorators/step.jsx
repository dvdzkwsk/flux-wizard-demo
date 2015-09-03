import React from 'react';

export default function halcyonStepDecorator (Component) {
  return class HalcyonStep extends React.Component {
    constructor () {
      super();
      this.state = {
        dirty : false
      };
    }

    componentWillMount () {
      this.setState({
        model : this.props.model
      });
    }

    componentDidUpdate (nextProps, nextState) {
      if (
        !this.state.dirty &&
        this.props.model !== nextProps.model
      ) {
        this.setState({
          dirty : true
        });
      }
    }

    isStepValid () {
      if (typeof this.refs.step.isStepValid === 'function') {
        return this.refs.step.isStepValid();
      }
      return true;
    }

    shouldStepExit () {
      if (typeof this.refs.step.shouldStepExit === 'function') {
        return this.refs.step.shouldStepExit();
      }
      return true;
    }

    setProperty (path, value) {
      this.setState({
        model : this.state.model
          .setIn(path, value)
      });
    }

    bindTo (path) {
      const pathArr = Array.isArray(path) ? path : path.split('.');

      return (e) => this.setProperty(pathArr, e.target.value);
    }

    render () {
      return (
        <Component ref='step'
                   model={this.state.model.toJS()}
                   setProperty={::this.setProperty}
                   bindTo={::this.bindTo} />
      );
    }
  }
}
