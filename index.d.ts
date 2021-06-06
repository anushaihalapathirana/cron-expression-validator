declare module 'cron-expression-validator' {

    export type CronValidationOptions<T extends boolean> = {
        readonly error: T;
    }

    export type CronValidationResponse = {
        readonly isValid: boolean;
        readonly errorMessage: Array<string>;
    }

    export function isValidCronExpression(expression: string): boolean;    
    export function isValidCronExpression<T extends boolean>(expression: string, options: CronValidationOptions<T> ): T extends true ? CronValidationResponse : boolean;    
}