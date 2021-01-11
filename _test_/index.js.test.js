const app = require("../src/server/index.js");
const supertest = require("supertest");
const request = supertest(app);

describe("Test functionality per web example", () => {
  test("Gets the test endpoint", async (done) => {
    const res = await request.get("/all");

    expect(res.status).toBe(200);

    done();
  });
});

describe("Test Endpoint Response 1", () => {
  test("Obtain 200 server response from call", async (done) => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    done();
  });
});
