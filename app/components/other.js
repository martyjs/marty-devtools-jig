/** @jsx React.DOM */

var React = require('react');
var Marty = require('marty');
var OtherStore = require('../stores/otherStore');
var ImmutableStore = require('../stores/immutableStore');

var OtherStateMixin = Marty.createStateMixin({
  listenTo: [OtherStore],
  getState: function () {
    return {
      other: OtherStore.getById(this.props.id),
      immutable: ImmutableStore.getById(this.props.id)
    };
  }
});

var Other = React.createClass({
  mixins: [OtherStateMixin],
  render: function () {
    return (
      <div className='other' style={{display: 'none'}}>
        {this.state}
      </div>
    );
  }
});

module.exports = Other;