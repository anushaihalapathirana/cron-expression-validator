const MONTH_LIST = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const WEEK_ARRRAY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MIN_YEAR = 1970;
const MAX_YEAR = 2099;
const MAX_MIN_SEC_VALUE = 59;
const MAX_HOUR_VALUE = 23;


exports.isValidCronExpression = function(cronExpression) {

    let cronArray = cronExpression.split(" ");

    let seconds = cronArray[0].trim();
    let minutes = cronArray[1].trim();
    let hours = cronArray[2].trim();
    let dayOfMonth = cronArray[3].trim();
    let month = cronArray[4].trim();
    let dayOfWeek = cronArray[5].trim();
    let year = cronArray[6].trim();
    let error = false;
    let errorMsg = '';

    let isValidSeconds = isValidTimeValue(seconds, MAX_MIN_SEC_VALUE);
    let isValidMinutes = isValidTimeValue(minutes, MAX_MIN_SEC_VALUE);
    let isValidHour = isValidTimeValue(hours, MAX_HOUR_VALUE);
    let isValidDayOfMonth = isValidDayOfMonthValue(dayOfMonth, dayOfWeek);
    let isValidMonth = isValidMonthValue(month);
    let isValidDayOfWeek = isValidDayOfWeekValue(dayOfWeek, dayOfMonth);
    let isValidYear = isValidYearValue(year);

    return isValidSeconds && isValidMinutes && isValidHour && isValidDayOfMonth && isValidMonth && isValidDayOfWeek && isValidYear;
}

const isValidDayOfWeekValue = function(dayOfWeek, dayOfMonth) {

    if((dayOfWeek === '*' && dayOfMonth !== '*') || (dayOfWeek === '?' && dayOfMonth !== '?')) {
        return true;
    } else if(dayOfWeek.includes('/') && dayOfMonth === '?') {
        let startingDayOfWeekOptionArr = dayOfWeek.split('/');
        return isValidateMonthNo([startingDayOfWeekOptionArr[0]], 1, 7) && isValidateMonthNo([startingDayOfWeekOptionArr[1]], 0, 7);
    } else if(dayOfWeek.includes('-') && dayOfMonth === '?') {
        let dayOfWeekRangeArr = dayOfWeek.split('-');
        return !isNaN(parseInt(dayOfWeekRangeArr[0])) && !isNaN(parseInt(dayOfWeekRangeArr[1])) ? 
            isValidateMonthNo(dayOfWeekRangeArr, 1, 7) : isValidateMonthStr(dayOfWeekRangeArr, WEEK_ARRRAY);
    } else if(dayOfWeek.includes(',') && dayOfMonth === '?') {
        let multiDayOfWeekArr = dayOfWeek.split(',');
        return !isNaN(parseInt(multiDayOfWeekArr[0])) ? 
            isValidateMonthNo(multiDayOfWeekArr, 1, 7) : isValidateMonthStr(multiDayOfWeekArr, WEEK_ARRRAY);
    } else if(typeof dayOfWeek === 'string' && dayOfMonth === '?') {
        return !isNaN(parseInt(dayOfWeek)) ? 
            isValidateMonthNo([dayOfWeek], 1, 7) : isValidateMonthStr([dayOfWeek], WEEK_ARRRAY);
    } else {
        return false;
    }
}

const isValidDayOfMonthValue = function(dayOfMonth, dayOfWeek) {
    if((dayOfMonth === '*' && dayOfWeek !== '*') || (dayOfMonth === '?' && dayOfWeek !== '?')) {
        return true;
    } else if(dayOfMonth.includes('/') && dayOfWeek === '?') {
        let startingDayOfMonthOptionArr = dayOfMonth.split('/');
        return isValidateMonthNo([startingDayOfMonthOptionArr[0]], 1, 31) && isValidateMonthNo([startingDayOfMonthOptionArr[1]], 0, 31);
    } else if(dayOfMonth.includes('-') && dayOfWeek === '?') {
        let dayOfMonthRangeArr = dayOfMonth.split('-');
        return isValidateMonthNo(dayOfMonthRangeArr, 1, 31);
    } else if(dayOfMonth.includes(',') && dayOfWeek === '?') {
        let multiDayOfMonthArr = dayOfMonth.split(',');
        return isValidateMonthNo(multiDayOfMonthArr, 1, 12);
    } else if(typeof dayOfMonth === 'string' && dayOfWeek === '?' && (dayOfMonth.toLowerCase() === 'l' || dayOfMonth.toLowerCase() === 'lw')) {
        return true;
    } else if(typeof dayOfMonth === 'string' && dayOfWeek === '?') {
        return parseInt(dayOfMonth) >=1 && parseInt(dayOfMonth) <= 31;
    } else {
        return false;
    }
}

const isValidateMonthNo = function(monthArr, val, endVal) {
    return monthArr.every(month => {
        return parseInt(month) >= val && parseInt(month) <= endVal; 
    })
}

const isValidateMonthStr = function(monthArr, dataArr) {
    return monthArr.every(month => {
        return dataArr.includes(month.toLowerCase()); 
    })
}

const isValidMonthValue = function(month) {
    if(month === '*') {
        return true;
    } else if(month.includes('/')) {
        let startingMonthOptionArr = month.split('/');
        return isValidateMonthNo([startingMonthOptionArr[0]], 1, 12) && isValidateMonthNo([startingMonthOptionArr[1]], 0, 12);
    } else if(month.includes('-')) {
        let monthRangeArr = month.split('-');
        return !isNaN(parseInt(monthRangeArr[0])) && !isNaN(parseInt(monthRangeArr[1])) ? 
            isValidateMonthNo(monthRangeArr, 1, 12) : isValidateMonthStr(monthRangeArr, MONTH_LIST);
    } else if(month.includes(',')) {
        let multiMonthArr = month.split(',');
        return !isNaN(parseInt(multiMonthArr[0])) ? 
            isValidateMonthNo(multiMonthArr, 1, 12) : isValidateMonthStr(multiMonthArr, MONTH_LIST);
    } else if(typeof month === 'string') {
        return !isNaN(parseInt(month)) ? 
            isValidateMonthNo([month], 1, 12) : isValidateMonthStr([month], MONTH_LIST);
    } else {
        return false;
    }
}

const isValidateYear = function(yearArr) {
    return yearArr.every(year => {
        return parseInt(year) >= MIN_YEAR && parseInt(year) <= MAX_YEAR; 
    })
}

const isValidYearValue = function(year) {
    if(year === '*') {
        return true;
    } else if(year.includes('/')) {
        let startingYearOptionArr = year.split('/');
        let isValidYear = isValidateYear([startingYearOptionArr[0]]);
        let isValidRepeatOccurrence = parseInt(startingYearOptionArr[1]) >= 0 && parseInt(startingYearOptionArr[1]) <=129;
        return isValidYear && isValidRepeatOccurrence;
    } else if(year.includes('-')) {
        let yearRangeArr = year.split('-');
        let isValidYear = isValidateYear(yearRangeArr);
        let isValidRange = parseInt(yearRangeArr[0]) <= parseInt(yearRangeArr[1]);
        return isValidYear && isValidRange;
    } else if(year.includes(',')) {
        let multiYearArr = year.split(',');
        return isValidateYear(multiYearArr);
    } else if (parseInt(year) >= 1970 && parseInt(year) <= 2099) {
        return true;
    } else {
        return false;
    }
}

const isValidTimeValue = function(time, val) {
    if(time === '*' || time === "0") {
        return true;
    } else if(time.includes('/')) {
        let startingSecOptionArr = time.split('/');
        return isValidateTime(startingSecOptionArr, val);
    } else if(time.includes('-')) {
        let secRangeArr = time.split('-');
        return isValidateTime(secRangeArr, val);
    } else if(time.includes(',')) {
        let multiSecArr = time.split(',');
        return isValidateTime(multiSecArr, val)
    } else if (parseInt(time) >= 0 && parseInt(time) <= val) {
        return true;
    } else {
        return false;
    }
}

const isValidateTime = function(dataArray, value) {
    return dataArray.every(element => {
        return element >= 0  && element <= value;
    })
}


console.log(module.exports.isValidCronExpression('4/5 8-4 8/2 LW 1 ? 2015')); 