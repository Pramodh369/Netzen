const request = require("supertest");
const app = require("../app");

describe("Posts API", () => {
  test("GET /api/posts should respond", async () => {
    const res = await request(app).get("/api/posts");

    expect([200, 304, 401]).toContain(res.statusCode);
  });
});