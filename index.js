// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js";
// import eventRoutes from "./routes/events.js";
// import agendaRoutes from "./routes/agenda.js";
// import speakerRoutes from "./routes/speaker.js";
// import organizationRoutes from "./routes/organization.js";
// import eventOrganizerRoutes from "./routes/eventOrganizer.js";
// import partnerRoutes from "./routes/partner.js";
// import sponsorRoutes from "./routes/sponsor.js";
// import attendance from "./routes/attendance.js";
// import { pool } from "./db/config.js";

// dotenv.config();

// const app = express();

// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://karyadi-react-ykxz.onrender.com",
//   "https://karyadi-react-shameer.onrender.com",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/events", eventRoutes);
// app.use("/api/agendas", agendaRoutes);
// app.use("/api/speakers", speakerRoutes);
// app.use("/api/organizations", organizationRoutes);
// app.use("/api/event-organizers", eventOrganizerRoutes);
// app.use("/api/partners", partnerRoutes);
// app.use("/api/sponsors", sponsorRoutes);
// app.use("/api/attendance", attendance);

// // Default route for the API
// // This route will be used to check if the API is running
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // Create tables if they don't exist
// async function initializeDatabase() {
//   try {
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id serial PRIMARY KEY,
//         name character varying(255) NOT NULL,
//         email character varying(255) NOT NULL UNIQUE,
//         password character varying(255) NOT NULL,
//         phone_number character varying(20),
//         user_type character varying(20) NOT NULL,
//         created_on timestamp with time zone DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log("Database tables initialized");
//   } catch (error) {
//     console.error("Error initializing database:", error);
//   }
// }

// initializeDatabase();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
