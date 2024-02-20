import cors from 'cors'
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import express, { Express } from 'express';

import msgRouter from './routes/msg.routes'
import chatRouter from './routes/chat.routes'
import indexRouter from './routes/index.routes'
import memberRouter from './routes/member.routes'
import { CheckIfUserisChatMember, CheckJWTCookie } from './utils/socket';

dotenv.config();


const app: Express = express();
export const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", `${process.env.CLIENT_URL}`],
    methods: ["POST", "GET"],
    credentials: true,
  },
})

io.on("connection", (socket) => {
  const cookie = socket.handshake.headers.cookie
  const user_id = CheckJWTCookie(cookie)

  socket.on("disconnect", (reason) => {
    console.log("Disconnected", reason)
  })
  // socket.on("join-doc-room", async (docId: string) => {
  //   let allowed = false
  //   if (!socket.rooms.has(docId) && user_id) {
  //     const isAutherizedToEdit = await CheckIfUserisChatMember(docId, user_id)
  //     if (isAutherizedToEdit) {
  //       socket.join(docId)
  //       allowed = true
  //     }
  //   }
  // })
  socket.on("join-r", async (chat_id) => {
    console.log("Here", chat_id, user_id)
    if (!socket.rooms.has(chat_id) && user_id) {
      const isAutherizedToEdit = await CheckIfUserisChatMember(chat_id, user_id)
      if (isAutherizedToEdit) {
        console.log("joined")
        socket.join(chat_id)
        socket.to(socket.id).emit("room-status", {
          chat_id,
          msg: "Joined",
        })
      } else {
        socket.to(socket.id).emit("room-status", {
          chat_id,
          msg: "Not Autherized",
        })
      }
    } else if (socket.rooms.has(chat_id)) {
      socket.to(socket.id).emit("room-status", {
        chat_id,
        msg: "Already joined",
      })
    } else {
      socket.to(socket.id).emit("room-status", {
        chat_id,
        msg: "Not Joined",
      })
    }
  })
})


// parsing cokkie values
app.use(cookieParser())
// limit the size of incoming request body and parse i.e convert string json to js object for every incoming request
app.use(express.json({ limit: '20kb' }))
// limiting size of url
app.use(express.urlencoded({ extended: false, limit: '1kb' }));
// // setting up client origin
app.use(cors({ origin: ["http://localhost:5173", `${process.env.CLIENT_URL}`], credentials: true, optionsSuccessStatus: 200 }));



app.use('/', indexRouter)
app.use('/c', chatRouter)
app.use('/msg', msgRouter)
app.use('/mem', memberRouter)



export default app