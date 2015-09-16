import React from 'react';

// TODO: general cleanup
// TODO: documentation
function createStepComponent (name, Component) {
  return class HalcyonStep extends React.Component {
    static defaultProps = {
      title : name
    }

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
        !nextState.dirty &&
        this.state.model !== nextState.model
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

    setModel (model) {
      this.setState({ model });
    }

    setProperty (path, value) {
      const pathArr = Array.isArray(path) ? path : path.split('.');

      this.setState({
        model : this.state.model.setIn(pathArr, value)
      });
    }

    bindTo (path) {
      const pathArr = Array.isArray(path) ? path : path.split('.');

      return {
        value    : this.state.model.getIn(pathArr),
        onChange : (e) => this.setProperty(pathArr, e.target.value)
      };
    }

    resetModel () {
      this.setState({
        dirty : false,
        model : this.props.model
      });
    }

    renderResetModelButton () {
      if (this.state.dirty) {
        return (
          <button className='btn btn-block btn-default halcyon__step__reset'
                  onClick={::this.resetModel}>
            Undo Changes
          </button>
        );
      }
    }

    render () {
      return (
        <div>
          <Component ref='step'
                     model={this.state.model.toJS()}
                     setModel={::this.setModel}
                     setProperty={::this.setProperty}
                     bindTo={::this.bindTo} />
          {this.renderResetModelButton()}
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
