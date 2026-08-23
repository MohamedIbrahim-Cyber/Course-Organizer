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

    // Utility: Parse schedule string formatted like "Mon, 14:00 - 15:30"
    function parseClassTime(scheduleString) {
        if (!scheduleString || !scheduleString.includes(', ')) {
            return { day: '', startTime: '', endTime: '', totalMinutes: 0 };
        }
        const [dayPart, timeRange] = scheduleString.split(', ');
        const [startTime, endTime] = (timeRange || '').split('-');
        
        const [hours, minutes] = (startTime || '0:0').trim().split(':').map(Number);
        const totalMinutes = (hours || 0) * 60 + (minutes || 0);

        return {
            day: dayPart.trim(),
            startTime: (startTime || '').trim(),
            endTime: (endTime || '').trim(),
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

    // =========================================================================
    // Add Class Form Logic
    // =========================================================================
    if (classDiscardBtn) {
        classDiscardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            classTitleInput.value = "";
            codeInput.value = "";
            instructorInput.value = "";
            classDateInput.value = "";
        });
    }

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

            let existingClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];
            existingClasses.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(existingClasses));

            classTitleInput.value = "";
            codeInput.value = "";
            instructorInput.value = "";
            classDateInput.value = "";

            if (confirmMsg) confirmMsg.textContent = "Class added successfully!";
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    // =========================================================================
    // Add Task Form Logic
    // =========================================================================
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
                description: descriptionVal,
                completed: false
            };

            let existingTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
            existingTasks.push(newTask);
            localStorage.setItem('obsidianTasks', JSON.stringify(existingTasks));

            taskTitleInput.value = "";
            taskDescriptionInput.value = "";
            taskDateInput.value = "";

            if (confirmMsg) confirmMsg.textContent = "Task added successfully!";
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    // =========================================================================
    // Home Dashboard Counters & Timelines
    // =========================================================================
    const now = getCurrentTimeSnapshot();
    const classesData = JSON.parse(localStorage.getItem('obsidianClasses')) || [];
    const tasksData = JSON.parse(localStorage.getItem('obsidianTasks')) || [];

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

    const tasksTodayCounter = document.getElementById('today-tasks-counter');
    const tasksDueThisWeekCounter = document.getElementById('this-week-tasks-counter');

    if (tasksTodayCounter || tasksDueThisWeekCounter) {
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
    }

    function renderSchedule() {
        const timelineContainer = document.getElementById('dashboard-schedule');
        if (!timelineContainer) return;

        const currentTime = getCurrentTimeSnapshot();
        const upcomingClasses = classesData.map(classItem => {
            const parsed = parseClassTime(classItem.date);
            return { ...classItem, parsed };
        }).filter(classItem => {
            const isToday = classItem.parsed.day === currentTime.dayAbbreviation;
            const isUpcoming = classItem.parsed.totalMinutes > currentTime.totalMinutes;
            return isToday && isUpcoming;
        }).sort((a, b) => a.parsed.totalMinutes - b.parsed.totalMinutes).slice(0, 3);

        timelineContainer.innerHTML = '';

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

    function renderPriorityTasks() {
        const tasksContainer = document.getElementById('dashboard-tasks');
        if (!tasksContainer) return;

        const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
        tasksContainer.innerHTML = '';

        if (currentTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="smallcard">
                    <h3>No Priority Tasks</h3>
                    <p style="opacity: 0.5;">All task queues cleared.</p>
                </div>`;
            return;
        }

        currentTasks.slice(0, 4).forEach(taskItem => {
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

    renderSchedule();
    renderPriorityTasks();

    const viewAllTasksBtn = document.getElementById('view-all-tasks');
    if (viewAllTasksBtn) {
        viewAllTasksBtn.addEventListener('click', () => {
            window.location.href = 'classes.html';
        });
    }

    // =========================================================================
    // Classes & Tasks Page (classes.html) Dynamic Management
    // =========================================================================
    const classesListContainer = document.getElementById('classes-list');
    const tasksListContainer = document.getElementById('tasks-list');
    const tasksProgressPercentage = document.getElementById('tasks-progress-percentage');
    const tasksProgressFill = document.getElementById('tasks-progress-fill');
    const classesProgressPercentage = document.getElementById('classes-progress-percentage');
    const classesProgressFill = document.getElementById('classes-progress-fill');

    if (classesListContainer && tasksListContainer) {

        function updateProgressMetrics() {
            const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
            const currentClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];

            // Task Completion Metric
            const totalTasks = currentTasks.length;
            const completedTasks = currentTasks.filter(task => task.completed).length;
            const taskPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            if (tasksProgressPercentage) {
                tasksProgressPercentage.textContent = `${completedTasks}/${totalTasks} (${taskPercentage}%)`;
            }
            if (tasksProgressFill) {
                tasksProgressFill.style.width = `${taskPercentage}%`;
            }

            // Class Registration Metric
            const totalClasses = currentClasses.length;
            if (classesProgressPercentage) {
                classesProgressPercentage.textContent = `${totalClasses} Registered`;
            }
            if (classesProgressFill) {
                classesProgressFill.style.width = totalClasses > 0 ? '100%' : '0%';
            }
        }

        function renderClassesList() {
            const currentClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];
            classesListContainer.innerHTML = '';

            if (currentClasses.length === 0) {
                classesListContainer.innerHTML = `
                    <div class="card" style="grid-column: 1 / -1;">
                        <p style="color: var(--text-muted); margin: 0;">No classes registered. Click "Add a Class" to define a node.</p>
                    </div>`;
                return;
            }

            currentClasses.forEach((item, index) => {
                const card = document.createElement('article');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header-flex">
                        <h3 style="margin: 0; color: var(--text-main); font-size: 1.1rem;">${item.title}</h3>
                        ${item.code ? `<span style="color: var(--accent-purple); font-size: 0.85rem; font-weight: 700;">${item.code}</span>` : ''}
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">${item.instructor ? `Instructor: ${item.instructor}` : 'Instructor: Not assigned'}</p>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${item.date || 'No schedule set'}</p>
                    <div class="card-actions">
                        <button class="edit-btn" data-type="class" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-type="class" data-index="${index}">Delete</button>
                    </div>
                `;
                classesListContainer.appendChild(card);
            });
        }

        function renderTasksList() {
            const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
            tasksListContainer.innerHTML = '';

            if (currentTasks.length === 0) {
                tasksListContainer.innerHTML = `
                    <div class="task-item">
                        <p style="color: var(--text-muted); margin: 0;">All queues clear. No tasks registered.</p>
                    </div>`;
                return;
            }

            currentTasks.forEach((task, index) => {
                const taskCard = document.createElement('div');
                taskCard.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskCard.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                        <div>
                            <h3>${task.title}</h3>
                            <p>${task.description || 'No description provided.'}</p>
                            <span style="font-size: 0.75rem; color: var(--accent-purple); font-weight: 600;">Due: ${task.date || 'No date set'}</span>
                        </div>
                    </div>
                    <div class="card-actions" style="margin-top: 0;">
                        <button class="edit-btn" data-type="task" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-type="task" data-index="${index}">Delete</button>
                    </div>
                `;
                tasksListContainer.appendChild(taskCard);
            });
        }

        // Checkbox State Toggle
        tasksListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const index = Number(e.target.dataset.index);
                const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
                
                if (currentTasks[index]) {
                    currentTasks[index].completed = e.target.checked;
                    localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                    renderTasksList();
                    updateProgressMetrics();
                }
            }
        });

        // Class Actions (Edit & Delete)
        classesListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const index = Number(target.dataset.index);
            let currentClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];

            if (target.classList.contains('delete-btn')) {
                currentClasses.splice(index, 1);
                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                updateProgressMetrics();
            } else if (target.classList.contains('edit-btn')) {
                const item = currentClasses[index];
                const newTitle = prompt('Edit Class Title:', item.title);
                if (newTitle === null) return;
                
                const newCode = prompt('Edit Class Code:', item.code || '');
                if (newCode === null) return;
                
                const newInstructor = prompt('Edit Instructor:', item.instructor || '');
                if (newInstructor === null) return;
                
                const newDate = prompt('Edit Schedule (e.g. Mon, 14:00 - 15:30):', item.date || '');
                if (newDate === null) return;

                currentClasses[index] = {
                    title: newTitle.trim() || item.title,
                    code: newCode.trim(),
                    instructor: newInstructor.trim(),
                    date: newDate.trim()
                };

                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                updateProgressMetrics();
            }
        });

        // Task Actions (Edit & Delete)
        tasksListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const index = Number(target.dataset.index);
            let currentTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];

            if (target.classList.contains('delete-btn')) {
                currentTasks.splice(index, 1);
                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                updateProgressMetrics();
            } else if (target.classList.contains('edit-btn')) {
                const task = currentTasks[index];
                const newTitle = prompt('Edit Task Title:', task.title);
                if (newTitle === null) return;

                const newDate = prompt('Edit Due Date (e.g. Mon, 14:00 - 15:30):', task.date || '');
                if (newDate === null) return;

                const newDescription = prompt('Edit Task Description:', task.description || '');
                if (newDescription === null) return;

                currentTasks[index] = {
                    ...task,
                    title: newTitle.trim() || task.title,
                    date: newDate.trim() || task.date,
                    description: newDescription.trim()
                };

                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                updateProgressMetrics();
            }
        });

        // Initial Paint
        renderClassesList();
        renderTasksList();
        updateProgressMetrics();
    }
});