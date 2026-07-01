const request = require("supertest");
const app = require("../app");

describe("Authentication API", () => {
  it("should reject register request with empty body", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should reject login request with empty body", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});