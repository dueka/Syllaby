import { hashPassword } from "../../utils/auth";
import fs from "fs/promises";
import path from "path";

const DB_FILE = path.join(process.cwd(), "./db.json");

export async function readData() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data from the file", error);
    return { users: [] };
  }
}

async function writeData(data: any) {
  try {
    const write = await fs.writeFile(
      DB_FILE,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
    console.log("Data successfully written to file.", write);
  } catch (error) {
    // Handle errors
    console.error("Error writing data to the file", error);
    throw new Error("Failed to write data to the file");
  }
}

export async function createUser(userData: any) {
  try {
    const { username, password, role } = userData;
    const db = await readData();
    const existingUser = db.users.find(
      (user: any) => user.username === username
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = {
      id: db.users.length + 1,
      username,
      password: hashedPassword,
      role,
    };
    db.users.push(newUser);
    await writeData(db);

    return {
      success: true,
      user: newUser,
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error during user creation:", error);
    return { success: false, message: error };
  }
}
