const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

const request = require("supertest");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe.skip("Testing Seed functionality for setting up tables", () => {
  test("Categories", () => {
    return db.query(`SELECT * FROM categories`).then((res) => {
      expect((res.rows.length = 3));
      res.rows.forEach((x) =>
        expect(x).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        })
      );
    });
  });
  test("Comments", () => {
    return db.query(`SELECT * FROM comments`).then((res) => {
      expect((res.rows.length = 3));
      res.rows.forEach((x) =>
        expect(x).toMatchObject({
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          review_id: expect.any(Number),
          created_at: expect.any(Date),
        })
      );
    });
  });
  test("Reviews", () => {
    return db.query(`SELECT * FROM reviews`).then((res) => {
      expect((res.rows.length = 3));
      res.rows.forEach((x) =>
        expect(x).toMatchObject({
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(Date),
          votes: expect.any(Number),
        })
      );
    });
  });
  test("Users", () => {
    return db.query(`SELECT * FROM users`).then((res) => {
      expect((res.rows.length = 3));
      res.rows.forEach((x) =>
        expect(x).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        })
      );
    });
  });
});

describe.skip("Testing Get Category", () => {
  test("Get Category", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories).toHaveLength(4);
        res.body.categories.forEach((index) => {
          expect(index).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe.skip("Testing Get Review By Id", () => {
  test("valid get ID", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        console.log(res.body.review)
        expect(res.body.review).toBeInstanceOf(Object);

        expect(res.body.review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("id number doesnt exist", () => {
    return request(app)
      .get("/api/reviews/200")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  test("id number not a number", () => {
    return request(app)
      .get("/api/reviews/abc")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});

describe.skip("Testing Patch By Id", () => {
  test("Patch Review by Id, increase votes", () => {
    return request(app)
      .patch("/api/reviews/1?inc_votes=4")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toBeInstanceOf(Object);
        expect(res.body.review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: 5,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("Patch Review by Id, decrease votes", () => {
    return request(app)
      .patch("/api/reviews/1?inc_votes=-4")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toBeInstanceOf(Object);
        expect(res.body.review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: -3,
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("Invalid ID", () => {
    return request(app)
      .patch("/api/reviews/200?inc_votes=4")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  test("Invalid vote change", () => {
    return request(app)
      .patch("/api/reviews/1?inc_votes=a")

      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test.only("No vote change specified", () => {
    return request(app)
      .patch("/api/reviews/1?inc_votes=")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("Object with extra keys attached to query", () => {
    return request(app)
      .patch("/api/reviews/1?inc_votes=2&animal=cat")

      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});

//NEEDS SOME ERROR HANDLING WORK AFTER PAUL NCHELP, STRUGGLING 23/01 TO REFACTOR
describe.only("Testing Get All Reviews", () => {
  test("Basic Functionality", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews).toHaveLength(13);
        res.body.reviews.forEach((index) => {
          expect(index).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test.only("Basic Functionality with Query options", () => {
    //CANT FIGURE THIS ONE OUT
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeInstanceOf(Array);
        expect(res.body.reviews).toHaveLength(1);
        res.body.reviews.forEach((index) => {
          expect(index).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
          });
        });
      });
  });
  test('sort_by` a column that doesn"t exist', () => {
    return request(app)
      .get("/api/reviews?sort_by=nothing")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test('order !== "asc" / "desc"', () => {
    return request(app)
      .get("/api/reviews?order_by=WRONG")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("category` that is not in the database", () => {
    return request(app)
      .get("/api/reviews?category=nothing")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  test("category` that exists but does not have any reviews associated with it", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});

//ONLY ERROR HANDLED FOR NON-NUMERIAL ID REQUEST
describe.skip("Testing Get Review Comments by Id", () => {
  test("Basic Functionality", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toBeInstanceOf(Array);
        expect(res.body.comments).toHaveLength(3);
        res.body.comments.forEach((index) => {
          expect(index).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(String)
          });
        });
      });
  });
  test('Error Handler, review id doesnt exist', () => {
    return request(app)
      .get("/api/reviews/:f/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
    })
});

//ONLY ERROR HANDLED FOR AN IRRELEVANT QUERY PARAM
describe.skip("Testing Post Comment", () => {
  test("Basic Functionality", () => {
    return request(app)
      .post("/api/reviews/1/comments?username=joe&body=newcomment")
      .expect(200)
      .then((res) => {
        expect(res.body.comment[0]).toMatchObject({
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          review_id: expect.any(Number),
          created_at: expect.any(String)
        });
      });
  });
  test('Error Handler, one of query params not allowed', () => {
    return request(app)
      .post("/api/reviews/1/comments?username=joe&body=newcomment&created_at=wrong")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
    })
    test('Error Handler, query param doesnt exist in database', () => {
      return request(app)
        .post("/api/reviews/1/comments?username=joe&body=newcomment&nothing=wrong")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
      })
});

//NEEDS ERROR HANDLING
describe.skip("Testing Delete Comment", () => {
  test("Basic Functionality", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(200)
      .then((res) => {
        expect(res.body.comment[0]).toMatchObject({
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          review_id: expect.any(Number),
          created_at: expect.any(String)
        });
      });
  });
});

describe.skip("Testing Get All Users", () => {
  test("Get All Users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.users).toBeInstanceOf(Array);
        expect(res.body.users).toHaveLength(4);
        res.body.users.forEach((index) => {
          expect(index).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});

describe.skip("Testing Get User by username", () => {
  test("Get User by Username", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then((res) => {
        expect(res.body.user[0]).toBeInstanceOf(Object);
          expect(res.body.user[0]).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
    
        });
      });
  });
});

describe.skip("Testing patch comment", () => {
  test("Patch comment and adjust vote count", () => {
    return request(app)
      .patch("/api/comments/1?inc_votes=5")
      .expect(200)
      .then((res) => {
        expect(res.body.comment[0]).toBeInstanceOf(Object);
          expect(res.body.comment[0]).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(String)
        });
      });
  });
});