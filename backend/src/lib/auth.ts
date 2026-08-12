import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import type {} from "better-auth/plugins";
import { admin } from "better-auth/plugins/admin";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI||"");
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000/",
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
  emailAndPassword: { enabled: true },
  plugins: [
    admin({
      defaultRole: "patient",
      adminRole: ["admin", "superadmin"],
    
    }
  )],

  user: {
    additionalFields: {
      specialization: { type: "string", required: false },   //only for doctors
      department: { type: "string", required: false }, 
      gender: { type: "string", required: false },
      bloodGroup: { type: "string", required: false },
      medicalHistory: { type: "string", required: false },
      age: { type: "number", required: false },
      status: { type: "string", required: false, defaultValue: "active" },
      prescriptions: { type: "string[]", required: false },
      apointments: { type: "string[]"}, 
                      },
  },
  
});
