import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import helpers from '../helpers.js'

class Calendar extends Component {
  constructor(props){
    super(props);
    this.state = {
      today: new Date()
    };

    if (helpers.isDate(this.props.date)) {
      this.state.current = this.props.date;
      this.state.month = this.props.date.getMonth() + 1;
      this.state.year = this.props.date.getFullYear();
    } else {
      var currentDate = new Date();
      this.state.current = null;
      this.state.month = currentDate.getMonth() + 1;
      this.state.year = currentDate.getFullYear();
    }
  }

  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const calendarMonth = month || current.getMonth() + 1;
    const calendarYear = year || current.getFullYear();

    return helpers.buildWeeks(calendarMonth, calendarYear);
  };

  renderMonthAndYear = () => {
    const { month, year } = this.state;
    const monthName = Object.keys(helpers.months)[month - 1];

    return (
      <div id='calendarHeader'>
        <div id='calendarMonth'>
          {monthName} {year}
        </div>
        <div
          onMouseDown={this.handlePreviousMonth}
          title='Previous Month'
          id='arrowLeft'
        > &lt;
        </div>
        <div
          onMouseDown={this.handleNextMonth}
          title='Next Month'
          id='arrowRight'
        > &gt;
        </div>
      </div>
    );
  }

  renderDayLabel = (day, index) => {
    const daylabel = helpers.days[day];
    return (
      <div className='calendarCell calendarDay' key={index} index={index}>
        {daylabel}
      </div>
    );
  }

  renderCalendarDate = (date, index) => {
    const { current, month, year, today } = this.state;
    const thisDate = new Date(date.join('-'));

    // Check if calendar date is same day as today
    const isToday = helpers.isSameDate(thisDate, today);

    // Check if calendar date is same day as currently selected date
    const isCurrent = current && helpers.isSameDate(thisDate, current);

    // Check if calendar date is in the same month as the state month and year
    const inMonth = month && year && helpers.isSameMonth(thisDate, new Date([year, month, 1].join('-')));

    // Conditionally render a styled date component
    var cellClass;
    if (isCurrent) {
      cellClass = 'hlDate calendarCell';
    } else if (isToday) {
      cellClass = 'tdDate calendarCell';
    } else if (!inMonth) {
      cellClass = 'nsmDate calendarCell';
    } else {
      cellClass = 'nmDate calendarCell';
    }

    return (
      <div
        className={cellClass}
        key={helpers.formatDate(thisDate)}
        onClick={e => this.gotoDate(e, thisDate)}
      >
        {thisDate.getDate()}
      </div>
    );
  }

  updateDate(date) {
    return {
      current: date,
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  gotoDate = (e, date) => {
    e && e.preventDefault();
    const { current } = this.state;
    const { onDateChanged } = this.props;

    !(current && helpers.isSameDate(date, current)) &&
      this.setState(this.updateDate(date), () => {
        typeof onDateChanged === "function" && onDateChanged(date);
      });
  }

  handlePreviousMonth = e => {
    e && e.preventDefault();
    const { month, year } = this.state;
    this.setState(helpers.getPreviousMonth(month, year));
  }

  handleNextMonth = e => {
    e && e.preventDefault();
    const { month, year } = this.state;
    this.setState(helpers.getNextMonth(month, year));
  }

  render() {
    return (
      <div id='calendarContainer'>
        { this.renderMonthAndYear() }
        <div id='calendarGrid'>
          <Fragment>
            { Object.keys(helpers.days).map(this.renderDayLabel) }
          </Fragment>
          <Fragment>
            { this.getCalendarDates().map(this.renderCalendarDate) }
          </Fragment>
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
}

export default Calendar;