const expect = require('chai').expect;
const index = require('../index');

describe('isValidCronExpression', () => {
 it('should return true', () => {
        expect(index.isValidCronExpression('* * * * * ? *')).to.equal(true);
        expect(index.isValidCronExpression('* * * ? * * *')).to.equal(true);
        expect(index.isValidCronExpression('0 * * ? * *')).to.equal(true);
        expect(index.isValidCronExpression('0 */2 * ? * *')).to.equal(true);
        expect(index.isValidCronExpression('0 1/2 * ? * *')).to.equal(true);
        expect(index.isValidCronExpression('0 15,30,45 * ? * *')).to.equal(true);
        expect(index.isValidCronExpression('0 0 */2 ? * *')).to.equal(true);
        expect(index.isValidCronExpression('0 0 1/2 ? * *')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 */7 * ?')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 2/7 * ?')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 2 * ?')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 L * ?')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 LW * ?')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 L-5 * ?')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 ? * 2#1')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 ? * 5#3')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 ? JAN *')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 ? JAN,JUN *')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 ? 9-12 *')).to.equal(true);
        expect(index.isValidCronExpression('0 0 12 ? * L')).to.equal(true);
    });

    it('should return false', () => {
        expect(index.isValidCronExpression('* * * * * * *')).to.equal(false);
        expect(index.isValidCronExpression('* * * ? * ? *')).to.equal(false);
        expect(index.isValidCronExpression('* ? * * * ? *')).to.equal(false);
        expect(index.isValidCronExpression('0 0 12 2L * ?')).to.equal(false);
        expect(index.isValidCronExpression('0 0 12 * * WED')).to.equal(false);
        expect(index.isValidCronExpression('* * * ? * JAN *')).to.equal(false);
        expect(index.isValidCronExpression('* * * * WED ? *')).to.equal(false);

    });

});
