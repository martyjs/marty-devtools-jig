/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var str = require('underscore.string');
var MultiTest = require('./multiTest');
var Input = require('react-bootstrap/Input');
var Panel = require('react-bootstrap/Panel');
var Button = require('react-bootstrap/Button');
var TestConstants = require('../constants/testConstants');
var ButtonToolbar = require('react-bootstrap/ButtonToolbar');
var TestActionCreators = require('../actions/testActionCreators');

var Actions = React.createClass({
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
    var actionType = str.camelize(constant.toLowerCase());
    var arguments = eval('[' + this.refs.arguments.getValue() + ']');
    var actionCreator = TestActionCreators[actionType];

    if (actionCreator) {
      actionCreator.apply(TestActionCreators, arguments);
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
      return _.values(TestConstants).map(function (constants) {
        return constants.type;
      });
    }
  }
});

module.exports = Actions;