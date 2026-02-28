const request = require("supertest");
const app = require("../server");

describe("API basic tests", () => {
  test("GET /api/health should return 200", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
  });
});

test("GET /api/health returns json", async () => {
  const res = await request(app).get("/api/health");
  expect(res.headers["content-type"]).toMatch(/json|text/);
});

test("POST /api/auth/login without body returns 400", async () => {
  const res = await request(app).post("/api/auth/login").send({});
  expect(res.statusCode).toBe(400);
});