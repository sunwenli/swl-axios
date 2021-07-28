import {
    isDate,
    isFormData,
    isAbsoluteURL,
    isPlainObject,

} from '../../src/helpers/util'

describe('help util:', () => {
    describe('isXXX', () => {
        describe('isDate', () => {

            test('should value is date', () => {
                expect(isDate(new Date())).toBeTruthy()
                expect(isDate(Date.now())).toBeFalsy()
            })

        })
    })
})

