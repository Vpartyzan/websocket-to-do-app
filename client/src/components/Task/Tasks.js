import React from 'react';
import io from 'socket.io-client';

import { v4 as uuidv4 } from 'uuid';

class Tasks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: '',
    };

    this.submitForm = this.submitForm.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updateTasks = this.updateTasks.bind(this);
  }

  componentDidMount() {
    this.socket = io.connect('localhost:8000');
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
    this.socket.on('addTask', (addTask) => this.addTask(addTask));
    this.socket.on('removeTask', (removeTask) => this.removeTask(removeTask));    
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({
      taskName: event.target.value,
    });
  }

  updateTasks(tasks) {
    this.setState({
      tasks: tasks,
    });
  }

  submitForm(event) {
    event.preventDefault();

    if (this.state.taskName !== '') {
      const newTask = {
        id: uuidv4(),
        taskName: this.state.taskName,
      };

      this.addTask(newTask);
      this.socket.emit('addTask', newTask);
    } else {
      alert('The description field must not be empty');
    } 

  }

  addTask(task) {
    this.setState({
      tasks: [...this.state.tasks, task]
    });   
  }

  removeTask(event) {
    if (event.target) {
      event.preventDefault();
      let id = event.target.parentElement.id;
      
      this.setState({
        tasks: this.state.tasks.filter( task => task.id !== id ),
      });
      this.socket.emit('removeTask', id);
    } else {
      console.log(event);
      this.setState({
        tasks: this.state.tasks.filter( task => task.id !== event ),
      });
    }
    
  }

  render() {

    return (

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
    
        <ul className="tasks-section__list" id="tasks-list">
          {this.state.tasks.map( task => (
            <li key={task.id} id={task.id} className="task">{task.taskName}<button className="btn btn--red" onClick={this.removeTask}>Remove</button></li>
          ))}
        </ul>
    
        <form id="add-task-form" onSubmit={this.submitForm}>
          <input 
            className="text-input" 
            autoComplete="off" type="text" 
            placeholder="Type your description" 
            id="task-name"
            onChange={this.handleChange} 
          />
          <button className="btn" type="submit" >Add</button>
        </form>
    
      </section>
    );
  };
};

export default Tasks;