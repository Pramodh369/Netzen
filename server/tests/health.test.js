const request = require("supertest");
const app = require("../app");

describe("Health API", () => {
  it("should return API status", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Netzen API is running");
  });
});