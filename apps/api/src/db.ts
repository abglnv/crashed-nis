import { MongoClient, Db, Collection } from "mongodb";
import { LmsUser, LmsToken } from "@repo/types/lms/interfaces";
import { env } from "./config"

const MONGO_URI = env.MONGO_URI || "mongodb://localhost:27017/lms";
const DB_NAME = "lms";

let client: MongoClient;
let db: Db;
let users: Collection<LmsUser>;
let tokens: Collection<LmsToken>;

export async function connectDb() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    users = db.collection<LmsUser>("users");
    tokens = db.collection<LmsToken>("tokens");
  }
}

export function getUserCollection() {
  return users;
}

export function getTokenCollection() {
  return tokens;
}
