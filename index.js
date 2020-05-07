const CONSTANTS = require('./constants');

const MONTH_LIST = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const WEEK_ARRRAY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MIN_YEAR = 1970;
const MAX_YEAR = 2099;
const MAX_MIN_SEC_VALUE = 59;
const MAX_HOUR_VALUE = 23;
let isError = false;
let errorMsg = [];

exports.isValidCronExpression = function(cronExpression, errorObj) {

    if(!/\s/g.test(cronExpression)) {
        if(errorObj && errorObj.error) {
            return {
                isValid: false,
                errorMessage: CONSTANTS.ERROR_MSGES.UNEXPECTED_ERROR_MSG,
            }
        } else {
            return false;
        }
    }

    let cronArray = cronExpression.split(" ");

    if(parseInt(cronArray.length) !== 6 && parseInt(cronArray.length) !== 7 ) {
        if(errorObj && errorObj.error) {
            return {
                isValid: false,
                errorMessage: CONSTANTS.ERROR_MSGES.UNEXPECTED_ERROR_MSG,
            }
        } else {
            return false;
        }
    }

    let seconds = cronArray[0].trim();
    let minutes = cronArray[1].trim();
    let hours = cronArray[2].trim();
    let dayOfMonth = cronArray[3].trim();
    let month = cronArray[4].trim();
    let dayOfWeek = cronArray[5].trim();
    let year = cronArray[6] ? cronArray[6].trim() : null;

    let isValidSeconds = isValidTimeValue(seconds, MAX_MIN_SEC_VALUE);
    let isValidMinutes = isValidTimeValue(minutes, MAX_MIN_SEC_VALUE);
    let isValidHour = isValidTimeValue(hours, MAX_HOUR_VALUE);
    let isValidDayOfMonth = isValidDayOfMonthValue(dayOfMonth, dayOfWeek);
    let isValidMonth = isValidMonthValue(month);
    let isValidDayOfWeek = isValidDayOfWeekValue(dayOfWeek, dayOfMonth);
    let isValidYear = year ? isValidYearValue(year): true;

    let isValidCron = isValidSeconds && isValidMinutes && isValidHour && isValidDayOfMonth && isValidMonth && isValidDayOfWeek && isValidYear;
    if(errorObj && errorObj.error && isError && !isValidCron) {
        return {
            isValid: isValidCron,
            errorMessage: errorMsg,
        }
    } else {
        return isValidCron;
    }
}

const isValidDayOfWeekValue = function(dayOfWeek, dayOfMonth) {

    if((dayOfWeek === '*' && dayOfMonth !== '*') || (dayOfWeek === '?' && dayOfMonth !== '?')) {
        return true;
    } 
    if(dayOfWeek.toLowerCase() === 'l') {
        return true;
    }
    if(dayOfWeek === '*') {
        return dayOfMonth !== '*';
    } else if(dayOfWeek.includes('/') && dayOfMonth === '?') {
        let startingDayOfWeekOptionArr = dayOfWeek.split('/');
        if(!isValidateMonthNo([startingDayOfWeekOptionArr[0]], 1, 7)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_1);
        } 
        if(!isValidateMonthNo([startingDayOfWeekOptionArr[1]], 0, 7)) {
            isError = true;
            errorMsg.push('Expression '+startingDayOfWeekOptionArr[1]+' is not a valid increment value. Accepted values are 0-7');
        }
        return isValidateMonthNo([startingDayOfWeekOptionArr[0]], 1, 7) && isValidateMonthNo([startingDayOfWeekOptionArr[1]], 0, 7);
    } else if(dayOfWeek.includes('-') && dayOfMonth === '?') {
        let dayOfWeekRangeArr = dayOfWeek.split('-');
        if(!isNaN(parseInt(dayOfWeekRangeArr[0])) && !isNaN(parseInt(dayOfWeekRangeArr[1])) && !isValidateMonthNo(dayOfWeekRangeArr, 1, 7)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_1);
        } 
        if(isNaN(parseInt(dayOfWeekRangeArr[0])) && isNaN(parseInt(dayOfWeekRangeArr[1])) && !isValidateMonthStr(dayOfWeekRangeArr, WEEK_ARRRAY)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_2);
        }
        return !isNaN(parseInt(dayOfWeekRangeArr[0])) && !isNaN(parseInt(dayOfWeekRangeArr[1])) ? 
            isValidateMonthNo(dayOfWeekRangeArr, 1, 7) : isValidateMonthStr(dayOfWeekRangeArr, WEEK_ARRRAY);
    } else if(dayOfWeek.includes(',') && dayOfMonth === '?') {
        let multiDayOfWeekArr = dayOfWeek.split(',');
        if(!isNaN(parseInt(multiDayOfWeekArr[0])) && !isValidateMonthNo(multiDayOfWeekArr, 1, 7)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_1);
        }
        if(isNaN(parseInt(multiDayOfWeekArr[0])) && !isValidateMonthStr(multiDayOfWeekArr, WEEK_ARRRAY)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_2);
        }
        return !isNaN(parseInt(multiDayOfWeekArr[0])) ? 
            isValidateMonthNo(multiDayOfWeekArr, 1, 7) : isValidateMonthStr(multiDayOfWeekArr, WEEK_ARRRAY);
    } else if(dayOfWeek.includes('#') && dayOfMonth === '?') {
        let weekdayOfMonthArr = dayOfWeek.split('#');
        if(!isValidateMonthNo([weekdayOfMonthArr[0]], 1, 7)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_3);
        }
        if(!isValidateMonthNo([weekdayOfMonthArr[1]], 1, 5)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_4);
        }
        return isValidateMonthNo([weekdayOfMonthArr[0]], 1, 7) && isValidateMonthNo([weekdayOfMonthArr[1]], 1, 5)
    } else if(typeof dayOfWeek === 'string' && dayOfMonth === '?') {
        if(!isNaN(parseInt(dayOfWeek)) && !isValidateMonthNo([dayOfWeek], 1, 7) ) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_1);
        }
        if(isNaN(parseInt(dayOfWeek)) && !isValidateMonthStr([dayOfWeek], WEEK_ARRRAY)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_2);
        }
        return !isNaN(parseInt(dayOfWeek)) ? 
            isValidateMonthNo([dayOfWeek], 1, 7) : isValidateMonthStr([dayOfWeek], WEEK_ARRRAY);
    } else {
        isError = true;
        if(isInvalidValues(dayOfWeek, dayOfMonth) && !isHasErrorMsg(errorMsg)) {
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_DAY_OF_WEEK_ERROR_MSG)
        } else {
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_WEEK_ERROR_MSG_2+ " or * or /");
        }
        return false;
    }
}

const isInvalidValues = function(dayOfWeek, dayOfMonth) {
    const isAll = dayOfWeek === '*' && dayOfMonth === '*';
    const isAny = dayOfWeek === '?' && dayOfMonth === '?';
    return isAll || isAny;
}

const isHasErrorMsg = function(array) {
    return array.includes(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_DAY_OF_WEEK_ERROR_MSG);
}

const isValidDayOfMonthValue = function(dayOfMonth, dayOfWeek) {
    const isNotLastDays = !dayOfMonth.toLowerCase().includes('l') || !dayOfMonth.toLowerCase() === 'lw';
    if((dayOfMonth === '*' && dayOfWeek !== '*') || (dayOfMonth === '?' && dayOfWeek !== '?')) {
        return true;
    } else if(dayOfMonth.includes('/') && dayOfWeek === '?') {
        let startingDayOfMonthOptionArr = dayOfMonth.split('/');
        if(!isValidateMonthNo([startingDayOfMonthOptionArr[0]], 1, 31 && !startingDayOfMonthOptionArr[0] === '*')) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_ERROR_MSG_1);
        }
        if(!isValidateMonthNo([startingDayOfMonthOptionArr[1]], 0, 31)) {
            isError = true;
            errorMsg.push("(Day of month) - Expression "+startingDayOfMonthOptionArr[1]+" is not a valid increment value. Accepted values are 0-31");
        }
        const isValidElements = isValidateMonthNo([startingDayOfMonthOptionArr[0]], 1, 31) && isValidateMonthNo([startingDayOfMonthOptionArr[1]], 0, 31);
        const isValidFirstElem = startingDayOfMonthOptionArr[0] === '*' && isValidateMonthNo([startingDayOfMonthOptionArr[1]], 0, 31);
        return isValidElements || isValidFirstElem;
    } else if(dayOfMonth.includes('-') && dayOfWeek === '?') {
        let dayOfMonthRangeArr = dayOfMonth.split('-');
        const isLastDayIncludes = dayOfMonthRangeArr[0] === 'L' && isValidateMonthNo([dayOfMonthRangeArr[1]], 1, 30)
        if(!isLastDayIncludes) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_ERROR_MSG_2);
        }
        if(!isValidateMonthNo(dayOfMonthRangeArr, 1, 31) && dayOfMonthRangeArr[0] !== 'L') {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_ERROR_MSG_1);
        }
        return isValidateMonthNo(dayOfMonthRangeArr, 1, 31) || isLastDayIncludes;
    } else if(dayOfMonth.includes(',') && dayOfWeek === '?') {
        let multiDayOfMonthArr = dayOfMonth.split(',');
        if(!isValidateMonthNo(multiDayOfMonthArr, 1, 12)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_ERROR_MSG_1);
        }
        return isValidateMonthNo(multiDayOfMonthArr, 1, 12);
    } else if(typeof dayOfMonth === 'string' && dayOfWeek === '?' && (dayOfMonth.toLowerCase() === 'l' || dayOfMonth.toLowerCase() === 'lw')) {
        return true;
    } else if(typeof dayOfMonth === 'string' && dayOfWeek === '?' && dayOfMonth !== '?' && isNotLastDays) {
        if(parseInt(dayOfMonth) <1 && parseInt(dayOfMonth) > 31) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_ERROR_MSG_1);
        }
        return parseInt(dayOfMonth) >=1 && parseInt(dayOfMonth) <= 31;
    } else {
        isError = true;
        if(isInvalidValues(dayOfWeek, dayOfMonth) && !isHasErrorMsg(errorMsg)) {
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_DAY_OF_WEEK_ERROR_MSG);
        } else {
            errorMsg.push(CONSTANTS.ERROR_MSGES.DAY_OF_MONTH_ERROR_MSG_1);
        }
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
        if(!isValidateMonthNo([startingMonthOptionArr[0]], 1, 12)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_ERROR_MSG);
        }
        if(!isValidateMonthNo([startingMonthOptionArr[1]], 0, 12)) {
            isError = true;
            errorMsg.push('(Month) - Expression '+startingMonthOptionArr[1]+' is not a valid increment value. Accepted values are 0-12');
        }
        return isValidateMonthNo([startingMonthOptionArr[0]], 1, 12) && isValidateMonthNo([startingMonthOptionArr[1]], 0, 12);
    } else if(month.includes('-')) {
        let monthRangeArr = month.split('-');
        if(!isNaN(parseInt(monthRangeArr[0])) && !isNaN(parseInt(monthRangeArr[1])) && !isValidateMonthNo(monthRangeArr, 1, 12)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_ERROR_MSG);
        }
        if(isNaN(parseInt(monthRangeArr[0])) && isNaN(parseInt(monthRangeArr[1])) && !isValidateMonthStr(monthRangeArr, MONTH_LIST)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_LETTER_ERROR_MSG);
        }
        return !isNaN(parseInt(monthRangeArr[0])) && !isNaN(parseInt(monthRangeArr[1])) ? 
            isValidateMonthNo(monthRangeArr, 1, 12) : isValidateMonthStr(monthRangeArr, MONTH_LIST);
    } else if(month.includes(',')) {
        let multiMonthArr = month.split(',');
        if(!isNaN(parseInt(multiMonthArr[0])) && !isValidateMonthNo(multiMonthArr, 1, 12)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_ERROR_MSG);
        }
        if(isNaN(parseInt(multiMonthArr[0])) && isValidateMonthStr(multiMonthArr, MONTH_LIST)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_LETTER_ERROR_MSG); 
        }
        return !isNaN(parseInt(multiMonthArr[0])) ? 
            isValidateMonthNo(multiMonthArr, 1, 12) : isValidateMonthStr(multiMonthArr, MONTH_LIST);
    } else if(typeof month === 'string') {
        if(!isNaN(parseInt(month)) && !isValidateMonthNo([month], 1, 12)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_ERROR_MSG);
        }
        if(isNaN(parseInt(month)) && !isValidateMonthStr([month], MONTH_LIST)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_LETTER_ERROR_MSG); 
        }
        return !isNaN(parseInt(month)) ? 
            isValidateMonthNo([month], 1, 12) : isValidateMonthStr([month], MONTH_LIST);
    } else {
        isError = true;
        errorMsg.push(CONSTANTS.ERROR_MSGES.MONTH_LETTER_ERROR_MSG); 
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
        if(!isValidYear) {
            isError = true;
            errorMsg.push('(Year) - Unsupported value '+startingYearOptionArr[0]+' for field. Possible values are 1970-2099 , - * /'); 
        }
        if(!isValidRepeatOccurrence) {
            isError = true;
            errorMsg.push('(Year) - Expression '+startingYearOptionArr[1]+' is not a valid increment value. Accepted values are 0-129'); 
        }
        return isValidYear && isValidRepeatOccurrence;
    } else if(year.includes('-')) {
        let yearRangeArr = year.split('-');
        let isValidYear = isValidateYear(yearRangeArr);
        let isValidRange = parseInt(yearRangeArr[0]) <= parseInt(yearRangeArr[1]);
        if(!isValidYear) {
            isError = true;
            errorMsg.push('(Year) - Unsupported value '+startingYearOptionArr[0]+' for field. Possible values are 1970-2099 , - * /'); 
        }
        if(!isValidRange) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.YEAR_ERROR_MSG); 
        }
        return isValidYear && isValidRange;
    } else if(year.includes(',')) {
        let multiYearArr = year.split(',');
        if(!isValidateYear(multiYearArr)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.YEAR_UNSUPPORT_VAL_ERROR_MSG); 
        }
        return isValidateYear(multiYearArr);
    } else if (parseInt(year) >= 1970 && parseInt(year) <= 2099) {
        return true;
    } else {
        isError = true;
        errorMsg.push(CONSTANTS.ERROR_MSGES.YEAR_UNSUPPORT_VAL_ERROR_MSG); 
        return false;
    }
}

const isValidTimeValue = function(time, val) {
    if(time === '*' || time === "0") {
        return true;
    } else if(time.includes('/')) {
        let startingSecOptionArr = time.split('/');
        if(!isValidateTime(startingSecOptionArr, val) && !startingSecOptionArr[0] === '*') {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.TIME_ERROR_MSG);     
        }
        return isValidateTime(startingSecOptionArr, val) || (startingSecOptionArr[0] === '*' && isValidateTime([startingSecOptionArr[1]], val));
    } else if(time.includes('-')) {
        let secRangeArr = time.split('-');
        if(!isValidateTime(secRangeArr, val)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.TIME_ERROR_MSG);     
        }
        return isValidateTime(secRangeArr, val);
    } else if(time.includes(',')) {
        let multiSecArr = time.split(',');
        if(!isValidateTime(multiSecArr, val)) {
            isError = true;
            errorMsg.push(CONSTANTS.ERROR_MSGES.TIME_ERROR_MSG);     
        }
        return isValidateTime(multiSecArr, val)
    } else if (parseInt(time) >= 0 && parseInt(time) <= val) {
        return true;
    } else {
        isError = true;
        errorMsg.push(CONSTANTS.ERROR_MSGES.TIME_ERROR_MSG);   
        return false;
    }
}

const isValidateTime = function(dataArray, value) {
    return dataArray.every(element => {
        return element >= 0  && element <= value;
    })
}

