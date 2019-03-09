const days = {
  Sunday: 'S',
  Monday: 'M',
  Tuesday: 'T',
  Wednesday: 'W',
  Thursday: 'T',
  Friday: 'F',
  Saturday: 'S'
}

const months = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec'
}

const displayedWeeks = 6; // Months displayed on the calender
const currentDate = new Date();
const currentYear = Number(currentDate.getFullYear());
const currentMonth = Number(currentDate.getMonth()) + 1; // getMonth returns 0 - 11, months are 1 - 12

// Fill start with 0
function zeroPad(value, length) {
  return String(value).padStart(length, '0');
}

function getDaysOfMonth(month = currentMonth, year = currentYear) {
  switch (month) {
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    case 2:
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) { // lear year
        return 29;
      } else {
        return 28;
      }
    default:
      return 31;
  }
}

function getFirstDayOfMonth(month = currentMonth, year = currentYear) {
  var firstDay = String(year) + '-' + String(month) + '-' + '1';
  return ((new Date(firstDay)).getDay() + 1); // getDay returns 0 - 6
}

function isDate(date) {
  var isDate = Object.prototype.toString.call(date) === '[object Date]';
  var isValidNumber = false;
  if (date && !Number.isNaN(date.valueOf())) {
    isValidNumber = true;
  }
  return isDate && isValidNumber;
}

// Check if two dates are from the same month
function isSameMonth(date, basedate = new Date()) {
  if (!(isDate(date) && isDate(basedate))) {
    return false;
  }
  return (basedate.getMonth() === date.getMonth()) && (basedate.getFullYear() === date.getFullYear());
}

// Check if two dates are the same date
function isSameDate(date, basedate = new Date()) {
  if (!(isDate(date) && isDate(basedate))) {
    return false;
  }
  return (basedate.getMonth() === date.getMonth() && basedate.getFullYear() === date.getFullYear() && basedate.getDate() === date.getDate());
}

// Format the given date as YYYY-MM-DD
function formatDate (date = new Date()) {
  if (!isDate(date)) {
    return null;
  }
  return [
    date.getFullYear(),
    zeroPad(date.getMonth() + 1, 2),
    zeroPad(date.getDate(), 2)
  ].join('-');
}

// Get the previous month and year
function getPreviousMonth(month, year) {
  var prevMonth = (month > 1) ? month - 1 : 12;
  var prevMonthYear = (month > 1) ? year : year - 1;
  return { month: prevMonth, year: prevMonthYear };
}

// Get the next month and year
function getNextMonth(month, year) {
  var nextMonth = (month < 12) ? month + 1 : 1;
  var nextMonthYear = (month < 12) ? year : year + 1;
  return { month: nextMonth, year: nextMonthYear };
}

// Calendar builder for a month in the specified year
// Create the 6 weeks to be displayed on the calender
function buildWeeks(month = currentMonth, year = currentYear) {
  var daysOfMonth = getDaysOfMonth(month, year);
  var firstDayOfMonth = getFirstDayOfMonth(month, year);

  // Get number of days to be displayed from previous and next months
  var daysFromPrevMonth = firstDayOfMonth - 1; // The rest of week before 1st of this month
  var daysFromNextMonth = (displayedWeeks * 7) - (daysFromPrevMonth + daysOfMonth); // Days to be displayed of the next month

  // Get the previous and next months and years
  var previousMonth = getPreviousMonth(month, year);
  var nextMonth = getNextMonth(month, year);

  // Get number of days in previous month
  var prevMonthDays = getDaysOfMonth(previousMonth.month, previousMonth.year);
  // Build each date of the last week of the previous month
  var prevMonthWeeks = [];
  for (let i = 0; i < daysFromPrevMonth; i++) {
    let date = prevMonthDays - daysFromPrevMonth + 1 + i;
    prevMonthWeeks.push([previousMonth.year, zeroPad(previousMonth.month, 2), zeroPad(date, 2)]);
  }

  // Builds dates to be displayed from current month
  var currentMonthWeeks = [];
  for (let i = 0; i < daysOfMonth; i++) {
    let date = i + 1;
    currentMonthWeeks.push([year, zeroPad(month, 2), zeroPad(date, 2)]);
  }

  // Builds dates to be displayed from next month
  var nextMonthWeeks = [];
  for (let i = 0; i < daysFromNextMonth; i++) {
    let date = i + 1;
    nextMonthWeeks.push([nextMonth.year, zeroPad(nextMonth.month, 2), zeroPad(date, 2)]);
  }

  // Concat weeks from all three months
  return prevMonthWeeks.concat(currentMonthWeeks).concat(nextMonthWeeks);
}

const helpers = {
  days: days,
  months: months,
  isDate: isDate,
  isSameDate: isSameDate,
  isSameMonth: isSameMonth,
  formatDate: formatDate,
  getPreviousMonth: getPreviousMonth,
  getNextMonth: getNextMonth,
  buildWeeks: buildWeeks
}

export default helpers;