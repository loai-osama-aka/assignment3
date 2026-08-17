// Part1: Node Internals
//Q.1 What is the Node.js Event Loop?
/*
The event loop in Node.js is a mechanism that allows asynchronous tasks to be handled efficiently without blocking the execution of other operations.
when the nodejs application runs the event loop start and process the synchronous code first then moves to handle asynchronous tasks
so when the call stack is empty the event loop go to the event queue (when the thread pool finish its tasks it send callbacks to the event queue) after that  The event loop processes these callbacks
the event loop have 5 phases
1-time operations [setTimeOut,setInterval] 
2-os Operations [http server]
3-long term operations [fs,crypto]
4-rest
5-setImmediate,then restart
*/
// =============================================================
// Q2-What is Libuv and What Role Does It Play in Node.js?
/*
Nodejs uses the libuv C library to manage asynchronous operations.
 It maintains a thread pool to handle heavy tasks like file I/O and network requests without blocking the event loop.
 the nodejs itself run javascript using V8 engine but it doesnot handle file system operations,network operations and timer operations.
 the libuv C library deal with these async operations
*/
// =============================================================
//Q3- How Does Node.js Handle Asynchronous Operations Under the Hood?
/*
nodejs dont wait until the async operations finish to continue,Nodejs starts the Async operations and continues executing the rest of the JavaScript code.
Depending on the operation, it  handled by  by Libuv's Thread Pool. When the operation finishes, the callback becomes ready to run.

Then the Event Loop eventually takes that callback and puts it on the Call Stack when the stack is free of any sync operations
*/
// =============================================================
// Q-4 What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
/*
The Call Stack is where JavaScript functions are currently being executed.

The Event Queue contains callbacks that are ready to be executed but are waiting for the Call Stack to become empty.

The Event Loop is basically the thing that connects them. It keeps checking:
*/
// =============================================================
// Q5 What is the Node.js Thread Pool and How to Set the Thread Pool Size?
/*
The Thread Pool is a group of threads provided by Libuv that Nodejs can use for some operations that would otherwise block the main thread.

By default, the Thread Pool has 4 threads.

Some operations such as certain fs operations, crypto and zlib operations can use the Thread Pool.

We can change its size using the `UV_THREADPOOL_SIZE` environment variable.
ex:
UV_THREADPOOL_SIZE=8 node index.js
this  change the thread pool to 8 threads but this will effect the cpu of your device or server
*/
// =============================================================
// Q6 How Does Node.js Handle Blocking and Non-Blocking Code Execution?
/*
Node.js Handle Blocking and Non-Blocking Code Execution using the event loop which manage the I/O operations The event loop allows non-blocking operations to run concurrently
Blocking in NodeJS the event loop pauses the execution of the program until the operation completes.
while non-blocking operations start immediately and allow the program to continue executing other tasks.
the event loop continues to run the non blocking opertations ensureing the programs stay responsive and not freezing waiting for the other operation to finish

*/

// =============================================================
// Part2: Simple CRUD Operations Using Express.js:
//1-Create an API that adds a new user to your users stored in a JSON file. add user
import express from "express";
import path from "node:path";
import fs from "node:fs";

const app = express();

app.use(express.json());
app.post("/add-user", (req, res) => {
  const { name, email, age } = req.body;
  let data = fs.readFileSync(path.resolve("./users.json"), "utf-8");
  data = JSON.parse(data);
  const userExist = data.find((elem) => {
    return elem.email == email;
  });
  if (userExist) {
    res.json({ message: "User already Exist!" });
  } else {
    let id = data.length + 1;
    data.push({ id, name, age, email });
    fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(data));
    res.json({ message: "user added Successfully", data: data });
  }
});
// =============================================================
//2- Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params.
app.put("/update-user-data/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  let data = fs.readFileSync(path.resolve("./users.json"), "utf-8");
  data = JSON.parse(data);
  console.log(data);
  const userData = data.find((elem) => {
    return elem.id == id;
  });
  const userIndex = data.findIndex((elem) => {
    return elem.id == id;
  });
  if (userData) {
    name ? (data[userIndex].name = name) : null;
    email ? (data[userIndex].email = email) : null;
    age ? (data[userIndex].age = age) : null;
    console.log(data);
    fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(data));

    res.json({ message: "User data updated succesfully", data });
  }
});
// =============================================================
// 3-Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params.
app.delete("/delete-user", (req, res) => {
  const { id } = req.query;
  let data = fs.readFileSync(path.resolve("./users.json"), "utf-8");
  data = JSON.parse(data);
  const userIndex = data.findIndex((elem) => {
    return elem.id == id;
  });
  if (userIndex >= 0) {
    data.splice(userIndex, 1);
    fs.writeFileSync(path.resolve("./users.json"), JSON.stringify(data));
    res.json({ message: "User  deleted succesfully", data });
  } else {
    res.json({ message: "user not found" });
  }
});
// =============================================================
//4-Create an API that gets a user by their name. The name will be provided as a query parameter.
app.get("/get-user-by-name", (req, res) => {
  const { name } = req.query;
  let data = fs.readFileSync(path.resolve("./users.json"), "utf-8");
  data = JSON.parse(data);
  const userExist = data.filter((elem) => {
    return elem.name == name;
  });

  if (userExist.length != 0) {
    res.json({ message: userExist });
  } else {
    res.json({ message: "User name not Found!" });
  }
});
// =============================================================
//5- Create an API that gets all users from the JSON file.
app.get("/get-all-user", (req, res) => {
  fs.readFile(path.resolve("./users.json"), "utf-8", (error, data) => {
    if (error) {
      res.json({ message: "Error in reading file" });
    } else {
      data = JSON.parse(data);
      console.log(data);
      res.json({ message: data });
    }
  });
});
// =============================================================
//6- Create an API that filters users by minimum age.
app.get("/get-user-by-age/filter", (req, res) => {
  const { minAge } = req.query;
  let data = fs.readFileSync(path.resolve("./users.json"), "utf-8");
  data = JSON.parse(data);
  const userMinAge = data.filter((elem) => {
    return elem.age >= minAge;
  });

  if (userMinAge.length != 0) {
    res.json({ message: userMinAge });
  } else {
    res.json({ message: "No user Found!" });
  }
});
// =============================================================
// get user by id
//7-Create an API that gets User by ID.
app.get("/get-user-by-id/:id", (req, res) => {
  const { id } = req.params;
  fs.readFile(path.resolve("./users.json"), "utf-8", (error, data) => {
    if (error) {
      res.json({ message: "Error in reading file" });
    } else {
      data = JSON.parse(data);
      const userData = data.find((elem) => {
        return elem.id == id;
      });
      if (userData) {
        res.json({ message: userData });
      } else {
        res.json({ message: "User not Found!" });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
