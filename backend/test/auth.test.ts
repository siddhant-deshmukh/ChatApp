// jest.useFakeTimers()

import app from "../app"

import dotenv from "dotenv"
import request from "supertest"
import mongoose from "mongoose";
import User from "../models/users";

dotenv.config()

// beforeAll(async () => {
//   console.log(process.env.TEST_MONGODB_CONNECTION_STRING)
//   const mong = await mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string)
//   console.log("Conneted to database", mong.connection.id)
// })

// afterAll(async () => {
//   await User.deleteMany();
//   await mongoose.connection.close();
// });

const emails = [
  "meow@meow.com",
  "meow0@meow.com",
  "meow1@meow.com",
  "meow2@meow.com",
  "meow3@meow.com",
  "meow4@meow.com",
  "meow5@meow.com",
  "meow6@meow.com",
  "meow7@meow.com",
  "meow8@meow.com",
  "meow9@meow.com",
  "meow10@meow.com",
  "meow11@meow.com",
  "meow12@meow.com",
  "meow13@meow.com",
  "meow14@meow.com",
  "meow15@meow.com",
  "meow16@meow.com",
  "meow17@meow.com",
  "meow18@meow.com",
  "meow19@meow.com",
]
const right_long_password = "12345678901234567890"
const wrong_long_password = "123456789012345678901"
const wrong_short_password = "1234"
const right_short_password = "12345"

const the_password = "password"
const wrong_password = "passwoord"

const right_long_name = "12345678901234567890"
const wrong_long_name = "123456789012345678901"
const wrong_short_name = "1234"
const right_short_name = "12345"

const the_name = "Siddhant Deshmukh"

describe("GET /", () => {
  let access_token
  let cookies: undefined | string[]
  let email = "meowtemp@meow.com"
  let password = the_password

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string);

    const res = await request(app).post("/register").send({
      name: the_name,
      email,
      password
    })

    cookies = res.get('Set-Cookie')
    expect(cookies).toBeDefined()

    access_token = cookies.find((cookie) => cookie.startsWith("access_token=")) //example: access_token=duggu; Path=/; HttpOnly; Secure

    expect(res.statusCode).toBe(201)
    expect(access_token).toBeDefined()
    expect(access_token).toMatch(/HttpOnly/)
    // console.log(process.env.TEST_MONGODB_CONNECTION_STRING)
  });

  /* Dropping the database and closing connection after each test. */
  afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await User.deleteMany({})
    await mongoose.connection.close();
  });

  it('/ checking can we get user info from token', async () => {
    if (cookies) {
      const res = await request(app).get('/').set('Cookie', cookies)
      expect(res.body.user._id).toBeDefined()
      expect(res.body.user.name).toBeDefined()
      expect(res.body.user.email).toBeDefined()
      expect(res.body.user.password).toBeUndefined()
    }

  })
})

describe("POST /register", () => {
  beforeAll(async () => {
    // console.log(process.env.TEST_MONGODB_CONNECTION_STRING)
    await mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string);
  });

  /* Dropping the database and closing connection after each test. */
  afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await User.deleteMany({})
    await mongoose.connection.close();
  });

  it('checking cookie and res body', async () => {

    const res = await request(app).post("/register").send({
      name: the_name,
      email: emails[0],
      password: the_password
    })

    const cookies = res.get('Set-Cookie')
    expect(cookies).toBeDefined()
    const access_token = cookies.find((cookie) => cookie.startsWith("access_token=")) //example: access_token=duggu; Path=/; HttpOnly; Secure

    expect(res.statusCode).toBe(201)
    expect(res.body.user._id).toBeDefined()
    expect(res.body.user.password).toBeUndefined()
    expect(res.headers['set-cookie']).toBeDefined()
    expect(access_token).toBeDefined()
    expect(access_token).toMatch(/HttpOnly/) //cookie must be httponly
  })
  it('using same email twice : 409 conflict', async () => {
    let email = emails[1]
    let password = the_password

    const res = await request(app).post("/register").send({
      name: the_name,
      email,
      password
    })
    expect(res.statusCode).toBe(201)

    const res2 = await request(app).post("/register").send({
      name: the_name,
      email,
      password
    })
    expect(res2.statusCode).toBe(409) //status code of conflict
  })
  it('edge cases password length : 201 positive', async () => {

    const res = await request(app).post("/register").send({
      name: the_name,
      email: emails[2],
      password: right_short_password
    })

    expect(res.statusCode).toBe(201)


    const res2 = await request(app).post("/register").send({
      name: the_name,
      email: emails[3],
      password: right_long_password
    })

    expect(res2.statusCode).toBe(201)
  })
  it('edge cases password length : 400 negative', async () => {

    const res = await request(app).post("/register").send({
      name: the_name,
      email: emails[4],
      password: wrong_short_password
    })
    expect(res.statusCode).toBe(400)


    const res2 = await request(app).post("/register").send({
      name: the_name,
      email: emails[5],
      password: wrong_long_password
    })
    expect(res2.statusCode).toBe(400)
  })
  it('edge cases name length : 400 negative', async () => {

    const res = await request(app).post("/register").send({
      name: wrong_short_name,
      email: emails[6],
      password: wrong_short_password
    })
    expect(res.statusCode).toBe(400)


    const res2 = await request(app).post("/register").send({
      name: wrong_long_name,
      email: emails[7],
      password: wrong_long_password
    })
    expect(res2.statusCode).toBe(400)
  })
})

describe("POST /login", () => {

  let email = "meowlogin@meow.com"
  let password = the_password
  let fake_password = wrong_password
  let fake_email = "fake@fake.com"

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string);

    const response = await request(app).post("/register").send({
      name: the_name,
      email,
      password
    })
    expect(response.statusCode).toBe(201)
    // console.log(process.env.TEST_MONGODB_CONNECTION_STRING)
  });

  /* Dropping the database and closing connection after each test. */
  afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await User.deleteMany({})
    await mongoose.connection.close();
  });

  it('/login checking cookie and res body', async () => {
    const res = await request(app).post('/login').send({
      email,
      password
    })
    const cookies = res.get('Set-Cookie')
    expect(cookies).toBeDefined()
    const access_token = cookies.find((cookie) => cookie.startsWith("access_token=")) //example: access_token=duggu; Path=/; HttpOnly; Secure

    expect(res.statusCode).toBe(200)
    expect(res.body.user._id).toBeDefined()
    expect(res.body.user.password).toBeUndefined()
    expect(res.headers['set-cookie']).toBeDefined()
    expect(access_token).toBeDefined()
    expect(access_token).toMatch(/HttpOnly/)
  })
  it('with wrong password', async () => {
    const res = await request(app).post('/login').send({
      email,
      password: fake_password
    })
    expect(res.statusCode).toBe(406)
  })
  it('with wrong email that dont exist ', async () => {
    const res = await request(app).post('/login').send({
      email: fake_email,
      password: fake_password
    })
    expect(res.statusCode).toBe(404)
  })
  it('without password', async () => {
    const res = await request(app).post('/login').send({
      name: the_name,
      email,
    })
    expect(res.statusCode).toBe(400)
  })
  it('without email', async () => {
    const res = await request(app).post('/login').send({
      name: the_name,
      password,
    })
    expect(res.statusCode).toBe(400)
  })
})


// const res = await request(app).get('/').set('Cookie', cookies).send({
//   email,
//   password
// })