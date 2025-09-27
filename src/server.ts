import app from "./app";

const server = async () => {
  try {
    app.listen(5000, () => {
      console.log(`Server is running on http://localhost:${5000}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
  }
}; 

server()