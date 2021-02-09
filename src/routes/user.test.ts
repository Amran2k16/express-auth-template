import request from "supertest";
import { app } from "../app";

describe("currentuser route", () => {
  it("responds with details about the current user", async () => {
    const cookie = await global.signin();

    const response = await request(app)
      .get("/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
  });

  it("responds with null if not authenticated", async () => {
    const response = await request(app)
      .get("/users/currentuser")
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull;
  });
});

describe("signin route", () => {
  it("fails when an email that does not exist is supplied", async () => {
    await request(app)
      .post("/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("fails when an incorrect password is supplied", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .post("/users/signin")
      .send({
        email: "test@test.com",
        password: "fasdfasd",
      })
      .expect(400);
  });

  it("responds with a cookie when given valid credentials", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/users/signin")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("signout route", () => {
  it("clears the cookie after signing out", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    const response = await request(app)
      .post("/users/signout")
      .send({})
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("signup route", () => {
  it("returns a 201 on succesfull signup", async () => {
    return request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });

  it("returns a 400 with an invalid email", async () => {
    return request(app)
      .post("/users/signup")
      .send({
        email: "test.com",
        password: "password",
      })
      .expect(400);
  });

  it("returns a 400 with an invalid password", async () => {
    return request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "p",
      })
      .expect(400);
  });

  it("returns a 400 with missing email and password", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
      })
      .expect(400);
    await request(app)
      .post("/users/signup")
      .send({
        password: "asfdasd",
      })
      .expect(400);
  });

  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });

  it("sets a cookie after a succesful sign up", async () => {
    const response = await request(app)
      .post("/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
