document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // Reusable Toast Notification Utility
    // =========================================================================
    function showToast(message, isError = false) {
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            toast.className = 'toast-notification';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.toggle('error', isError);
        toast.classList.add('active');

        if (window.toastTimer) clearTimeout(window.toastTimer);
        window.toastTimer = setTimeout(() => {
            toast.classList.remove('active');
        }, 3200);
    }

    // =========================================================================
    // Date & Time Formatting Utilities
    // =========================================================================
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const dateDisplayContainer = document.getElementById('live-date-display');
    const scheduleDateDisplay = document.getElementById('schedule-date');

    function parseClassTime(scheduleString) {
        if (!scheduleString || !scheduleString.includes(', ')) {
            return { day: 'Mon', startTime: '', endTime: '', totalMinutes: 0 };
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

    function updateDateDisplay() {
        const time = getCurrentTimeSnapshot();
        const formattedDate = `${time.dayName}, ${time.monthName} ${time.numericDay}`;
        
        if (dateDisplayContainer) dateDisplayContainer.textContent = formattedDate;
        if (scheduleDateDisplay) scheduleDateDisplay.textContent = formattedDate;
    }

    updateDateDisplay();
    setInterval(updateDateDisplay, 1000);

    // =========================================================================
    // Add Class Form Controls (Structured Day & Time Inputs)
    // =========================================================================
    const classTitleInput = document.getElementById('class-title');
    const codeInput = document.getElementById('class-code');
    const instructorInput = document.getElementById('class-instructor');
    const classDaySelect = document.getElementById('class-day');
    const classStartTimeInput = document.getElementById('class-start-time');
    const classEndTimeInput = document.getElementById('class-end-time');
    const addClassBtn = document.getElementById('add-class-btn');
    const classDiscardBtn = document.getElementById('discard-btn');

    if (classDiscardBtn) {
        classDiscardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            classTitleInput.value = "";
            codeInput.value = "";
            instructorInput.value = "";
            if (classDaySelect) classDaySelect.selectedIndex = 0;
            if (classStartTimeInput) classStartTimeInput.value = "";
            if (classEndTimeInput) classEndTimeInput.value = "";
            const errorMsg = document.getElementById('class-error-message');
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    if (addClassBtn) {
        addClassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const titleVal = classTitleInput.value.trim();
            const codeVal = codeInput.value.trim();
            const instructorVal = instructorInput.value.trim();
            const dayVal = classDaySelect ? classDaySelect.value : 'Mon';
            const startVal = classStartTimeInput ? classStartTimeInput.value : '';
            const endVal = classEndTimeInput ? classEndTimeInput.value : '';

            const errorMsg = document.getElementById('class-error-message');

            if (titleVal === '') {
                if (errorMsg) errorMsg.textContent = "Class title is required.";
                showToast("Class title is required.", true);
                return;
            }

            if (!startVal || !endVal) {
                if (errorMsg) errorMsg.textContent = "Both start and end times are required.";
                showToast("Please specify start and end times.", true);
                return;
            }

            const formattedDate = `${dayVal}, ${startVal} - ${endVal}`;

            const newClass = {
                title: titleVal,
                code: codeVal,
                instructor: instructorVal,
                date: formattedDate
            };

            let existingClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];
            existingClasses.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(existingClasses));

            classTitleInput.value = "";
            codeInput.value = "";
            instructorInput.value = "";
            classStartTimeInput.value = "";
            classEndTimeInput.value = "";
            if (errorMsg) errorMsg.textContent = "";

            showToast("Class node successfully indexed!");
        });
    }

    // =========================================================================
    // Add Task Form Controls (Structured Day & Time Inputs)
    // =========================================================================
    const taskTitleInput = document.getElementById('task-title');
    const taskDaySelect = document.getElementById('task-day');
    const taskDueTimeInput = document.getElementById('task-due-time');
    const taskDescriptionInput = document.getElementById('task-description');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskDiscardBtn = document.getElementById('discard-task-btn');

    if (taskDiscardBtn) {
        taskDiscardBtn.addEventListener('click', (e) => {
            e.preventDefault();
            taskTitleInput.value = "";
            taskDescriptionInput.value = "";
            if (taskDaySelect) taskDaySelect.selectedIndex = 0;
            if (taskDueTimeInput) taskDueTimeInput.value = "";
            const errorMsg = document.getElementById('task-error-message');
            if (errorMsg) errorMsg.textContent = "";
        });
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const titleVal = taskTitleInput.value.trim();
            const descriptionVal = taskDescriptionInput.value.trim();
            const dayVal = taskDaySelect ? taskDaySelect.value : 'Mon';
            const timeVal = taskDueTimeInput ? taskDueTimeInput.value : '';

            const errorMsg = document.getElementById('task-error-message');

            if (titleVal === '') {
                if (errorMsg) errorMsg.textContent = "Task title is required.";
                showToast("Task title is required.", true);
                return;
            }

            if (!timeVal) {
                if (errorMsg) errorMsg.textContent = "Task due time is required.";
                showToast("Please specify a due time.", true);
                return;
            }

            const formattedDate = `${dayVal}, ${timeVal}`;

            const newTask = {
                title: titleVal,
                date: formattedDate,
                description: descriptionVal,
                completed: false
            };

            let existingTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];
            existingTasks.push(newTask);
            localStorage.setItem('obsidianTasks', JSON.stringify(existingTasks));

            taskTitleInput.value = "";
            taskDescriptionInput.value = "";
            taskDueTimeInput.value = "";
            if (errorMsg) errorMsg.textContent = "";

            showToast("Task successfully added to queue!");
        });
    }

    // =========================================================================
    // Home Dashboard Dynamic Stats & Timeline (index.html)
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
    // Classes & Tasks Hub (classes.html) Dynamic Management & In-Place Editing
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

            const totalTasks = currentTasks.length;
            const completedTasks = currentTasks.filter(task => task.completed).length;
            const taskPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            if (tasksProgressPercentage) {
                tasksProgressPercentage.textContent = `${completedTasks}/${totalTasks} (${taskPercentage}%)`;
            }
            if (tasksProgressFill) {
                tasksProgressFill.style.width = `${taskPercentage}%`;
            }

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
                card.dataset.index = index;
                card.innerHTML = `
                    <div class="card-header-flex">
                        <h3 style="margin: 0; color: var(--text-main); font-size: 1.1rem;">${item.title}</h3>
                        ${item.code ? `<span style="color: var(--accent-purple); font-size: 0.85rem; font-weight: 700;">${item.code}</span>` : ''}
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">${item.instructor ? `Instructor: ${item.instructor}` : 'Instructor: Not assigned'}</p>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${item.date || 'No schedule set'}</p>
                    <div class="card-actions">
                        <button class="edit-btn" data-action="edit-class" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-action="delete-class" data-index="${index}">Delete</button>
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
                taskCard.dataset.index = index;
                taskCard.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
                        <input type="checkbox" class="task-checkbox" data-index="${index}" ${task.completed ? 'checked' : ''}>
                        <div style="flex: 1;">
                            <h3>${task.title}</h3>
                            <p>${task.description || 'No description provided.'}</p>
                            <span style="font-size: 0.75rem; color: var(--accent-purple); font-weight: 600;">Due: ${task.date || 'No date set'}</span>
                        </div>
                    </div>
                    <div class="card-actions" style="margin-top: 0;">
                        <button class="edit-btn" data-action="edit-task" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-action="delete-task" data-index="${index}">Delete</button>
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

        // In-Place Class Operations (Delete, Edit, Save, Cancel)
        classesListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const action = target.dataset.action;
            const index = Number(target.dataset.index);
            let currentClasses = JSON.parse(localStorage.getItem('obsidianClasses')) || [];

            if (action === 'delete-class') {
                currentClasses.splice(index, 1);
                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                updateProgressMetrics();
                showToast("Class node deleted.");
            } else if (action === 'edit-class') {
                const card = target.closest('.card');
                const item = currentClasses[index];
                const parsed = parseClassTime(item.date);

                card.innerHTML = `
                    <input type="text" class="edit-field edit-class-title" value="${item.title}" placeholder="Class Title">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <input type="text" class="edit-field edit-class-code" value="${item.code || ''}" placeholder="Code">
                        <input type="text" class="edit-field edit-class-instructor" value="${item.instructor || ''}" placeholder="Instructor">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem;">
                        <select class="edit-field edit-class-day">
                            ${dayAbbreviations.map(d => `<option value="${d}" ${d === parsed.day ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                        <input type="time" class="edit-field edit-class-start" value="${parsed.startTime || ''}">
                        <input type="time" class="edit-field edit-class-end" value="${parsed.endTime || ''}">
                    </div>
                    <div class="card-actions">
                        <button class="save-btn" data-action="save-class" data-index="${index}">Save</button>
                        <button class="cancel-btn" data-action="cancel-class">Cancel</button>
                    </div>
                `;
            } else if (action === 'save-class') {
                const card = target.closest('.card');
                const newTitle = card.querySelector('.edit-class-title').value.trim();
                const newCode = card.querySelector('.edit-class-code').value.trim();
                const newInstructor = card.querySelector('.edit-class-instructor').value.trim();
                const newDay = card.querySelector('.edit-class-day').value;
                const newStart = card.querySelector('.edit-class-start').value;
                const newEnd = card.querySelector('.edit-class-end').value;

                if (!newTitle) {
                    showToast("Class title cannot be empty.", true);
                    return;
                }

                if (!newStart || !newEnd) {
                    showToast("Start and end times are required.", true);
                    return;
                }

                currentClasses[index] = {
                    title: newTitle,
                    code: newCode,
                    instructor: newInstructor,
                    date: `${newDay}, ${newStart} - ${newEnd}`
                };

                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                updateProgressMetrics();
                showToast("Class node updated.");
            } else if (action === 'cancel-class') {
                renderClassesList();
            }
        });

        // In-Place Task Operations (Delete, Edit, Save, Cancel)
        tasksListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const action = target.dataset.action;
            const index = Number(target.dataset.index);
            let currentTasks = JSON.parse(localStorage.getItem('obsidianTasks')) || [];

            if (action === 'delete-task') {
                currentTasks.splice(index, 1);
                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                updateProgressMetrics();
                showToast("Task removed from queue.");
            } else if (action === 'edit-task') {
                const taskCard = target.closest('.task-item');
                const task = currentTasks[index];
                const [taskDay, taskTime] = (task.date || 'Mon, 12:00').split(', ');

                taskCard.innerHTML = `
                    <div style="width: 100%;">
                        <input type="text" class="edit-field edit-task-title" value="${task.title}" placeholder="Task Title">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                            <select class="edit-field edit-task-day">
                                ${dayAbbreviations.map(d => `<option value="${d}" ${d === (taskDay || 'Mon') ? 'selected' : ''}>${d}</option>`).join('')}
                            </select>
                            <input type="time" class="edit-field edit-task-time" value="${(taskTime || '').trim()}">
                        </div>
                        <input type="text" class="edit-field edit-task-desc" value="${task.description || ''}" placeholder="Task Description">
                        <div class="card-actions">
                            <button class="save-btn" data-action="save-task" data-index="${index}">Save</button>
                            <button class="cancel-btn" data-action="cancel-task">Cancel</button>
                        </div>
                    </div>
                `;
            } else if (action === 'save-task') {
                const taskCard = target.closest('.task-item');
                const newTitle = taskCard.querySelector('.edit-task-title').value.trim();
                const newDay = taskCard.querySelector('.edit-task-day').value;
                const newTime = taskCard.querySelector('.edit-task-time').value;
                const newDesc = taskCard.querySelector('.edit-task-desc').value.trim();

                if (!newTitle) {
                    showToast("Task title cannot be empty.", true);
                    return;
                }

                if (!newTime) {
                    showToast("Due time is required.", true);
                    return;
                }

                currentTasks[index] = {
                    ...currentTasks[index],
                    title: newTitle,
                    date: `${newDay}, ${newTime}`,
                    description: newDesc
                };

                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                updateProgressMetrics();
                showToast("Task queue updated.");
            } else if (action === 'cancel-task') {
                renderTasksList();
            }
        });

        // Initial paint
        renderClassesList();
        renderTasksList();
        updateProgressMetrics();
    }
});