import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db/config.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import eventRoutes from "./routes/events.js";
import agendaRoutes from "./routes/agenda.js";
import speakerRoutes from "./routes/speaker.js";
import organizationRoutes from "./routes/organization.js";
import eventOrganizerRoutes from "./routes/eventOrganizer.js";
import partnerRoutes from "./routes/partner.js";
import sponsorRoutes from "./routes/sponsor.js";
import collaboratorRoutes from "./routes/collaborator.js";
import attendance from "./routes/attendance.js";
import userProfileRoutes from "./routes/userProfile.js";
import jobApplicationRoutes from "./routes/jobApplication.js";
import jobPostRoutes from "./routes/jobPost.js";
import formsRoutes from "./routes/forms.js";
import certificationRoutes from "./routes/certifications.js";
import educationRoutes from "./routes/educationHistory.js";

// Import all models to ensure they are registered with Sequelize
import "./models/index.js";

dotenv.config();
const app = express();

const allowedOrigins = [

  // for local development
  "http://localhost:5173",

  // for production (main) branch
  "https://www.karyaditalents.com",
  "https://karyadi-react-ykxz.onrender.com",

  // for development branch
  "https://karyadi-react-dev.onrender.com",
  "https://karyadi-react-express-dev.onrender.com",

  // for shameer-test branch 
  "https://karyadi-react-shameer.onrender.com",

];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/agendas", agendaRoutes);
app.use("/api/speakers", speakerRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/event-organizers", eventOrganizerRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/collaborators", collaboratorRoutes);
app.use("/api/attendance", attendance);
app.use("/api/profile", userProfileRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/job-posts", jobPostRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/education-history", educationRoutes);

// Default route for the API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Initialize database with Sequelize
async function initializeDatabase() {
  try {
    // This will create tables if they don't exist and apply any pending migrations
    // force: false means it won't drop existing tables
    // alter: true means it will modify existing tables to match the models
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1); // Exit if database initialization fails
  }
}

// Start server only after database is initialized
const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to start server:", error);
});
