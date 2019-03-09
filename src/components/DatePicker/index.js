import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import Calendar from "../Calendar";
import helpers from '../helpers.js'

// This component is inspired by Glad Chinda: https://blog.logrocket.com/react-datepicker-217b4aa840da
// Jiping, 09.03.2018

class DatePicker extends Component {
  constructor(props){
    super(props);
    this.state = {
      date: null,
      calendarIsOpen: false
    }
  }

  toggleCalendar = () => {
    this.setState({
      calendarIsOpen: !this.state.calendarIsOpen
    });
  }

  handleDateChange = date => {
    const { onDateChanged } = this.props;
    const { date: currentDate } = this.state;
    const newDate = date ? helpers.formatDate(date) : null;

    if (currentDate !== newDate) {
      this.setState({ date: newDate, calendarIsOpen: false }, () => {
        typeof onDateChanged === "function" && onDateChanged(this.state.date);
      });
    }
  }

  // Initialize default date
  componentDidMount() {
    const { value: date } = this.props;
    const newDate = date && new Date(date);
    if (helpers.isDate(newDate)) {
      this.setState({ date: helpers.formatDate(newDate) });
    }
  }

  componentDidUpdate(prevProps) {
    const date = this.props.value;
    const prevDate = prevProps.value;
    if (date !== prevDate) {
      this.setState({ date: helpers.formatDate(date) });
    }
  }

  render() {
    const { label } = this.props;
    const { date, calendarIsOpen } = this.state;

    return (
      <div id='datePickerContainer'>
          <label>{label || '请选择日期：'}</label>
          <input id='datePickerInput'
            type='text'
            value={date ? date.split('-').join(' / ') : ''}
            onChange={this.handleChange}
            readOnly='readonly'
            placeholder="YYYY / MM / DD"
            onClick={this.toggleCalendar}
          />
          { calendarIsOpen && (
            <Calendar date={date && new Date(date)} onDateChanged={this.handleDateChange} />
          )}
      </div>
    );
  }
}

DatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onDateChanged: PropTypes.func
}

export default DatePicker;