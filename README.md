# cron-expression-validator

cron-expression-validator is a **Node.JS** library to validate **quartz** cron expressions. 

## Installation

	npm install cron-expression-validator
  
## Usage

**isValidCronExpression** method reqire *string* (cron expression) as parameter and returns *boolean* value

	var cronValidator = require('cron-expression-validator');
	var isValid = cronValidator.isValidCronExpression("* * * * * ? *"); // returns true

	if(cronValidator.isValidCronExpression("* * * * * ? *")) { // returns true
		// Your code
	}

	if(cronValidator.isValidCronExpression("* * * * * * *")) { // returns false
		// Your code
	}
  
## Cron accepted values
	Seconds: 0-59
	Minutes: 0-59
	Hours: 0-23
	Day of Month: 1-31, L, LW
	Months: (JAN-DEC and 1-12)
	Day of Week: (SUN-SAT and 1-7)
  
  
  
