const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");

const request = require("supertest");
const app = require("../app");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("Testing Seed functionality for setting up tables", () => {
  test("Categories table seeding functionality test", () => {
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
  test("Comments table seeding functionality test", () => {
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
  test("Reviews table seeding functionality test", () => {
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
  test("Users table seeding functionality test", () => {
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

describe("Test for Category Endpoint", () => {
  test("Test for Get All Categories", () => {
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

describe("Tests for Review Endpoints", () => {
  describe("Tests for Get Review by ID", () => {
    test("Get Review by ID returns a review when queried with a valid ID", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then((res) => {
          console.log(res.body.review);
          expect(res.body.review).toBeInstanceOf(Object);

          expect(res.body.review).toMatchObject({
            review_id: 1,
            title: "Agricola",
            review_body: "Farmyard fun!",
            designer: "Uwe Rosenberg",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            votes: 1,
            category: "euro game",
            owner: "mallionaire",
            created_at: "2021-01-18T00:00:00.000Z",
          });
        });
    });
    test("Get Review by ID returns an error when queried with an id that doesnt exist", () => {
      return request(app)
        .get("/api/reviews/200")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
    test("Get Review by ID returns an error when queried with an id that is not a number", () => {
      return request(app)
        .get("/api/reviews/abc")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  describe("Tests for Patch Review By ID", () => {
    test("Patch Review by ID, increase votes when given a number", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 4 })
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
    test("Patch Review by ID, decreased votes when given a negative number", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -4 })
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
    test("Patch Review by ID, throws an error when given a non-existent review-ID", () => {
      return request(app)
        .patch("/api/reviews/200")
        .send({ inc_votes: 4 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
    test("Patch Review by ID, throws an error when queried with a non-number", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "a" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Patch Review by ID, throws an error when queried without a value", () => {
      return request(app)
        .patch("/api/reviews/1?")
        .send({ inc_votes: "" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Patch Review by ID, throws an error when query includes non-required keys", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 2, animal: "cat" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  //NEEDS SOME ERROR HANDLING WORK AFTER PAUL NCHELP, STRUGGLING 23/01 TO REFACTOR
  describe.only("Tests for Get Reviews", () => {
    test.only("Get Reviews, returns an array of all reviews when no queries are provided", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          console.log("TEST RES", res.body);

          expect(res.body.reviews).toBeInstanceOf(Array);
          expect(res.body.reviews).toHaveLength(13);
          res.body.reviews.forEach((index) => {
            expect(index).toMatchObject({
              review_id: expect.any(Number),
              title: expect.any(String),
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
    test("Get Reviews, returns an array of all relevant reviews when queried", () => {
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
    test("Get Reviews, throws an array when sort queried with an invalid value", () => {
      return request(app)
        .get("/api/reviews?sort_by=nothing")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Get Reviews, throws an error when order queried with invalid value", () => {
      return request(app)
        .get("/api/reviews?order_by=WRONG")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Get Reviews, throws an error when category queried with a non existent category", () => {
      return request(app)
        .get("/api/reviews?category=nothing")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
    test("Get Reviews, throws an error when category queried with a valid category but has noa ssociated reviews", () => {
      return request(app)
        .get("/api/reviews?category=children's games")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Not Found");
        });
    });
  });
});

describe("Tests for Comment Endpoints", () => {
  //ONLY ERROR HANDLED FOR NON-NUMERIAL ID REQUEST
  describe("Tests for Get Comments by Id", () => {
    test("Get Comments by Review ID, returns a an array of comments when queried with a valid Review ID", () => {
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
              created_at: expect.any(String),
            });
          });
        });
    });
    test("Get Comments by Review ID, throws an error when given an invalid Review ID", () => {
      return request(app)
        .get("/api/reviews/f/comments")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });
  //ONLY ERROR HANDLED FOR AN IRRELEVANT QUERY PARAM
  describe("Tests for Post Comment", () => {
    test("Post Comment by Review ID, inserts a comment to Review table when queried with correct parameters", () => {
      return request(app)
        .post("/api/reviews/1/comments?username=joe&body=newcomment")
        .expect(200)
        .then((res) => {
          expect(res.body.comment[0]).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    test("Post Comment by Review ID, throws an error when queried with invalid parameters", () => {
      return request(app)
        .post(
          "/api/reviews/1/comments?username=joe&body=newcomment&created_at=wrong"
        )
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
    test("Post Comment by Review ID, throws an error when queried with invalid query keys", () => {
      return request(app)
        .post(
          "/api/reviews/1/comments?username=joe&body=newcomment&nothing=wrong"
        )
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("Bad Request");
        });
    });
  });

  //NEEDS ERROR HANDLING
  describe("Tests for Delete Comment", () => {
    test("Delete Comment by Review ID, returns delted comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(200)
        .then((res) => {
          expect(res.body.comment[0]).toMatchObject({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
  });
  describe("Tests for Patch comment", () => {
    test("Patch Comment by ID, increase votes when given a number", () => {
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
            created_at: expect.any(String),
          });
        });
    });
  });
});

describe("Tests for User Endpoints", () => {
  describe("Testing Get All Users", () => {
    test("Get All Users, returns a an array of Users", () => {
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
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });

  describe("Testing Get User by username", () => {
    test("Get Users, returns a an array of Users when queried with a valid search term", () => {
      return request(app)
        .get("/api/users/mallionaire")
        .expect(200)
        .then((res) => {
          expect(res.body.user[0]).toBeInstanceOf(Object);
          expect(res.body.user[0]).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
    });
  });
});
