// CLosure
function createTask(name) {

    // Private variable
    let count = 0;

    return {

        getName() {
            return name;
        },

        getCount() {
            return count;
        },

        reset() {
            count = 0;
        },

        run() {

            count++;

            const loadingTime =
                Math.floor(Math.random() * 1501) + 500;

            const startTime = performance.now();

            return new Promise((resolve, reject) => {

                setTimeout(() => {

                    const endTime = performance.now();

                    const actualTime =
                        Math.round(endTime - startTime);

                    // 30% chance of failure
                    const failed =
                        Math.random() < 0.3;

                    if (failed) {

                        reject({
                            name: name,
                            time: actualTime
                        });

                    } else {

                        resolve({
                            name: name,
                            time: actualTime
                        });

                    }

                }, loadingTime);

            });
        }
    };
}


// CREATE TASKS

const tasks = [

    {
        task: createTask("Load Users"),
        status: "Idle",
        time: null
    },

    {
        task: createTask("Load Posts"),
        status: "Idle",
        time: null
    },

    {
        task: createTask("Load Comments"),
        status: "Idle",
        time: null
    }

];


// DOM ELEMENTS

const tasksContainer =
    document.getElementById("tasks");

const result =
    document.getElementById("result");

const consoleContainer =
    document.getElementById("console");

const runAllButton =
    document.getElementById("runAll");

const runSequentialButton =
    document.getElementById("runSequential");

const runConcurrentButton =
    document.getElementById("runConcurrent");

const resetButton =
    document.getElementById("reset");

const runEventLoopButton =
    document.getElementById("runEventLoop");


// RENDER TASKS

function renderTasks() {

    tasksContainer.innerHTML = "";

    tasks.forEach((item) => {

        const card =
            document.createElement("div");

        card.className = "task-card";

        const statusClass =
            item.status.toLowerCase();

        card.innerHTML = `

            <div class="task-top">

                <div class="task-name">
                    ${item.task.getName()}
                </div>

                <span class="status ${statusClass}">
                    ${item.status}
                </span>

            </div>


            <div class="task-info">

                <div class="info-item">

                    <span class="info-label">
                        Execution count
                    </span>

                    <span class="info-value">
                        ${item.task.getCount()}
                    </span>

                </div>


                <div class="info-item">

                    <span class="info-label">
                        Loading time
                    </span>

                    <span class="info-value">

                        ${
                            item.time !== null
                                ? item.time + " ms"
                                : "—"
                        }

                    </span>

                </div>

            </div>

        `;

        tasksContainer.appendChild(card);

    });
}


// Initial render
renderTasks();


// RUN ONE TASK

async function runTask(index) {

    const item = tasks[index];

    item.status = "Loading";

    item.time = null;

    renderTasks();

    try {

        const result =
            await item.task.run();

        item.status = "Completed";

        item.time = result.time;

    } catch (error) {

        item.status = "Failed";

        item.time = error.time;

    }

    renderTasks();
}


// RUN ALL TASKS

async function runAllTasks() {

    disableButtons();

    result.classList.add("hidden");

    tasks.forEach((item) => {

        item.status = "Loading";

        item.time = null;

    });

    renderTasks();

    const startTime =
        performance.now();

    const promises =
        tasks.map((item) => item.task.run());

    const results =
        await Promise.allSettled(promises);

    results.forEach((response, index) => {

        if (response.status === "fulfilled") {

            tasks[index].status =
                "Completed";

            tasks[index].time =
                response.value.time;

        } else {

            tasks[index].status =
                "Failed";

            tasks[index].time =
                response.reason.time;

        }

    });

    const endTime =
        performance.now();

    const totalTime =
        Math.round(endTime - startTime);

    renderTasks();

    result.innerHTML =
        `All tasks finished · Total time: ${totalTime} ms`;

    result.classList.remove("hidden");

    enableButtons();
}


// SEQUENTIAL EXECUTION

async function runSequential() {

    disableButtons();

    result.classList.add("hidden");

    const startTime =
        performance.now();

    for (let i = 0; i < tasks.length; i++) {

        await runTask(i);

    }

    const endTime =
        performance.now();

    const totalTime =
        Math.round(endTime - startTime);

    result.innerHTML =
        `Sequential execution finished · Total time: ${totalTime} ms`;

    result.classList.remove("hidden");

    enableButtons();
}


// CONCURRENT EXECUTION

async function runConcurrent() {

    disableButtons();

    result.classList.add("hidden");

    const startTime =
        performance.now();

    await Promise.all(
        tasks.map((_, index) =>
            runTask(index)
        )
    );

    const endTime =
        performance.now();

    const totalTime =
        Math.round(endTime - startTime);

    result.innerHTML =
        `Concurrent execution finished · Total time: ${totalTime} ms`;

    result.classList.remove("hidden");

    enableButtons();
}


// RESET

function resetTasks() {

    tasks.forEach((item) => {

        item.task.reset();

        item.status = "Idle";

        item.time = null;

    });

    result.classList.add("hidden");

    renderTasks();
}


// BUTTON STATE

function disableButtons() {

    runAllButton.disabled = true;

    runSequentialButton.disabled = true;

    runConcurrentButton.disabled = true;

    resetButton.disabled = true;
}

function enableButtons() {

    runAllButton.disabled = false;

    runSequentialButton.disabled = false;

    runConcurrentButton.disabled = false;

    resetButton.disabled = false;
}


// EVENT LOOP DEMO

async function eventLoopDemo(log) {

    log("1. Sync start");


    setTimeout(() => {

        log("7. Timer 1");

    }, 0);


    Promise.resolve().then(() => {

        log("4. Promise 1");

    });


    async function asyncFunction() {

        log("2. Async start");

        await Promise.resolve();

        log("5. Async after await");

    }


    asyncFunction();


    Promise.resolve().then(() => {

        log("6. Promise 2");

    });


    setTimeout(() => {

        log("8. Timer 2");

    }, 0);


    log("3. Sync end");
}


function runEventLoopDemo() {

    consoleContainer.innerHTML = "";

    const output = [];

    function log(message) {

        console.log(message);

        output.push(message);

        const line =
            document.createElement("div");

        line.className =
            "console-line";

        line.textContent =
            message;

        consoleContainer.appendChild(line);
    }

    eventLoopDemo(log);
}


// EVENT LISTENERS

runAllButton.addEventListener(
    "click",
    runAllTasks
);

runSequentialButton.addEventListener(
    "click",
    runSequential
);

runConcurrentButton.addEventListener(
    "click",
    runConcurrent
);

resetButton.addEventListener(
    "click",
    resetTasks
);

runEventLoopButton.addEventListener(
    "click",
    runEventLoopDemo
);