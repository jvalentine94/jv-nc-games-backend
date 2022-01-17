const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

const request = require('supertest');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Testing Seed functionality for setting up tables',()=>{
    test('Categories',()=>{
        return db.query(`SELECT * FROM categories`)
        .then((res)=>{
            expect(res.rows.length=3)
            res.rows.forEach((x)=>
            expect(x).toMatchObject({
                slug: expect.any(String),
                description: expect.any(String)
            }))
        })
    })
    test('Comments',()=>{
        return db.query(`SELECT * FROM comments`)
        .then((res)=>{
            expect(res.rows.length=3)
            res.rows.forEach((x)=>
            expect(x).toMatchObject({
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                review_id: expect.any(Number),
                created_at: expect.any(Date)
            }))
        })
    })
    test('Reviews',()=>{
        return db.query(`SELECT * FROM reviews`)
        .then((res)=>{
            expect(res.rows.length=3)
            res.rows.forEach((x)=>
            expect(x).toMatchObject({
                title: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                review_img_url: expect.any(String),
                review_body: expect.any(String),
                category: expect.any(String),
                created_at: expect.any(Date),
                votes: expect.any(Number)
            }))
        })
    })
    test('Users',()=>{
        return db.query(`SELECT * FROM users`)
        .then((res)=>{
            expect(res.rows.length=3)
            res.rows.forEach((x)=>
            expect(x).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String)
            }))
        })
    })
})

describe('Testing endpoints',()=>{
    test('Get Category',()=>{
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then((res)=>{
            console.log(res)
        })
    })
})