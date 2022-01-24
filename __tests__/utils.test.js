const {objectValues} = require('../db/utils/seed-functions.js');

const {queryValidation} = require('../db/utils/util-funcs.js');

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

describe.skip('queryValidation function test',()=>{
    test('Works on array',()=>{
        const obj ={a:1,b:2,c:3}
        const validkeys = ['a','b','c']
        expect(queryValidation(obj,validkeys)).toEqual(Promise.resolve())
    })
    test('Does not mutate original array',()=>{
        const obj ={a:1,b:2,c:3}
        const validkeys = ['a','b','c']
        const newArr = queryValidation(obj,validkeys);
        expect(obj).toEqual({a:1,b:2,c:3})
    })
})