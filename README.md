[![typescript](https://camo.githubusercontent.com/56e4a1d9c38168bd7b1520246d6ee084ab9abbbb/68747470733a2f2f62616467656e2e6e65742f62616467652f69636f6e2f547970655363726970743f69636f6e3d74797065736372697074266c6162656c266c6162656c436f6c6f723d626c756526636f6c6f723d353535353535)](https://www.typescriptlang.org/)

# cron-expression-validator

cron-expression-validator is a **Node.JS** library (support typescript) to validate **quartz** cron expressions 

## Installation

	npm install cron-expression-validator
  
## Usage

**isValidCronExpression** method reqire *string* (cron expression) as parameter and returns *boolean* value

``` js
var cronValidator = require('cron-expression-validator');
var isValid = cronValidator.isValidCronExpression("* * * * * ? *"); // returns true
```
```js
if(cronValidator.isValidCronExpression("* * * * * ? *")) { // returns true
	// Your code
}
```
```js
if(cronValidator.isValidCronExpression("* * * * * * *")) { 
	// returns false
}
```


### Optional second param if you want to get error message

Can get error message by passing ``` { error: true } ``` as second parameter


```js
if(cronValidator.isValidCronExpression("* * * * 25/2 ? *", {error: true}) {
/** returns {
/* 		isValid: false,
/* 		errorMessage: [ 'Month values must be between 1 and 12' ]
/*	}
**/
}
```

``` js
if(cronValidator.isValidCronExpression("* * * ? * * 123/555", {error: true}) {
/** returns {
/* 		isValid: false,
/* 		errorMessage: [ '(Year) - Unsupported value 123 for field. Possible values are 1970-2099 , - * /',
/*				'(Year) - Expression 555 is not a valid increment value. Accepted values are 0-129' 
/*				]
/*	}
**/
}
```
  
``` js
if(cronValidator.isValidCronExpression("0 0 12 1/2 * ? *", {error: false}) { // returns true
	// Your code
}
```
## Cron accepted values
	Seconds: 0-59 * , -
	Minutes: 0-59 * , -
	Hours: 0-23 * , -
	Day of Month: 1-31 * , - ? L LW
	Months: (JAN-DEC or 1-12) * , -	
	Day of Week: (SUN-SAT or 1-7) * , L - ? #
	Year: 1970-2099 * , -
  
## License
	MIT
