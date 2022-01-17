const {objectValues} = require('../db/utils/seed-functions.js');

describe.skip('objectValues function test',()=>{
    test('Works on null array',()=>{
        const arr=[]
        expect(objectValues(arr)).toEqual([])
    })
    test('Works on non-empty array',()=>{
        const arr=[{a:1,b:2},{c:3,d:4}]
        expect(objectValues(arr)).toEqual([[1,2],[3,4]])
    })
    test('Does not mutate original array',()=>{
        const arr=[{a:1,b:2},{c:3,d:4}];
        const newArr = objectValues(arr);
        expect(arr).toEqual([{a:1,b:2},{c:3,d:4}])
    })
    test('Does not mutate original array',()=>{
        const arr=[{a:1,b:2},{c:3,d:4}];
        const newArr = objectValues(arr);
        newArr[0][1]=11
        expect(arr).toEqual([{a:1,b:2},{c:3,d:4}])
    })
})