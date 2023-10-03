import { hashPassword } from "../../utils/auth";
import fs from "fs/promises";
import path from "path";

const DB_FILE = path.join(process.cwd(), "./db.json");

// Create a function to read data from the JSON file
async function readData() {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Handle errors, e.g., if the file doesn't exist, return an empty object
    console.error("Error reading data from the file", error);
    return { users: [] };
  }
}

// Create a function to write data to the JSON file
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
    const { username, password } = userData;
    const db = await readData(); // Read data from the JSON file

    // Check if the user already exists
    const existingUser = db.users.find(
      (user: any) => user.username === username
    );
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash the user's password before saving it to the database
    const hashedPassword = await hashPassword(password);

    // Create the new user object
    const newUser = {
      id: db.users.length + 1, // You should use a unique ID mechanism for your database
      username,
      password: hashedPassword, // Store the hashed password
    };

    // Add the new user to the database
    db.users.push(newUser);

    // Write the updated data back to the JSON file
    await writeData(db);

    // Return the newly created user
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
