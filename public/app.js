
var TodoList = React.createClass({
  // colorIt: function() {
  //   return '<div className="panel panel-default">'
  // },

  render: function() {
    var self = this;

    var todosList = this.props.todos.map(function(t){
      return (
         <div className="panel panel-default">
          <div className="panel-header">
            <h2>Name:</h2> { t.name }
          </div>
          <div className="panel-body">
            <h2>Description:</h2> { t.description }
          </div>
          <div className="panel-body">
            <h2>Priority:</h2> { t.priority }
          </div>
          <div className="panel-body">
            <h2>Completed:</h2> { t.completed.toString() }
          </div>
          <div className="panel-footer">
            <h2>Due date:</h2> {t.dueDate}
            <button className="btn btn-warning"
              onClick={self.props.handleDelete.bind(this, t._id)}>
              delete
            </button>
            <button className="btn btn-success"
              onClick={self.props.handleCompleted.bind(this, t._id)}>
              complete
            </button>

          </div>
        </div>
        )
    })
    return (
      <div>
        <p> { todosList } </p>
      </div>
      )
  }
});

var TodoForm = React.createClass({
  getInitialState: function() {
    return {
      name: '',
      description: '',
      dueDate: '',
      priority: '',
      completed: ''
    }
  },
  handleNameChange: function(e) {
    this.setState({
      name: e.target.value
    })
  },
  handleDescriptionChange: function(e) {
    this.setState({
      description: e.target.value
    })
  },
  handleDueDateChange: function(e) {
    this.setState({
      dueDate: e.target.value
    })
  },
  handlePriorityChange: function(e) {
    this.setState({
      priority: e.target.value
    })
  },
  handleForm: function(e){
    e.preventDefault();
    var name = this.state.name;
    var description = this.state.description;
    var dueDate = this.state.dueDate;
    var priority = this.state.priority;
    var completed = this.state.completed;
    this.props.handleSubmit({
      name: name, description: description, dueDate: dueDate, priority: priority, completed: completed
    });
    this.setState({
      name: '',
      description: '',
      dueDate: '',
      priority: '',
      completed: ''
    })
  },
  render: function() {
    return (
      <div>
        <form onSubmit={this.handleForm} method="" role="form">
          <legend>Add New Todo</legend>

          <div className="form-group">
            <input onChange={this.handleNameChange} value={this.state.name} type="text" className="form-control" id="" placeholder="name" required/>
          </div>

          <div className="form-group">
            <input onChange={this.handleDescriptionChange} value={this.state.description} type="text" className="form-control" id="" placeholder="description"/>
          </div>

          <div className="form-group">
            <input onChange={this.handleDueDateChange} value={this.state.dueDate} type="date" className="form-control" id="" placeholder="due date"/>
          </div>

          <div className="form-group">
            <input onChange={this.handlePriorityChange} value={this.state.priority} type="number" className="form-control" id="" placeholder="1-10" min="0" max="10"/>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      )
  }
});

var App = React.createClass({

  getInitialState: function() {
    return {
      todos: []
    }
  },

  loadTodosFromServer: function() {
    var self = this;
    $.ajax({
      url: '/api/todos',
      method: 'GET'
    }).done(function(data){
        self.setState({
          todos: data
        })
    });
  },
  handleSubmit: function(todo) {
    var self = this;
    $.ajax({
      url: '/api/todos',
      method: 'POST',
      data: todo
    }).done(function(){
      self.loadTodosFromServer();
      console.log('posted todo to server!')
    })
  },
  handleDelete: function(id) {
    var id = id;
    var self = this;
    $.ajax({
      url: '/api/todos/' + id,
      method: 'DELETE'
    }).done(function(){
      console.log('deleted todo');
      self.loadTodosFromServer();
    })
  },
  handleCompleted: function(id) {
    var id = id;
    var self = this;
    $.ajax({
      url: '/api/complete/' + id,
      method: 'PUT'
    }).done(function(){
      self.loadTodosFromServer();
    })
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
  },
  render: function() {
    return (
      <div>
        <h3> Hello World! </h3>
        <TodoList handleDelete={ this.handleDelete }
                  handleCompleted={ this.handleCompleted }
                  todos={ this.state.todos } />
        <TodoForm handleSubmit={this.handleSubmit}/>
      </div>
      )
  }
});

React.render(<App/>, document.getElementById('app'));
