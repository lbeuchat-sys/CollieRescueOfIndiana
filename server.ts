import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for sending emails
  app.post("/api/send-email", async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Configure SMTP transporter
    // Defaulting to AOL settings as requested
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.aol.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // Usually false for port 587
      auth: {
        user: process.env.SMTP_USER, // e.g., Collierescue1@aol.com
        pass: process.env.SMTP_PASS, // AOL App Password
      },
    });

    try {
      // Send email
      await transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: "sykomare@aol.com",
        replyTo: email,
        subject: `Contact Form: ${subject || "General Inquiry"}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log("dist exists:", fs.existsSync(distPath));
    if (fs.existsSync(distPath)) {
      console.log("dist contents:", fs.readdirSync(distPath));
    }
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
