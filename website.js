document.addEventListener('DOMContentLoaded', () => {
    // Class addition form elements
    const classTitleInput = document.getElementById('class-title');
    const codeInput = document.getElementById('class-code');
    const instructorInput = document.getElementById('class-instructor');
    const classDateInput = document.getElementById('class-date');
    const addClassBtn = document.getElementById('add-class-btn');
    const classDiscardBtn = document.getElementById('discard-btn');

    // Task addition form elements
    const taskTitleInput = document.getElementById('task-title');
    const taskClassRelationInput = document.getElementById('task-class-relation');
    const taskDateInput = document.getElementById('task-due-date');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskDiscardBtn = document.getElementById('discard-task-btn');

    // Live date display elements & constants
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dateDisplayContainer = document.getElementById('live-date-display');
    const scheduleDateDisplay = document.getElementById('schedule-date');

    // Utility: Parse schedule string formatted like "Mon, 14:00-16:00"
    function parseClassTime(scheduleString) {
        if (!scheduleString || !scheduleString.includes(', ')) {
            return { day: '', startTime: '', endTime: '', totalMinutes: 0 };
        }
        const [dayPart, timeRange] = scheduleString.split(', ');
        const [startTime, endTime] = (timeRange || '').split('-');
        
        const [hours, minutes] = (startTime || '0:0').split(':').map(Number);
        const totalMinutes = (hours || 0) * 60 + (minutes || 0);

        return {
            day: dayPart,
            startTime: startTime || '',
            endTime: endTime || '',
            totalMinutes: totalMinutes
        };
    }

    // Time snapshot helper
    function getCurrentTimeSnapshot() {
        const now = new Date();
        return {
            date: now,
            dayIndex: now.getDay(),
            dayName: days[now.getDay()],
            dayAbbreviation: dayAbbreviations[now.getDay()],
            monthName: months[now.getMonth()],
            numericDay: now.getDate(),
            hours: now.getHours(),
            minutes: now.getMinutes(),
            totalMinutes: now.getHours() * 60 + now.getMinutes()
        };
    }

    // Update Live Date Displays
    function updateDateDisplay() {
        const time = getCurrentTimeSnapshot();
        const formattedDate = `${time.dayName}, ${time.monthName} ${time.numericDay}`;
        
        if (dateDisplayContainer) {
            dateDisplayContainer.textContent = formattedDate;
        }
        if (scheduleDateDisplay) {
            scheduleDateDisplay.textContent = formattedDate;
        }
    }

    // Initialize display and start timer
    updateDateDisplay();
    setInterval(updateDateDisplay, 1000);

    // Class Discard Button
    if (classDiscardBtn) {
        classDiscardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            classTitleInput.value = "";
            codeInput.value = "";
            instructorInput.value = "";
            classDateInput.value = "";
        });
    }

    // Add Class Button
    if (addClassBtn) {
        addClassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const titleVal = classTitleInput.value.trim();
            const codeVal = codeInput.value.trim();
            const instructorVal = instructorInput.value.trim();
            const dateVal = classDateInput.value.trim();

            const errorMsg = document.getElementById('class-error-message');
            const confirmMsg = document.getElementById('class-confirmation-message');

            if (titleVal === '') {
                if (errorMsg) errorMsg.textContent = "Class title is required!";
                return;
            }

            const newClass = {
                title: titleVal,
                code: codeVal,
                instructor: instructorVal,
                date: dateVal
            };

            saveClassToMemory(newClass);

            classTitleInput.value = "";
            codeInput.value = "";
            instructorInput.value = "";
            classDateInput.value = "";

            if (confirmMsg) confirmMsg.textContent = "Class is added!";
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    function saveClassToMemory(classObject) {
        let existingClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];
        existingClasses.push(classObject);
        localStorage.setItem('obsidianClasses', JSON.stringify(existingClasses));
    }

    // Task Discard Button
    if (taskDiscardBtn) {
        taskDiscardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            taskTitleInput.value = "";
            taskDateInput.value = "";
            taskDescriptionInput.value = "";
            const errorMsg = document.getElementById('task-error-message');
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    // Add Task Button
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const titleVal = taskTitleInput.value.trim();
            const descriptionVal = taskDescriptionInput.value.trim();
            const dateVal = taskDateInput.value.trim();

            const errorMsg = document.getElementById('task-error-message');
            const confirmMsg = document.getElementById('task-confirmation-message');

            if (titleVal === '' || dateVal === '') {
                if (errorMsg) errorMsg.textContent = "Task title and date are required!";
                return;
            }

            const newTask = {
                title: titleVal,
                date: dateVal,
                description: descriptionVal
            };

            saveTaskToMemory(newTask);

            taskTitleInput.value = "";
            taskDescriptionInput.value = "";
            taskDateInput.value = "";

            if (confirmMsg) confirmMsg.textContent = "Task is added!";
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    function saveTaskToMemory(taskObject) {
        let existingTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
        existingTasks.push(taskObject);
        localStorage.setItem('obsidianTasks', JSON.stringify(existingTasks));
    }

    // Data Counters
    const now = getCurrentTimeSnapshot();
    const classesData = JSON.parse(localStorage.getItem('obsidianClasses')) || [];
    const tasksData = JSON.parse(localStorage.getItem('obsidianTasks')) || [];

    // Today Classes Counter
    const todayClassesCounter = document.getElementById('today-classes-counter');
    if (todayClassesCounter) {
        let todayClassesCount = 0;
        classesData.forEach(classItem => {
            const parsed = parseClassTime(classItem.date);
            if (parsed.day === now.dayAbbreviation && parsed.totalMinutes > now.totalMinutes) {
                todayClassesCount++;
            }
        });
        todayClassesCounter.textContent = todayClassesCount;
    }

    // Task Counters
    const tasksTodayCounter = document.getElementById('today-tasks-counter');
    const tasksDueThisWeekCounter = document.getElementById('this-week-tasks-counter');

    let tasksTodayCount = 0;
    let tasksDueThisWeekCount = 0;

    tasksData.forEach(taskItem => {
        const parsed = parseClassTime(taskItem.date);
        const taskDayIndex = dayAbbreviations.indexOf(parsed.day);

        if (parsed.day === now.dayAbbreviation && parsed.totalMinutes > now.totalMinutes) {
            tasksTodayCount++;
        }
        
        if (taskDayIndex > now.dayIndex) {
            tasksDueThisWeekCount++;
        }
    });

    if (tasksTodayCounter) tasksTodayCounter.textContent = tasksTodayCount;
    if (tasksDueThisWeekCounter) tasksDueThisWeekCounter.textContent = tasksDueThisWeekCount;

    // Dashboard Functions
    function getUpcomingClasses() {
        const currentTime = getCurrentTimeSnapshot();
        return classesData.map(classItem => {
            const parsed = parseClassTime(classItem.date);
            return { ...classItem, parsed };
        }).filter(classItem => {
            const isToday = classItem.parsed.day === currentTime.dayAbbreviation;
            const isUpcoming = classItem.parsed.totalMinutes > currentTime.totalMinutes;
            return isToday && isUpcoming;
        }).sort((a, b) => a.parsed.totalMinutes - b.parsed.totalMinutes).slice(0, 3);
    }

    function renderSchedule() {
        const timelineContainer = document.getElementById('dashboard-schedule');
        if (!timelineContainer) return;

        const upcomingClasses = getUpcomingClasses();
        timelineContainer.innerHTML = ''; // Clear hardcoded placeholder HTML

        if (upcomingClasses.length === 0) {
            timelineContainer.innerHTML = `
                <div class="timeline-item">
                    <div class="dot"></div>
                    <div class="card">
                        <h1>No Upcoming Classes Today</h1>
                        <p style="opacity: 0.5;">Your schedule is clear for the rest of the day.</p>
                    </div>
                </div>`;
            return;
        }

        upcomingClasses.forEach((classItem, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'timeline-item';

            // Highlight the very first/next class
            const isNextClass = index === 0;
            const dotClass = isNextClass ? 'dot active' : 'dot';
            const cardClass = isNextClass ? 'card highlighted' : 'card';

            itemDiv.innerHTML = `
                <div class="${dotClass}"></div>
                <div class="${cardClass}">
                    <span class="time">${classItem.parsed.startTime} - ${classItem.parsed.endTime}</span>
                    <h1>${classItem.title} ${classItem.code ? `(${classItem.code})` : ''}</h1>
                </div>
            `;
            timelineContainer.appendChild(itemDiv);
        });
    }

        // Render Priority Tasks
        function renderPriorityTasks() {
            const tasksContainer = document.getElementById('dashboard-tasks');
            if (!tasksContainer) return;

            const tasksData = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
            tasksContainer.innerHTML = ''; // Clear placeholder HTML

            if (tasksData.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="smallcard">
                        <h3>No Priority Tasks</h3>
                        <p style="opacity: 0.5;">All task queues cleared.</p>
                    </div>`;
                return;
            }

            // Take the top 4 tasks (or adjust based on custom sorting preferences)
            const priorityTasks = tasksData.slice(0, 4);

            priorityTasks.forEach(taskItem => {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'smallcard';

                cardDiv.innerHTML = `
                    <div>
                        <h3>${taskItem.title}</h3>
                        <p style="opacity: 0.5; font-size: 0.85rem; margin-top: 4px;">${taskItem.description || 'No description'}</p>
                    </div>
                    <span style="font-size: 0.85rem; color: #DAB9FF; font-weight: 600;">${taskItem.date || ''}</span>
                `;
                tasksContainer.appendChild(cardDiv);
            });
        }

        // Invoke rendering functions when page initializes
        renderSchedule();
        renderPriorityTasks();
    const viewAllTasksBtn = document.getElementById('view-all-tasks');
    viewAllTasksBtn.addEventListener('click', () => {
        window.location.href = 'classes.html';
    });
});
