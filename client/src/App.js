import React from 'react';

import Tasks from './components/Task/Tasks';

class App extends React.Component {

  render() {
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
        
        <Tasks />
        
      </div>
    );
  };

};

export default App;