var _ = require('lodash');
var Marty = require('marty');
var React = require('react');
var MultiTest = require('./multiTest');
var Bootstrap = require('react-bootstrap');
var TestConstants = require('../constants/testConstants');

var Input = Bootstrap.Input;
var Panel = Bootstrap.Panel;
var Button = Bootstrap.Button;
var ButtonToolbar = Bootstrap.ButtonToolbar;

var Actions = React.createClass({
  contextTypes: Marty.contextTypes,
  render: function () {
    return (
      <div className="actions">
        <Panel header="Create Local Action">
          <form>
            <Input ref="actionType" type="select" label="Action Types" onChange={this.changeActionType} value={this.state.actionType}>
              {this.state.actionTypes.map(function (type) {
                return <option value={type}>{type}</option>;
              })}
            </Input>
            <Input ref="arguments" type="text" label="Arguments" onChange={this.changeArguments} value={this.state.args}/>
            <ButtonToolbar className="pull-right">
              <Button onClick={this.createRandomAction}>Create random action</Button>
              <Button bsStyle="primary" onClick={this.createAction}>Create action</Button>
            </ButtonToolbar>
          </form>
        </Panel>

        <MultiTest />
      </div>
    );
  },
  changeActionType: function (e) {
    this.setState({
      actionType: this.refs.actionType.getValue()
    });
  },
  changeArguments: function () {
    this.setState({
      args: this.refs.arguments.getValue()
    });
  },
  createRandomAction: function () {
    var types = this.state.actionTypes;
    var randomType = types[Math.floor(Math.random()*types.length)];

    this.setState({ actionType: randomType });

    setTimeout(this.createAction, 10);
  },
  createAction: function () {
    var constant = this.refs.actionType.getValue();
    var actionType = _.camelCase(constant.toLowerCase());
    var args = eval('[' + this.refs.arguments.getValue() + ']');
    var actionCreator = this.context.app.testActionCreators[actionType];

    if (actionCreator) {
      actionCreator.apply(this.context.app.testActionCreators, args);
    } else {
      console.log('Could not find action creator for ' + constant + ' (' + actionType + ')');
    }
  },
  getInitialState: function () {
    return this.getState();
  },
  getState: function () {
    return {
      actionTypes: actionTypes(),
      args: "'foo', 1, 'bar'"
    };

    function actionTypes() {
      return _.values(TestConstants).filter(generatedConstants).map(function (constant) {
        return constant;
      });

      function generatedConstants(constant) {
        if (_.endsWith(constant.type, '_STARTING')) {
          return false;
        }

        if (_.endsWith(constant.type, '_DONE')) {
          return false;
        }

        if (_.endsWith(constant.type, '_FAILED')) {
          return false;
        }

        return true;
      }
    }
  }
});

module.exports = Actions;