
const entryDate = document.getElementById("entryDate");
const entryTime = document.getElementById("entryTime");

const overallSymptoms =
    document.getElementById("overallSymptoms");

const overallSymptomsValue =
    document.getElementById("overallSymptomsValue");

const dbsProgram =
    document.getElementById("dbsProgram");

const dbsLevel =
    document.getElementById("dbsLevel");

const notes =
    document.getElementById("notes");

const saveButton =
    document.getElementById("saveButton");

const entryList =
    document.getElementById("entryList");


function setCurrentDateTime() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    entryDate.value =
        `${year}-${month}-${day}`;

    entryTime.value =
        `${hours}:${minutes}`;
}

    saveButton.disabled = true;

const symptomSliders = [
    "overallSymptoms",
    "tremor",
    "stiffness",
    "balance",
    "dyskinesia",
    "depression",
    "anxiety",
    "mentalFog",
    "indecisiveness",
    "energy"
];


const ratedSymptoms = new Set();

symptomSliders.forEach(
    function (id) {

        const slider =
            document.getElementById(id);

        const valueDisplay =
            document.getElementById(
                id + "Value"
            );

        slider.value = 5;

        slider.classList.add(
            "unratedSlider"
        );

        valueDisplay.textContent = "—";

        slider.addEventListener(
            "input",
            function () {

                ratedSymptoms.add(id);

                slider.classList.remove(
                    "unratedSlider"
                );

                valueDisplay.textContent =
                    slider.value;
                saveButton.disabled = false;
           }
        );
    }
);


function getRating(id) {

    if (!ratedSymptoms.has(id)) {
        return -1;
    }

    return Number(
        document.getElementById(id).value
    );
}
function getEntries() {

    const savedEntries =
        localStorage.getItem(
            "parkinsonsLogEntries"
        );

    if (!savedEntries) {
        return [];
    }

    return JSON.parse(savedEntries);
}


function saveEntries(entries) {

    localStorage.setItem(
        "parkinsonsLogEntries",
        JSON.stringify(entries)
    );
}
function resetSymptomSliders() {

    ratedSymptoms.clear();

    symptomSliders.forEach(
        function (id) {

            const slider =
                document.getElementById(id);

            const valueDisplay =
                document.getElementById(
                    id + "Value"
                );

            slider.value = 5;

            slider.classList.add(
                "unratedSlider"
            );

            valueDisplay.textContent = "—";
        }
    );
}
function displayEntries() {

    const entries = getEntries();

    if (entries.length === 0) {
        entryList.innerHTML = "No entries yet.";
        return;
    }

    entryList.innerHTML = "";

    const newestFirst =
        [...entries].reverse();

    newestFirst.forEach(
        function (entry) {

            const div =
                document.createElement("div");

            div.className = "entry";


            let symptoms = [];


            function addRating(
                label,
                value
            ) {

                if (
                    value !== undefined &&
                    value !== null &&
                    value >= 0
                ) {
                    symptoms.push(
                        `${label}: ${value}`
                    );
                }
            }


            addRating(
                "Overall",
                entry.overallSymptoms
            );

            addRating(
                "Tremor",
                entry.tremor
            );

            addRating(
                "Rigidity",
                entry.stiffness
            );

            addRating(
                "Balance",
                entry.balance
            );

            addRating(
                "Dyskinesia",
                entry.dyskinesia
            );

            addRating(
                "Depression",
                entry.depression
            );

            addRating(
                "Anxiety",
                entry.anxiety
            );

            addRating(
                "Mental Fog",
                entry.mentalFog
            );

            addRating(
                "Indecisiveness",
                entry.indecisiveness
            );

            addRating(
                "Energy",
                entry.energy
            );


            let symptomText =
                symptoms.length > 0
                    ? symptoms.join("<br>")
                    : "No symptom ratings entered";


            div.innerHTML = `
                <strong>
                    ${entry.date}
                    ${entry.time}
                </strong>

                <br><br>

                ${symptomText}

                <br><br>

                DBS Program:
                ${entry.dbsProgram || "Not entered"}

                <br>

                DBS Level:
                ${entry.dbsLevel || "Not entered"}

                ${
                    entry.notes
                        ? `<br><br>Notes: ${entry.notes}`
                        : ""
                }
            `;


            entryList.appendChild(div);
        }
    );
}


function saveEntry() {
        alert("Saving Entry");
    const entry = {

        date:
            entryDate.value,

        time:
            entryTime.value,

        enteredAt:
            new Date().toISOString(),

        overallSymptoms:
            getRating("overallSymptoms"),

        tremor:
            getRating("tremor"),

        stiffness:
            getRating("stiffness"),

        balance:
            getRating("balance"),

        dyskinesia:
            getRating("dyskinesia"),

        tremor: getRating("tremor"),

        stiffness: getRating("stiffness"),

        balance: getRating("balance"),

        dyskinesia: getRating("dyskinesia"),

        depression:
            getRating("depression"),

        anxiety:
            getRating("anxiety"),

        mentalFog:
            getRating("mentalFog"),

        indecisiveness:
            getRating("indecisiveness"),

        energy:
            getRating("energy"),

        dbsProgram:
            dbsProgram.value,

        dbsLevel:
            dbsLevel.value,

        notes:
            notes.value.trim()
    };

    entryDate.addEventListener(
        "change",
        function () {
            saveButton.disabled = false;
        }
    );

    entryTime.addEventListener(
        "change",
        function () {
            saveButton.disabled = false;
        }
    );

    const entries =
        getEntries();


    entries.push(entry);


    saveEntries(entries);


    displayEntries();

    drawSymptomGraph();

    resetSymptomSliders();

    notes.value = "";
    saveButton.disabled = true;

    setCurrentDateTime();
}


saveButton.addEventListener(
    "click",
    saveEntry
);

function getMedicationEvents() {

    const saved =
        localStorage.getItem(
            "parkinsonsMedicationEvents"
        );

    if (!saved) {
        return [];
    }

    return JSON.parse(saved);
}


function saveMedicationEvent(
    medication
) {

    const now =
        new Date();

    const event = {
        medication:
            medication,

        timestamp:
            now.toISOString(),

        date:
            now.toLocaleDateString(),

        time:
            now.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            )
    };


    const events =
        getMedicationEvents();


    events.push(event);


    localStorage.setItem(
        "parkinsonsMedicationEvents",
        JSON.stringify(events)
    );


    alert(
        `${medication} recorded at ${event.time}`
    );
}


document
    .querySelectorAll(".medButton")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const medication =
                        button.dataset.medication;

                    saveMedicationEvent(
                        medication
                    );
                }
            );
        }
    );

setCurrentDateTime();

displayEntries();
const startSleepButton =
    document.getElementById("startSleepButton");

const wakeButton =
    document.getElementById("wakeButton");

const sleepStatus =
    document.getElementById("sleepStatus");

const sleepList =
    document.getElementById("sleepList");


function getSleepSessions() {

    const saved =
        localStorage.getItem(
            "parkinsonsSleepSessions"
        );

    if (!saved) {
        return [];
    }

    return JSON.parse(saved);
}


function saveSleepSessions(
    sessions
) {

    localStorage.setItem(
        "parkinsonsSleepSessions",
        JSON.stringify(sessions)
    );
}


function getActiveSleepSession() {

    const saved =
        localStorage.getItem(
            "parkinsonsActiveSleep"
        );

    if (!saved) {
        return null;
    }

    return JSON.parse(saved);
}


function setActiveSleepSession(
    session
) {

    localStorage.setItem(
        "parkinsonsActiveSleep",
        JSON.stringify(session)
    );
}


function clearActiveSleepSession() {

    localStorage.removeItem(
        "parkinsonsActiveSleep"
    );
}


function formatTime(date) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function formatDuration(
    milliseconds
) {

    const totalMinutes =
        Math.floor(
            milliseconds / 60000
        );

    const hours =
        Math.floor(
            totalMinutes / 60
        );

    const minutes =
        totalMinutes % 60;

    return `${hours} hr ${minutes} min`;
}


function startSleep() {

    const active =
        getActiveSleepSession();

    if (active) {

        alert(
            "A sleep session is already active."
        );

        return;
    }


    const now =
        new Date();


    const session = {

        start:
            now.toISOString()
    };


    setActiveSleepSession(
        session
    );


    displaySleep();
}


function wakeUp() {

    const active =
        getActiveSleepSession();


    if (!active) {

        alert(
            "There is no active sleep session."
        );

        return;
    }


    const now =
        new Date();


    const session = {

        start:
            active.start,

        end:
            now.toISOString()
    };


    const sessions =
        getSleepSessions();


    sessions.push(
        session
    );


    saveSleepSessions(
        sessions
    );


    clearActiveSleepSession();


    displaySleep();
}


function displaySleep() {

    const active =
        getActiveSleepSession();


    if (active) {

        const start =
            new Date(
                active.start
            );

        sleepStatus.textContent =
            `Sleeping since ${formatTime(start)}`;
    }
    else {

        sleepStatus.textContent =
            "No active sleep session.";
    }


    const sessions =
        getSleepSessions();


    sleepList.innerHTML = "";


    const newestFirst =
        [...sessions].reverse();


    newestFirst.forEach(
        function (session) {

            const start =
                new Date(
                    session.start
                );

            const end =
                new Date(
                    session.end
                );

            const duration =
                end - start;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "sleepEntry";


            div.innerHTML = `
                <strong>
                    ${start.toLocaleDateString()}
                </strong>

                <br>

                ${formatTime(start)}
                →
                ${formatTime(end)}

                <br>

                Duration:
                ${formatDuration(duration)}
            `;


            sleepList.appendChild(
                div
            );
        }
    );
}


startSleepButton.addEventListener(
    "click",
    startSleep
);


wakeButton.addEventListener(
    "click",
    wakeUp
);


displaySleep();

const timeline =
    document.getElementById("timeline");

const refreshTimelineButton =
    document.getElementById(
        "refreshTimelineButton"
    );


function buildTimeline() {

    let events = [];


    // --------------------------------
    // Symptom / DBS observations
    // --------------------------------

    const entries =
        getEntries();

    entries.forEach(
        function (entry) {

            const timestamp =
                new Date(
                    `${entry.date}T${entry.time}`
                );

            events.push({

                timestamp:
                    timestamp,

                type:
                    "SYMPTOMS / DBS",

                details:
                    `Symptoms: ${entry.overallSymptoms}/10
                     — DBS Program: ${entry.dbsProgram || "-"}
                     — Level: ${entry.dbsLevel || "-"}`
            });
        }
    );
        
    dbsProgram.addEventListener(
        "change",
        function () {
            saveButton.disabled = false;
        }
    );

    notes.addEventListener(
        "input",
        function () {
            saveButton.disabled = false;
        }
    );

    dbsLevel.addEventListener(
        "input",
        function () {
            saveButton.disabled = false;
        }
    );

    // --------------------------------
    // Medication
    // --------------------------------

    const medications =
        getMedicationEvents();

    medications.forEach(
        function (med) {

            events.push({

                timestamp:
                    new Date(
                        med.timestamp
                    ),

                type:
                    "MEDICATION",

                details:
                    med.medication
            });
        }
    );


    // --------------------------------
    // Sleep
    // --------------------------------

    const sleepSessions =
        getSleepSessions();

    sleepSessions.forEach(
        function (sleep) {

            const start =
                new Date(
                    sleep.start
                );

            const end =
                new Date(
                    sleep.end
                );

            events.push({

                timestamp:
                    start,

                type:
                    "SLEEP",

                details:
                    `${formatTime(start)}
                     → ${formatTime(end)}
                     (${formatDuration(end - start)})`
            });
        }
    );


    // Newest event first

    events.sort(
        function (a, b) {

            return (
                b.timestamp -
                a.timestamp
            );
        }
    );


    displayTimeline(events);
}


function displayTimeline(events) {

    timeline.innerHTML = "";


    if (events.length === 0) {

        timeline.textContent =
            "No events recorded yet.";

        return;
    }


    events.forEach(
        function (event) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "timelineEntry";


            const date =
                event.timestamp;


            div.innerHTML = `

                <div class="timelineTime">

                    ${date.toLocaleDateString()}

                    ${date.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )}

                </div>

                <div class="timelineType">
                    ${event.type}
                </div>

                <div class="timelineDetails">
                    ${event.details}
                </div>
            `;


            timeline.appendChild(
                div
            );
        }
    );
}


refreshTimelineButton.addEventListener(
    "click",
    buildTimeline
);


buildTimeline();

const symptomGraph =
    document.getElementById(
        "symptomGraph"
    );

const graphMetric =
    document.getElementById(
        "graphMetric"
    );


function drawSymptomGraph() {

    const ctx =
        symptomGraph.getContext("2d");

    const width =
        symptomGraph.width;

    const height =
        symptomGraph.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const metric =
        graphMetric.value;


    const entries =
        getEntries()
            .filter(
                function (entry) {

                    return (
                        entry[metric] !== undefined &&
                        entry[metric] >= 0
                    );
                }
            );


    if (entries.length === 0) {

        ctx.font =
            "18px Arial";

        ctx.fillText(
            "No data for this measurement",
            100,
            170
        );

        return;
    }


    // Convert date/time into actual Date objects.

    const points =
        entries.map(
            function (entry) {

                return {

                    time:
                        new Date(
                            `${entry.date}T${entry.time}`
                        ),

                    value:
                        entry[metric]
                };
            }
        );


    points.sort(
        function (a, b) {

            return a.time - b.time;
        }
    );


    const left = 50;
    const right = 20;
    const top = 20;
    const bottom = 45;


    const graphWidth =
        width - left - right;

    const graphHeight =
        height - top - bottom;


    // --------------------------------
    // Determine time range
    // --------------------------------

    let minTime =
        points[0].time.getTime();

    let maxTime =
        points[
            points.length - 1
        ].time.getTime();


    // One point needs some width.

    if (minTime === maxTime) {

        minTime -=
            60 * 60 * 1000;

        maxTime +=
            60 * 60 * 1000;
    }


    // --------------------------------
    // Coordinate transformations
    // --------------------------------

    function timeToX(time) {

        return (
            left +

            (
                (
                    time.getTime() -
                    minTime
                )
                /
                (
                    maxTime -
                    minTime
                )
            )

            * graphWidth
        );
    }


    function valueToY(value) {

        return (
            top +

            (
                (10 - value)
                / 10
            )

            * graphHeight
        );
    }


    // --------------------------------
    // Draw Y axis and horizontal grid
    // --------------------------------

    ctx.font =
        "14px Arial";

    ctx.textAlign =
        "right";

    ctx.textBaseline =
        "middle";


    for (
        let value = 0;
        value <= 10;
        value += 2
    ) {

        const y =
            valueToY(value);


        ctx.beginPath();

        ctx.moveTo(
            left,
            y
        );

        ctx.lineTo(
            width - right,
            y
        );

        ctx.strokeStyle =
            "#dddddd";

        ctx.stroke();


        ctx.fillStyle =
            "#333333";

        ctx.fillText(
            value,
            left - 8,
            y
        );
    }


    // --------------------------------
    // Draw symptom line
    // --------------------------------

    ctx.beginPath();

    points.forEach(
        function (point, index) {

            const x =
                timeToX(
                    point.time
                );

            const y =
                valueToY(
                    point.value
                );


            if (index === 0) {

                ctx.moveTo(
                    x,
                    y
                );
            }
            else {

                ctx.lineTo(
                    x,
                    y
                );
            }
        }
    );


    ctx.strokeStyle =
        "#222222";

    ctx.lineWidth =
        3;

    ctx.stroke();


    // --------------------------------
    // Draw individual measurements
    // --------------------------------

    points.forEach(
        function (point) {

            const x =
                timeToX(
                    point.time
                );

            const y =
                valueToY(
                    point.value
                );


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#222222";

            ctx.fill();
        }
    );


    // --------------------------------
    // Beginning and ending times
    // --------------------------------

    ctx.fillStyle =
        "#333333";

    ctx.font =
        "12px Arial";

    ctx.textBaseline =
        "top";


    ctx.textAlign =
        "left";

    ctx.fillText(
        points[0]
            .time
            .toLocaleString(),
        left,
        height - bottom + 12
    );


    ctx.textAlign =
        "right";

    ctx.fillText(
        points[
            points.length - 1
        ]
            .time
            .toLocaleString(),
        width - right,
        height - bottom + 12
    );
}


graphMetric.addEventListener(
    "change",
    drawSymptomGraph
);


drawSymptomGraph();

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        function () {

            navigator.serviceWorker.register(
                "service-worker.js"
            );
        }
    );
}