// 1

const name = "Miras";
let age = 21;
const active = true;
const courses = ["JavaScript", "React", "Databases"];

const address = {
    city: "Almaty",
    street: "Abay Avenue"
};

const emptyValue = null;
let undefinedValue;

const primitiveValues = [
    name,
    age,
    active,
    emptyValue,
    undefinedValue
];

const referenceValues = [
    courses,
    address
];

const sentence = `${name} is ${age} years old and studies ${courses.join(", ")}.`;

document.getElementById("variables").innerHTML = `
    <div class="result">
        <b>name:</b> ${name} — ${typeof name}
    </div>

    <div class="result">
        <b>age:</b> ${age} — ${typeof age}
    </div>

    <div class="result">
        <b>active:</b> ${active} — ${typeof active}
    </div>

    <div class="result">
        <b>courses:</b> ${courses.join(", ")} — ${typeof courses}
    </div>

    <div class="result">
        <b>address:</b> ${JSON.stringify(address)} — ${typeof address}
    </div>

    <div class="result">
        <b>null:</b> ${emptyValue} — typeof = ${typeof emptyValue}
    </div>

    <div class="result">
        <b>undefined:</b> ${undefinedValue} — typeof = ${typeof undefinedValue}
    </div>

    <div class="result">
        <b>Primitive values:</b> string, number, boolean, null, undefined
    </div>

    <div class="result">
        <b>Reference values:</b> arrays and objects
    </div>

    <div class="result">
        <b>Template literal:</b> ${sentence}
    </div>
`;


// 2

const numbers = [3, 7, 2, 10, 5];

const doubled = numbers.map(number => number * 2);

const greaterThanFive = numbers.filter(number => number > 5);

const firstGreaterThanFive = numbers.find(number => number > 5);

const sum = numbers.reduce((total, number) => total + number, 0);

const hasTen = numbers.includes(10);

document.getElementById("arrays").innerHTML = `
    <div class="result">
        <b>Original:</b> ${numbers.join(", ")}
    </div>

    <div class="result">
        <b>map:</b> ${doubled.join(", ")}
    </div>

    <div class="result">
        <b>filter (> 5):</b> ${greaterThanFive.join(", ")}
    </div>

    <div class="result">
        <b>find (> 5):</b> ${firstGreaterThanFive}
    </div>

    <div class="result">
        <b>reduce (sum):</b> ${sum}
    </div>

    <div class="result">
        <b>includes(10):</b> ${hasTen}
    </div>
`;


// 3

const students = [
    { id: 1, name: "Anna", grade: 85 },
    { id: 2, name: "John", grade: 62 },
    { id: 3, name: "Sara", grade: 91 },
    { id: 4, name: "Mike", grade: 55 }
];

const goodStudents = students.filter(student => student.grade >= 70);

const studentNames = students.map(student => student.name);

const studentWithId3 = students.find(student => student.id === 3);

const topStudent = students.reduce((top, student) =>
    student.grade > top.grade ? student : top
);

const averageGrade =
    students.reduce((sum, student) => sum + student.grade, 0) /
    students.length;

const studentsWithPassed = students.map(student => ({
    ...student,
    passed: student.grade >= 70
}));

document.getElementById("students").innerHTML = `
    <div class="result">
        <b>Grade >= 70:</b>
        ${goodStudents.map(student => student.name).join(", ")}
    </div>

    <div class="result">
        <b>Names:</b> ${studentNames.join(", ")}
    </div>

    <div class="result">
        <b>Student with id 3:</b>
        ${studentWithId3.name}, grade ${studentWithId3.grade}
    </div>

    <div class="result">
        <b>Highest grade:</b>
        ${topStudent.name} — ${topStudent.grade}
    </div>

    <div class="result">
        <b>Average grade:</b> ${averageGrade.toFixed(2)}
    </div>

    <div class="result">
        <b>Passed:</b>
        ${studentsWithPassed.map(student =>
            `${student.name}: ${student.passed}`
        ).join(", ")}
    </div>
`;


// 4. OBJECTS

const user = {
    id: 1,
    name: "Anna",
    age: 21,
    address: {
        city: "Almaty",
        street: "Dostyk Avenue"
    }
};

const readName = user.name;
const readCity = user.address.city;

user.age = 22;

user.email = "anna@example.com";

delete user.address.street;

const {
    name: userName,
    age: userAge
} = user;

const {
    address: { city }
} = user;

document.getElementById("objects").innerHTML = `
    <div class="result">
        <b>Name:</b> ${readName}
    </div>

    <div class="result">
        <b>City:</b> ${readCity}
    </div>

    <div class="result">
        <b>Changed age:</b> ${user.age}
    </div>

    <div class="result">
        <b>Email:</b> ${user.email}
    </div>

    <div class="result">
        <b>Street after delete:</b> ${user.address.street}
    </div>

    <div class="result">
        <b>Destructuring:</b> ${userName}, ${userAge}
    </div>

    <div class="result">
        <b>Nested destructuring:</b> ${city}
    </div>
`;


// 5. VALUES AND REFERENCES

const original = {
    name: "Alice",
    score: 10
};

const copy = original;

copy.score = 50;

const spreadCopy = {
    ...original
};

spreadCopy.score = 100;

const nestedUser = {
    name: "Alice",
    address: {
        city: "Almaty"
    }
};

const shallowCopy = {
    ...nestedUser
};

shallowCopy.address.city = "Astana";

const deepCopy = {
    ...nestedUser,
    address: {
        ...nestedUser.address
    }
};

deepCopy.address.city = "Shymkent";

document.getElementById("references").innerHTML = `
    <div class="result">
        <b>After copy.score = 50:</b>
        original.score = ${original.score}
    </div>

    <div class="result">
        <b>Why?</b>
        Both variables reference the same object.
    </div>

    <div class="result">
        <b>Spread copy:</b>
        spreadCopy.score = ${spreadCopy.score},
        original.score = ${original.score}
    </div>

    <div class="result">
        <b>Nested spread copy:</b>
        original city = ${nestedUser.address.city}
    </div>

    <div class="result">
        <b>Why?</b>
        Spread creates a shallow copy, so nested objects are still shared.
    </div>

    <div class="result">
        <b>Correct nested copy:</b>
        deepCopy.address.city = ${deepCopy.address.city}
    </div>
`;


// 6

function isEven(number) {
    return number % 2 === 0;
}

const getFullName = (firstName, lastName) =>
    `${firstName} ${lastName}`;

function calculatePrice(price, quantity) {
    return price * quantity;
}

const calculateDiscount = (price, percent) =>
    price - price * percent / 100;

function getMax(a, b) {
    return Math.max(a, b);
}

document.getElementById("functions").innerHTML = `
    <div class="result">isEven(10): ${isEven(10)}</div>
    <div class="result">getFullName("Miras", "Nuraliyev"): ${getFullName("Miras", "Nuraliyev")}</div>
    <div class="result">calculatePrice(1000, 3): ${calculatePrice(1000, 3)}</div>
    <div class="result">calculateDiscount(1000, 20): ${calculateDiscount(1000, 20)}</div>
    <div class="result">getMax(10, 25): ${getMax(10, 25)}</div>
`;


// 7

function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

function calculate(a, b, operation) {
    return operation(a, b);
}

document.getElementById("function-values").innerHTML = `
    <div class="result">
        calculate(5, 3, add) = ${calculate(5, 3, add)}
    </div>

    <div class="result">
        calculate(5, 3, multiply) = ${calculate(5, 3, multiply)}
    </div>

    <div class="result">
        <b>Can functions be stored in variables?</b> Yes.
    </div>

    <div class="result">
        <b>Can functions be passed to other functions?</b> Yes.
    </div>

    <div class="result">
        <b>add vs add():</b>
        add refers to the function itself, while add() executes the function.
    </div>
`;


// 8

const globalMessage = "global";

function testScope() {
    const functionMessage = "function";

    let output = `
        <div class="result">Function level: ${functionMessage}</div>
    `;

    if (true) {
        const blockMessage = "block";

        output += `
            <div class="result">Block level: ${blockMessage}</div>
            <div class="result">Global level: ${globalMessage}</div>
        `;
    }

    return output;
}

const scopeVar = "outside var";
let scopeLet = "outside let";
const scopeConst = "outside const";

document.getElementById("scope").innerHTML = `
    <div class="result">Global: ${globalMessage}</div>

    ${testScope()}

    <div class="result">
        <b>Global scope:</b> accessible throughout the script.
    </div>

    <div class="result">
        <b>Function scope:</b> variables inside a function are available there.
    </div>

    <div class="result">
        <b>Block scope:</b> let and const inside {} are only available in that block.
    </div>

    <div class="result">
        <b>var:</b> function-scoped.
    </div>

    <div class="result">
        <b>let:</b> block-scoped and can be reassigned.
    </div>

    <div class="result">
        <b>const:</b> block-scoped and cannot be reassigned.
    </div>
`;


// 9

function createCounter() {
    let count = 0;

    return function () {
        count++;
        return count;
    };
}

const counter = createCounter();

const counterResults = [
    counter(),
    counter(),
    counter()
];

const secondCounter = createCounter();

const addFive = createAdder(5);

function createAdder(value) {
    return function (number) {
        return value + number;
    };
}

document.getElementById("closure").innerHTML = `
    <div class="result">
        counter(): ${counterResults[0]}
    </div>

    <div class="result">
        counter(): ${counterResults[1]}
    </div>

    <div class="result">
        counter(): ${counterResults[2]}
    </div>

    <div class="result">
        New counter(): ${secondCounter()}
    </div>

    <div class="result">
        addFive(10): ${addFive(10)}
    </div>

    <div class="result">
        addFive(20): ${addFive(20)}
    </div>

    <div class="result">
        <b>Closure:</b>
        the inner function remembers variables from its outer function,
        even after the outer function has finished.
    </div>
`;


// 10

const numbers10 = [10, 20, 30, 40];

const [first, second] = numbers10;

const user10 = {
    id: 1,
    name: "Anna",
    age: 21
};

const {
    name: user10Name,
    age: user10Age
} = user10;

const newNumbers = [...numbers10, 50];

const newUser = {
    ...user10,
    age: 22
};

const userWithEmail = {
    ...user10,
    email: "anna@example.com"
};

const arrayA = [1, 2, 3];
const arrayB = [4, 5, 6];

const combined = [...arrayA, ...arrayB];

function sumNumbers(...numbers) {
    return numbers.reduce((total, number) => total + number, 0);
}

document.getElementById("spread-rest").innerHTML = `
    <div class="result">
        <b>First two:</b> ${first}, ${second}
    </div>

    <div class="result">
        <b>User name and age:</b> ${user10Name}, ${user10Age}
    </div>

    <div class="result">
        <b>New numbers:</b> ${newNumbers.join(", ")}
    </div>

    <div class="result">
        <b>New user:</b> ${JSON.stringify(newUser)}
    </div>

    <div class="result">
        <b>User with email:</b> ${JSON.stringify(userWithEmail)}
    </div>

    <div class="result">
        <b>Original user:</b> ${JSON.stringify(user10)}
    </div>

    <div class="result">
        <b>Combined arrays:</b> ${combined.join(", ")}
    </div>

    <div class="result">
        <b>sum(1, 2):</b> ${sumNumbers(1, 2)}
    </div>

    <div class="result">
        <b>sum(1, 2, 3, 4):</b> ${sumNumbers(1, 2, 3, 4)}
    </div>

    <div class="result">
        <b>Spread:</b> expands an array/object into individual values/properties.
    </div>

    <div class="result">
        <b>Rest:</b> collects multiple values into an array.
    </div>
`;


// 11

const userWithAddress = {
    name: "Anna",
    address: {
        city: "Almaty"
    }
};

const userWithoutAddress = {
    name: "John"
};

// This would cause an error:
// userWithoutAddress.address.city

const city1 = userWithAddress.address?.city;

const city2 =
    userWithoutAddress.address?.city ?? "City not specified";

const testValues = [0, "", false, null, undefined];

const comparison = testValues.map(value => ({
    value,
    orResult: value || "default",
    nullishResult: value ?? "default"
}));

document.getElementById("optional").innerHTML = `
    <div class="result">
        <b>User with address:</b> ${city1}
    </div>

    <div class="result">
        <b>User without address:</b> ${city2}
    </div>

    <div class="result">
        <b>0:</b> || → ${comparison[0].orResult},
        ?? → ${comparison[0].nullishResult}
    </div>

    <div class="result">
        <b>"" :</b> || → ${comparison[1].orResult},
        ?? → ${comparison[1].nullishResult}
    </div>

    <div class="result">
        <b>false:</b> || → ${comparison[2].orResult},
        ?? → ${comparison[2].nullishResult}
    </div>

    <div class="result">
        <b>null:</b> || → ${comparison[3].orResult},
        ?? → ${comparison[3].nullishResult}
    </div>

    <div class="result">
        <b>undefined:</b> || → ${comparison[4].orResult},
        ?? → ${comparison[4].nullishResult}
    </div>

    <div class="result">
        <b>Observation:</b>
        || treats 0, "", and false as missing values.
        ?? only treats null and undefined as missing.
    </div>
`;


// FINAL TASK

const finalStudents = [
    {
        id: 1,
        name: "Anna",
        age: 20,
        grades: [85, 90, 88]
    },
    {
        id: 2,
        name: "John",
        age: 21,
        grades: [60, 65, 70]
    },
    {
        id: 3,
        name: "Sara",
        age: 19,
        grades: [95, 92, 98]
    },
    {
        id: 4,
        name: "Mike",
        age: 22,
        grades: [50, 55, 60]
    },
    {
        id: 5,
        name: "Emma",
        age: 20,
        grades: [75, 80, 78]
    }
];

function getAverage(grades) {
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
}

function getStudentAverage(student) {
    return getAverage(student.grades);
}

function getPassedStudents(students) {
    return students.filter(student => getStudentAverage(student) >= 70);
}

function getStudentNames(students) {
    return students.map(student => student.name);
}

function findStudent(students, id) {
    return students.find(student => student.id === id);
}

function getTopStudent(students) {
    return students.reduce((top, student) =>
        getStudentAverage(student) > getStudentAverage(top)
            ? student
            : top
    );
}

const passedStudents = getPassedStudents(finalStudents);

const finalNames = getStudentNames(finalStudents);

const foundStudent = findStudent(finalStudents, 3);

const finalTopStudent = getTopStudent(finalStudents);

const finalResults = finalStudents.map(student => ({
    id: student.id,
    name: student.name,
    average: Number(getStudentAverage(student).toFixed(2)),
    passed: getStudentAverage(student) >= 70
}));

document.getElementById("final-task").innerHTML = `
    <h3>Students</h3>

    ${finalStudents.map(student => `
        <div class="student-card">
            <b>${student.name}</b>
            <br>
            Age: ${student.age}
            <br>
            Grades: ${student.grades.join(", ")}
            <br>
            Average: ${getStudentAverage(student).toFixed(2)}
        </div>
    `).join("")}

    <div class="result">
        <b>Passed students:</b>
        ${passedStudents.map(student => student.name).join(", ")}
    </div>

    <div class="result">
        <b>Student names:</b>
        ${finalNames.join(", ")}
    </div>

    <div class="result">
        <b>findStudent(id = 3):</b>
        ${foundStudent.name}
    </div>

    <div class="result">
        <b>Top student:</b>
        ${finalTopStudent.name}
        — ${getStudentAverage(finalTopStudent).toFixed(2)}
    </div>

    <h3>Final Array</h3>

    <div class="result">
        <pre>${JSON.stringify(finalResults, null, 2)}</pre>
    </div>
`;