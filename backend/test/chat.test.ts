// jest.useFakeTimers()

import app from "../app"
import User from "../models/users";
import Chat from "../models/chat";
import Chat_User from "../models/chat_users";

import dotenv from "dotenv"
import request from "supertest"
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';

dotenv.config()

const name = "New name of chat"
const description = "Description of chat"

const valid_name_min = "t"
const invalid_name_min = ""
const valid_name_max = "123456789012345678901234567890" //length : 30
const invalid_name_max = "1234567890123456789012345678901"

const valid_description_min = "d"
const invalid_description_min = ""
const valid_description_max = "1234567890123456789012345678901234567890123456789012345678901234567890" //length : 70
const invalid_description_max = "12345678901234567890123456789012345678901234567890123456789012345678901"

const valid_limit_min = 1
const invalid_limit_min = 0
const valid_limit_max = 100
const invalid_limit_max = 101

const valid_skip_min = 0
const invalid_skip_min = -1


describe('POST /c', () => {
  let access_token
  let cookies: string[] = []

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string);
    const name = "Duggu meoW"
    const password = "password"
    const email = "meowchat@gmail.com"

    const res = await request(app).post("/register").send({
      name,
      email,
      password
    })

    cookies = res.get('Set-Cookie')
    expect(cookies).toBeDefined()

    access_token = cookies.find((cookie) => cookie.startsWith("access_token=")) //example: access_token=duggu; Path=/; HttpOnly; Secure

    expect(res.statusCode).toBe(201)
    expect(access_token).toBeDefined()
    expect(access_token).toMatch(/HttpOnly/)
  });

  /* Dropping the database and closing connection after each test. */
  afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await User.deleteMany({})
    await Chat.deleteMany({})
    await Chat_User.deleteMany({})
    await mongoose.connection.close();
  });

  test.each([
    { status: 201, name, description, type: "group" },
    { status: 201, name: valid_name_min, description, type: "group" },
    { status: 201, name: valid_name_max, description, type: "group" },
    { status: 201, name, description: valid_description_min, type: "group" },
    { status: 201, name, description: valid_description_max, type: "group" },
    { status: 201, name: valid_name_min, description: valid_description_max, type: "group" },
    { status: 400, name: invalid_name_min, description, type: "group" },
    { status: 400, name: invalid_name_max, description, type: "group" },
    { status: 400, name, description: invalid_description_min, type: "group" },
    { status: 400, name, description: invalid_description_max, type: "group" },
    { status: 400, name: invalid_name_min, description: invalid_description_max, type: "group" },
  ])('$status | createing chat | name:$name ; description:$description', async ({ status, description, name }) => {
    const res = await request(app).post("/c").set('Cookie', cookies).send({
      name,
      description,
      type: "group"
    })

    expect(res.statusCode).toBe(status)
    if (status < 300) {
      expect(res.body.chat).toBeDefined()
      expect(res.body.chat._id).toBeDefined()
      expect(res.body.chat.name).toBe(name)
      expect(res.body.chat.description).toBe(description)
      expect(res.body.chat.num_members).toBe(1)
    } else {
      expect(res.body.chat).toBeUndefined()
    }
  })
})


describe('GET /c', () => {
  let access_token
  let cookies: string[] = []
  let chatSnippets: { name: string, _id: string }[] = []

  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_MONGODB_CONNECTION_STRING as string);
    await User.deleteMany({})
    await Chat.deleteMany({})
    await Chat_User.deleteMany({})

    const name = "Duggu meoW"
    const password = "password"
    const email = "meowchat@gmail.com"

    const res = await request(app).post("/register").send({
      name,
      email,
      password
    })

    cookies = res.get('Set-Cookie')
    expect(cookies).toBeDefined()

    access_token = cookies.find((cookie) => cookie.startsWith("access_token=")) //example: access_token=duggu; Path=/; HttpOnly; Secure

    expect(res.statusCode).toBe(201)
    expect(access_token).toBeDefined()
    expect(access_token).toMatch(/HttpOnly/)


    for (let i = 0; i < 20; i++) {

      let name = faker.lorem.lines(1).slice(0, 30)
      let description = faker.lorem.lines(1).slice(0, 70)
      const res = await request(app).post("/c").set('Cookie', cookies).send({
        name,
        description,
        type: "group"
      })
      expect(res.statusCode).toBe(201)
      expect(res.body.chat).toBeDefined()
      expect(res.body.chat._id).toBeDefined()
      expect(res.body.chat.name).toBeDefined()

      chatSnippets.push({ _id: res.body.chat._id as string, name: res.body.chat.name as string })
    }
  });

  /* Dropping the database and closing connection after each test. */
  afterAll(async () => {
    // await mongoose.connection.dropDatabase();
    await User.deleteMany({})
    await Chat.deleteMany({})
    await Chat_User.deleteMany({})
    await mongoose.connection.close();
  });



  test.each([
    { limit: 5, skip: 2, status: 200 },
    { limit: 10, skip: 0, status: 200 },
    { limit: 30, skip: 4, status: 200 },
    { limit: 1, skip: 10, status: 200 },
    { limit: 10, skip: 20, status: 200 },
    { limit: 10, skip: 30, status: 200 },

    { limit: valid_limit_min, skip: 3, status: 200 },
    { limit: valid_limit_min, skip: 30, status: 200 },
    { limit: valid_limit_max, skip: 20, status: 200 },
    { limit: valid_limit_max, skip: valid_skip_min, status: 200 },

    { limit: invalid_limit_min, skip: 3, status: 400 },
    { limit: invalid_limit_max, skip: invalid_skip_min, status: 400 },
    { limit: valid_limit_max, skip: invalid_skip_min, status: 400 },
  ])('$status | getting chats | limit:$limit, skip:$skip', async ({ limit, skip, status }) => {

    const res = await request(app).get("/c").set('Cookie', cookies).query({ limit, skip })
    expect(res.statusCode).toBe(status)
    if(status < 400){
      expect(res.body.chats).toBeDefined()
  
      chatSnippets.slice().reverse().slice(skip, skip + limit).forEach(({ _id, name }, index) => {
        expect(_id).toBe(res.body.chats[index]._id)
        expect(name).toBe(res.body.chats[index].name)
      })
      expect(chatSnippets.slice(skip, skip+limit).length).toBe(res.body.chats.length)
    } else {
      expect(res.body.chats).toBeUndefined()
    }
    // console.log(res.body.chats, chatSnippets.slice().reverse().slice(skip, skip + limit))
  })
})
