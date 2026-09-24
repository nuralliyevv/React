JavaScript Runtime & Async

This is a small JavaScript project made with HTML, CSS and Vanilla JavaScript.

The project demonstrates:

* Closures
* Promises
* async/await
* setTimeout
* Call Stack
* Event Loop
* Tasks and Microtasks

Tasks

There are three tasks:

* Load Users
* Load Posts
* Load Comments

Each task has its own private counter. The counter is inside the createTask() function, so it cannot be accessed directly from outside. I can only change it using getCount() and reset(). This is an example of a closure.

Each task takes a random time from 500 to 2000 ms and can randomly fail.

Call Stack

For example, when I call:

runTask(0);

the function is added to the Call Stack. Inside it, task.run() creates a Promise and starts setTimeout(). When await is reached, the function waits for the Promise, so it is removed from the Call Stack. JavaScript can continue doing other work.

setTimeout

setTimeout() does not block JavaScript. While the timer is waiting, JavaScript can execute other synchronous code and process microtasks. When the timer finishes, its callback is added to the Task Queue and will be executed by the Event Loop.

Promises and Errors

For running all tasks, I use Promise.allSettled(). It waits for all Promises, even if some tasks fail.

For concurrent execution, I use Promise.all() to start the tasks at approximately the same time.

Errors are handled with try/catch, so a failed task does not break the whole application.

Sequential vs Concurrent

In sequential execution, each task waits for the previous one:

await task1.run();
await task2.run();
await task3.run();

In concurrent execution, all tasks start together:

await Promise.all([
    task1.run(),
    task2.run(),
    task3.run()
]);

Sequential execution takes approximately the sum of all task times. Concurrent execution takes approximately the time of the longest task, so it is usually faster.

Event Loop

Before running the demo, my predicted output was:

Sync start
Async start
Sync end
Promise 1
Async after await
Promise 2
Timer 1
Timer 2

The actual output was the same:

Sync start
Async start
Sync end
Promise 1
Async after await
Promise 2
Timer 1
Timer 2

First, synchronous code runs on the Call Stack. Then JavaScript processes microtasks such as Promise callbacks and code after await. After that, it processes tasks such as setTimeout() callbacks.

Tasks and Microtasks

Microtasks include:

* Promise callbacks
* code after await

Tasks include:

* setTimeout() callbacks

Microtasks are processed before the next task.

Conclusion

This project helped me understand how JavaScript handles asynchronous code, closures, Promises, the Call Stack and the Event Loop.