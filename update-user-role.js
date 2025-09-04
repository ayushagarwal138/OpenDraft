// Script to update user role to author
// Run this in MongoDB Atlas or locally

// Connect to your MongoDB database and run:
db.users.updateOne(
  { email: "your-email@example.com" }, // Replace with your actual email
  { $set: { role: "author" } }
);

// Or if you want to make all users authors:
// db.users.updateMany({}, { $set: { role: "author" } });

console.log("User role updated to author");
