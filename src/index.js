import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-virtualized/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from './components/DatePicker';

class App extends Component {
  render() {
    return (
      <div>
        <DatePicker label="请选择日期：" value="2019-03-01" />
      </div>
    );
  }
}

export default App;

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
