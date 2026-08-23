document.addEventListener('DOMContentLoaded', () => {
    // Translation dictionary
    const translations = {
        en: {
            logo: "Obsidian Architect",
            nav_home: "Home",
            nav_add: "Add Class",
            nav_classes: "My Classes",
            nav_contact: "Contact us",
            welcome_header: "Welcome back Architect.",
            classes_today: "CLASSES TODAY",
            tasks_today: "TASKS TODAY",
            tasks_this_week: "TASKS DUE THIS WEEK",
            schedule_title: "Today's Schedule",
            priority_tasks_title: "Priority Tasks",
            view_all: "VIEW ALL",
            no_classes_indexed: "No Classes Indexed",
            no_classes_indexed_sub: "Click 'Add Class' to define nodes.",
            no_tasks: "No Priority Tasks",
            no_tasks_sub: "All task queues cleared.",
            instructor_label: "Instructor: ",
            not_assigned: "Not assigned",
            no_schedule_set: "No schedule set",
            due_label: "Due: ",
            no_date_set: "No date set",
            no_desc: "No description provided.",
            my_classes_title: "My Classes",
            stat_classes_indexed: "CLASSES INDEXED",
            stat_tasks_completion: "TASKS COMPLETION",
            stat_registered_suffix: " Registered",
            reg_classes_heading: "Registered Classes",
            reg_classes_desc: "Active nodes indexed in your study terminal",
            btn_add_class: "Add a Class",
            no_classes_empty: "No classes registered. Click 'Add a Class' to define a node.",
            active_tasks_heading: "Active Tasks",
            active_tasks_desc: "Pending operational objectives",
            btn_add_task: "Add a Task",
            no_tasks_empty: "All queues clear. No tasks registered.",
            btn_edit: "Edit",
            btn_delete: "Delete",
            btn_save: "Save",
            btn_cancel: "Cancel",
            add_class_title: "Add a Class",
            add_class_desc: "Define the parameters for a new academic node. These entries will be indexed into your primary study terminal.",
            label_class_title: "CLASS TITLE",
            label_class_code: "CLASS CODE",
            label_class_instructor: "CLASS INSTRUCTOR",
            label_day: "DAY",
            label_start_time: "START TIME",
            label_end_time: "END TIME",
            btn_submit_class: "Add Class",
            btn_discard: "Discard Draft",
            add_task_title: "Add a Task",
            label_task_title: "TASK TITLE",
            label_due_day: "DUE DAY",
            label_due_time: "DUE TIME",
            label_task_desc: "TASK DESCRIPTION",
            btn_submit_task: "Add Task",
            contact_header: "Get in Touch with Us.",
            faq_title: "FAQ.",
            faq_subtitle: "Frequently Asked Questions",
            faq_back: "← Back to All FAQs",
            form_name: "Name:",
            form_email: "Email:",
            form_subject: "Inquiry Subject:",
            form_message: "Inquiry Message:",
            btn_transmit: "Transmit Message",
            btn_transmitting: "TRANSMITTING...",
            footer_desc: "A deep-focus academic command terminal designed to index university courses, track assignment deadlines, and stream operational logs.",
            terminal_status: "TERMINAL STATUS: ONLINE • 2026",
            system_nodes: "SYSTEM NODES",
            dev_repo: "DEVELOPER & REPO",
            contact_dev: "Contact Developer ↗",
            copyright: "© 2026 OBSIDIAN ARCHITECT. BUILT & CODED BY MOHAMED IBRAHIM.",
            back_top: "BACK TO TOP",
            toast_class_indexed: "Class node indexed! Redirecting...",
            toast_task_indexed: "Task indexed! Redirecting...",
            toast_class_deleted: "Class node deleted.",
            toast_class_updated: "Class node updated.",
            toast_task_deleted: "Task removed from queue.",
            toast_task_updated: "Task queue updated.",
            toast_title_req: "Class title is required.",
            toast_time_req: "Please specify start and end times.",
            toast_task_title_req: "Task title is required.",
            toast_task_time_req: "Task due time is required.",
            toast_contact_req: "All fields are required.",
            toast_discord_ok: "Transmission beamed to Discord channel!",
            toast_discord_err: "Discord transmission error.",
            toast_discord_net_err: "Transmission failed. Check network connection."
        },
        ar: {
            logo: "المهندس أوبسيديان",
            nav_home: "الرئيسية",
            nav_add: "إضافة محاضرة",
            nav_classes: "محاضراتي",
            nav_contact: "تواصل معنا",
            welcome_header: "مرحبًا بعودتك أيها المهندس.",
            classes_today: "محاضرات اليوم",
            tasks_today: "مهام اليوم",
            tasks_this_week: "مهام هذا الأسبوع",
            schedule_title: "جدول اليوم",
            priority_tasks_title: "المهام ذات الأولوية",
            view_all: "عرض الكل",
            no_classes_indexed: "لم يتم تسجيل محاضرات بعد",
            no_classes_indexed_sub: "انقر على 'إضافة محاضرة' لبدء التسجيل.",
            no_tasks: "لا توجد مهام حالية",
            no_tasks_sub: "تم إنجاز جميع الأهداف والمطالب.",
            instructor_label: "المحاضر: ",
            not_assigned: "غير محدد",
            no_schedule_set: "لم يحدد موعد",
            due_label: "الموعد: ",
            no_date_set: "بدون موعد",
            no_desc: "لا يوجد وصف مدخل.",
            my_classes_title: "محاضراتي ومهامي",
            stat_classes_indexed: "المحاضرات المسجلة",
            stat_tasks_completion: "نسبة إنجاز المهام",
            stat_registered_suffix: " مسجلة",
            reg_classes_heading: "المحاضرات المسجلة",
            reg_classes_desc: "المحاضرات المفهرسة في محطتك الدراسية",
            btn_add_class: "إضافة محاضرة",
            no_classes_empty: "لا توجد محاضرات مسجلة. انقر على 'إضافة محاضرة' لإضافة مساق.",
            active_tasks_heading: "المهام الحالية",
            active_tasks_desc: "الأهداف الأكاديمية والواجبات المعلقة",
            btn_add_task: "إضافة مهمة",
            no_tasks_empty: "القائمة فارغة. لا توجد مهام معلقة.",
            btn_edit: "تعديل",
            btn_delete: "حذف",
            btn_save: "حفظ",
            btn_cancel: "إلغاء",
            add_class_title: "إضافة محاضرة",
            add_class_desc: "حدد معايير المحاضرة الجديدة لتتم جدولتها ومزامنتها في لوحة التحكم الخاصة بك.",
            label_class_title: "اسم المادة",
            label_class_code: "كود المادة",
            label_class_instructor: "اسم المحاضر / الدكتور",
            label_day: "اليوم",
            label_start_time: "وقت البدء",
            label_end_time: "وقت الانتهاء",
            btn_submit_class: "إضافة المادة",
            btn_discard: "إلغاء المسودة",
            add_task_title: "إضافة مهمة",
            label_task_title: "عنوان المهمة",
            label_due_day: "يوم التسليم",
            label_due_time: "وقت التسليم",
            label_task_desc: "وصف المهمة",
            btn_submit_task: "إضافة المهمة",
            contact_header: "تواصل معنا مباشرة.",
            faq_title: "الأسئلة الشائعة",
            faq_subtitle: "الأسئلة المتكررة حول النظام",
            faq_back: "← العودة إلى الأسئلة",
            form_name: "الاسم:",
            form_email: "البريد الإلكتروني:",
            form_subject: "موضوع الرسالة:",
            form_message: "نص الرسالة:",
            btn_transmit: "إرسال الرسالة",
            btn_transmitting: "جاري الإرسال...",
            footer_desc: "محطة تحكم أكاديمية مصممة لفهرسة المساقات الجامعية، تتبع المواعيد النهائية للتسليم، ومزامنة السجلات الأكاديمية.",
            terminal_status: "حالة النظام: متصل • ٢٠٢٦",
            system_nodes: "روابط النظام",
            dev_repo: "المطور والمستودع",
            contact_dev: "تواصل مع المطور ↗",
            copyright: "© ٢٠٢٦ المهندس أوبسيديان. تطوير وبرمجة محمد إبراهيم.",
            back_top: "العودة للأعلى",
            toast_class_indexed: "تمت إضافة المادة! جاري التحويل...",
            toast_task_indexed: "تمت إضافة المهمة! جاري التحويل...",
            toast_class_deleted: "تم حذف المحاضرة بنجاح.",
            toast_class_updated: "تم تحديث بيانات المحاضرة.",
            toast_task_deleted: "تمت إزالة المهمة من القائمة.",
            toast_task_updated: "تم تحديث بيانات المهمة.",
            toast_title_req: "اسم المادة مطلوب.",
            toast_time_req: "يرجى تحديد وقت البدء والانتهاء.",
            toast_task_title_req: "عنوان المهمة مطلوب.",
            toast_task_time_req: "وقت التسليم مطلوب.",
            toast_contact_req: "جميع الحقول مطلوبة لإتمام الإرسال.",
            toast_discord_ok: "تم إرسال الرسالة بنجاح عبر Discord!",
            toast_discord_err: "حدث خطأ أثناء الإرسال.",
            toast_discord_net_err: "فشل الإرسال. تحقق من اتصال الإنترنت."
        }
    };

    const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // FAQ database
    const faqDatabase = {
        en: {
            "1": {
                question: "1. How does Obsidian Architect store and index my schedule nodes?",
                answer: "All class timetables and task parameters are stored directly within your browser's persistent localStorage engine. Entries remain indexed indefinitely across browser reloads without external telemetry, giving you instant offline performance."
            },
            "2": {
                question: "2. What time format is required for automated schedule alerts?",
                answer: "The system enforces structured 24-hour time entries formatted as 'Day, HH:MM - HH:MM' (e.g., Mon, 14:00 - 15:30). The internal clock continuously parses these intervals to highlight upcoming lectures on your dashboard."
            },
            "3": {
                question: "3. Are my class entries and task records preserved across sessions?",
                answer: "Yes. Your active sessions write directly to device memory. If you need to edit or remove a node, you can modify any class or task parameter directly using the in-place editor in the 'My Classes' terminal."
            },
            "4": {
                question: "4. How does the weekly focus filter calculate pending deadlines?",
                answer: "The live scheduler analyzes the current calendar day against registered task due dates. Any objectives due later in the active weekly cycle are automatically categorized into the 'Tasks Due This Week' metric."
            }
        },
        ar: {
            "1": {
                question: "١. كيف يقوم النظام بحفظ وفهرسة جدول المحاضرات والمهام؟",
                answer: "يتم حفظ جميع الجداول والمهام داخل الذاكرة المحلية (localStorage) للمتصفح مباشرة، مما يوفر سرعة فائقة وإمكانية الوصول بدون إنترنت ودون مشاركة بياناتك مع أي طرف ثالث."
            },
            "2": {
                question: "٢. ما هو تنسيق الوقت المطلوب للتنبيهات التلقائية؟",
                answer: "يعتمد النظام على نظام التوقيت ٢٤ ساعة بالتنسيق القياسي 'اليوم، من:إلى' (مثال: Mon, 10:00 - 12:00) ليقوم المعالج الداخلي بمقارنة التوقيت مع ساعتك الحالية."
            },
            "3": {
                question: "٣. هل يتم حفظ المحاضرات والمهام بعد إغلاق المتصفح؟",
                answer: "نعم، تبقى جميع بياناتك محفوظة بالكامل على جهازك. كما يمكنك تعديل أي محاضرة أو حذفها مباشرة من صفحة 'محاضراتي'."
            },
            "4": {
                question: "٤. كيف يتم احتساب عداد المهام المستحقة لهذا الأسبوع؟",
                answer: "يقوم العداد الذكي بفحص تواريخ تسليم المهام ومقارنتها بالأسبوع الأكاديمي النشط وحساب المهام المتبقية التي لم يتم إنجازها بعد."
            }
        }
    };

    function renderFaqList() {
        const faqButtons = document.querySelectorAll('.faq-button');
        faqButtons.forEach(button => {
            const faqId = button.dataset.faq;
            if (faqDatabase[currentLang] && faqDatabase[currentLang][faqId]) {
                button.textContent = faqDatabase[currentLang][faqId].question;
            }
        });
    }

    // Language engine
    let currentLang = localStorage.getItem('obsidian_lang') || 'en';
    const langBtn = document.getElementById('lang-btn');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('obsidian_lang', lang);
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        if (langBtn) {
            langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Translate Day dropdown options if present
        const daySelects = document.querySelectorAll('#class-day, #task-day, .edit-class-day, .edit-task-day');
        const daysMapAr = { Sun: "الأحد", Mon: "الاثنين", Tue: "الثلاثاء", Wed: "الأربعاء", Thu: "الخميس", Fri: "الجمعة", Sat: "السبت" };
        const daysMapEn = { Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday" };

        daySelects.forEach(select => {
            Array.from(select.options).forEach(opt => {
                opt.textContent = lang === 'ar' ? daysMapAr[opt.value] : daysMapEn[opt.value];
            });
        });

        renderFaqList();
        updateDateDisplay();
        updateDashboardCounters();
        renderSchedule();
        renderPriorityTasks();
        if (typeof renderClassesList === 'function') renderClassesList();
        if (typeof renderTasksList === 'function') renderTasksList();
        if (typeof updateProgressMetrics === 'function') updateProgressMetrics();
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'en' ? 'ar' : 'en';
            setLanguage(nextLang);
        });
    }

    // Theme engine
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('obsidian_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('obsidian_theme', nextTheme);
        });
    }

    // Toast alert
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

    // Time utils
    const scheduleDateDisplay = document.getElementById('schedule-date');

    function normalizeDay(dayStr) {
        if (!dayStr) return 'Mon';
        const clean = dayStr.trim().toLowerCase();
        if (clean.startsWith('sun')) return 'Sun';
        if (clean.startsWith('mon')) return 'Mon';
        if (clean.startsWith('tue')) return 'Tue';
        if (clean.startsWith('wed')) return 'Wed';
        if (clean.startsWith('thu')) return 'Thu';
        if (clean.startsWith('fri')) return 'Fri';
        if (clean.startsWith('sat')) return 'Sat';
        return 'Mon';
    }

    function parseClassTime(scheduleString) {
        if (!scheduleString || typeof scheduleString !== 'string' || !scheduleString.includes(', ')) {
            return { day: 'Mon', startTime: '09:00', endTime: '11:00', totalMinutes: 540 };
        }
        const [dayPart, timeRange] = scheduleString.split(', ');
        const [startTime, endTime] = (timeRange || '').split('-');
        
        const [hours, minutes] = (startTime || '0:0').trim().split(':').map(Number);
        const totalMinutes = ((isNaN(hours) ? 0 : hours) * 60) + (isNaN(minutes) ? 0 : minutes);

        return {
            day: normalizeDay(dayPart),
            startTime: (startTime || '09:00').trim(),
            endTime: (endTime || '').trim(),
            totalMinutes: totalMinutes
        };
    }

    function getCurrentTimeSnapshot() {
        const now = new Date();
        return {
            date: now,
            dayIndex: now.getDay(),
            dayName: currentLang === 'ar' ? daysAr[now.getDay()] : daysEn[now.getDay()],
            dayAbbreviation: dayAbbreviations[now.getDay()],
            monthName: currentLang === 'ar' ? monthsAr[now.getMonth()] : monthsEn[now.getMonth()],
            numericDay: now.getDate(),
            hours: now.getHours(),
            minutes: now.getMinutes(),
            totalMinutes: now.getHours() * 60 + now.getMinutes()
        };
    }

    function updateDateDisplay() {
        const time = getCurrentTimeSnapshot();
        const formattedDate = currentLang === 'ar' 
            ? `${time.dayName}، ${time.numericDay} ${time.monthName}`
            : `${time.dayName}, ${time.monthName} ${time.numericDay}`;
        if (scheduleDateDisplay) scheduleDateDisplay.textContent = formattedDate;
    }

    updateDateDisplay();
    setInterval(updateDateDisplay, 1000);

    // Add class form
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
            const t = translations[currentLang];
            const titleVal = classTitleInput.value.trim();
            const codeVal = codeInput.value.trim();
            const instructorVal = instructorInput.value.trim();
            const dayVal = classDaySelect ? classDaySelect.value : 'Mon';
            const startVal = classStartTimeInput ? classStartTimeInput.value : '';
            const endVal = classEndTimeInput ? classEndTimeInput.value : '';

            const errorMsg = document.getElementById('class-error-message');

            if (titleVal === '') {
                if (errorMsg) errorMsg.textContent = t.toast_title_req;
                showToast(t.toast_title_req, true);
                return;
            }

            if (!startVal || !endVal) {
                if (errorMsg) errorMsg.textContent = t.toast_time_req;
                showToast(t.toast_time_req, true);
                return;
            }

            const formattedDate = `${dayVal}, ${startVal} - ${endVal}`;

            const newClass = {
                title: titleVal,
                code: codeVal,
                instructor: instructorVal,
                date: formattedDate
            };

            let existingClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            existingClasses.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(existingClasses));

            showToast(t.toast_class_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 700);
        });
    }

    // Add task form
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
            const t = translations[currentLang];
            const titleVal = taskTitleInput.value.trim();
            const descriptionVal = taskDescriptionInput.value.trim();
            const dayVal = taskDaySelect ? taskDaySelect.value : 'Mon';
            const timeVal = taskDueTimeInput ? taskDueTimeInput.value : '';

            const errorMsg = document.getElementById('task-error-message');

            if (titleVal === '') {
                if (errorMsg) errorMsg.textContent = t.toast_task_title_req;
                showToast(t.toast_task_title_req, true);
                return;
            }

            if (!timeVal) {
                if (errorMsg) errorMsg.textContent = t.toast_task_time_req;
                showToast(t.toast_task_time_req, true);
                return;
            }

            const formattedDate = `${dayVal}, ${timeVal}`;

            const newTask = {
                title: titleVal,
                date: formattedDate,
                description: descriptionVal,
                completed: false
            };

            let existingTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
            existingTasks.push(newTask);
            localStorage.setItem('obsidianTasks', JSON.stringify(existingTasks));

            showToast(t.toast_task_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 700);
        });
    }

    // Dashboard metrics
    function updateDashboardCounters() {
        const timeSnapshot = getCurrentTimeSnapshot();
        const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');

        const todayClassesEl = document.getElementById('today-classes-counter');
        const todayTasksEl = document.getElementById('today-tasks-counter');
        const weekTasksEl = document.getElementById('this-week-tasks-counter');

        if (todayClassesEl) {
            const todayClassesCount = classes.filter(c => {
                const parsed = parseClassTime(c.date);
                return parsed.day === timeSnapshot.dayAbbreviation;
            }).length;
            todayClassesEl.textContent = todayClassesCount;
        }

        if (todayTasksEl) {
            const todayTasksCount = tasks.filter(t => {
                const parsed = parseClassTime(t.date);
                return parsed.day === timeSnapshot.dayAbbreviation && !t.completed;
            }).length;
            todayTasksEl.textContent = todayTasksCount;
        }

        if (weekTasksEl) {
            const activeWeekTasksCount = tasks.filter(t => !t.completed).length;
            weekTasksEl.textContent = activeWeekTasksCount;
        }
    }

    // Render schedule timeline
    function renderSchedule() {
        const timelineContainer = document.getElementById('dashboard-schedule');
        if (!timelineContainer) return;

        const currentTime = getCurrentTimeSnapshot();
        const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const t = translations[currentLang];
        
        const parsedClasses = classes.map(classItem => {
            const parsed = parseClassTime(classItem.date);
            return { ...classItem, parsed };
        });

        let displayClasses = parsedClasses.filter(c => c.parsed.day === currentTime.dayAbbreviation)
            .sort((a, b) => a.parsed.totalMinutes - b.parsed.totalMinutes);

        let isTodaySchedule = true;
        if (displayClasses.length === 0) {
            displayClasses = parsedClasses.slice(0, 3);
            isTodaySchedule = false;
        }

        timelineContainer.innerHTML = '';

        if (displayClasses.length === 0) {
            timelineContainer.innerHTML = `
                <div class="timeline-item">
                    <div class="dot"></div>
                    <div class="card">
                        <h1 style="font-size: 1.25rem; margin: 0;">${t.no_classes_indexed}</h1>
                        <p style="opacity: 0.5; margin: 0; font-size: 0.9rem;">${t.no_classes_indexed_sub}</p>
                    </div>
                </div>`;
            return;
        }

        displayClasses.forEach((classItem, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'timeline-item';
            const isHighlight = index === 0;
            const dotClass = isHighlight ? 'dot active' : 'dot';
            const cardClass = isHighlight ? 'card highlighted' : 'card';

            itemDiv.innerHTML = `
                <div class="${dotClass}"></div>
                <div class="${cardClass}">
                    <span class="time">${isTodaySchedule ? '' : `${classItem.parsed.day} • `}${classItem.parsed.startTime} - ${classItem.parsed.endTime}</span>
                    <h1 style="font-size: 1.2rem; margin: 0.25rem 0 0 0;">${classItem.title} ${classItem.code ? `(${classItem.code})` : ''}</h1>
                    <p style="opacity: 0.5; margin: 4px 0 0 0; font-size: 0.85rem;">${classItem.instructor ? `${t.instructor_label}${classItem.instructor}` : ''}</p>
                </div>
            `;
            timelineContainer.appendChild(itemDiv);
        });
    }

    // Render priority task list
    function renderPriorityTasks() {
        const tasksContainer = document.getElementById('dashboard-tasks');
        if (!tasksContainer) return;

        const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
        const t = translations[currentLang];
        tasksContainer.innerHTML = '';

        if (currentTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="smallcard">
                    <h3 style="margin: 0;">${t.no_tasks}</h3>
                    <p style="opacity: 0.5; margin: 0; font-size: 0.85rem;">${t.no_tasks_sub}</p>
                </div>`;
            return;
        }

        currentTasks.slice(0, 4).forEach(taskItem => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'smallcard';
            cardDiv.innerHTML = `
                <div>
                    <h3 style="margin: 0; font-size: 1rem; ${taskItem.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${taskItem.title}</h3>
                    <p style="opacity: 0.5; font-size: 0.85rem; margin-top: 4px; margin-bottom: 0;">${taskItem.description || ''}</p>
                </div>
                <span style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${taskItem.date || ''}</span>
            `;
            tasksContainer.appendChild(cardDiv);
        });
    }

    // Hub metrics & CRUD (My Classes page)
    const classesListContainer = document.getElementById('classes-list');
    const tasksListContainer = document.getElementById('tasks-list');
    const tasksProgressPercentage = document.getElementById('tasks-progress-percentage');
    const tasksProgressFill = document.getElementById('tasks-progress-fill');
    const classesProgressPercentage = document.getElementById('classes-progress-percentage');
    const classesProgressFill = document.getElementById('classes-progress-fill');

    function updateProgressMetrics() {
        const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
        const currentClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const t = translations[currentLang];

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
            classesProgressPercentage.textContent = `${totalClasses}${t.stat_registered_suffix}`;
        }
        if (classesProgressFill) {
            classesProgressFill.style.width = totalClasses > 0 ? '100%' : '0%';
        }
    }

    function renderClassesList() {
        if (!classesListContainer) return;
        const currentClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const t = translations[currentLang];
        classesListContainer.innerHTML = '';

        if (currentClasses.length === 0) {
            classesListContainer.innerHTML = `
                <div class="card" style="grid-column: 1 / -1;">
                    <p style="color: var(--text-muted); margin: 0;">${t.no_classes_empty}</p>
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
                    ${item.code ? `<span style="color: var(--primary); font-size: 0.85rem; font-weight: 700;">${item.code}</span>` : ''}
                </div>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">${item.instructor ? `${t.instructor_label}${item.instructor}` : `${t.instructor_label}${t.not_assigned}`}</p>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${item.date || t.no_schedule_set}</p>
                <div class="card-actions">
                    <button class="edit-btn" data-action="edit-class" data-index="${index}">${t.btn_edit}</button>
                    <button class="delete-btn" data-action="delete-class" data-index="${index}">${t.btn_delete}</button>
                </div>
            `;
            classesListContainer.appendChild(card);
        });
    }

    function renderTasksList() {
        if (!tasksListContainer) return;
        const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
        const t = translations[currentLang];
        tasksListContainer.innerHTML = '';

        if (currentTasks.length === 0) {
            tasksListContainer.innerHTML = `
                <div class="task-item">
                    <p style="color: var(--text-muted); margin: 0;">${t.no_tasks_empty}</p>
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
                        <p>${task.description || t.no_desc}</p>
                        <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">${t.due_label}${task.date || t.no_date_set}</span>
                    </div>
                </div>
                <div class="card-actions" style="margin-top: 0;">
                    <button class="edit-btn" data-action="edit-task" data-index="${index}">${t.btn_edit}</button>
                    <button class="delete-btn" data-action="delete-task" data-index="${index}">${t.btn_delete}</button>
                </div>
            `;
            tasksListContainer.appendChild(taskCard);
        });
    }

    if (classesListContainer && tasksListContainer) {
        tasksListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const index = Number(e.target.dataset.index);
                const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
                
                if (currentTasks[index]) {
                    currentTasks[index].completed = e.target.checked;
                    localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                    renderTasksList();
                    updateProgressMetrics();
                }
            }
        });

        classesListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const action = target.dataset.action;
            const index = Number(target.dataset.index);
            let currentClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            const t = translations[currentLang];

            if (action === 'delete-class') {
                currentClasses.splice(index, 1);
                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                updateProgressMetrics();
                showToast(t.toast_class_deleted);
            } else if (action === 'edit-class') {
                const card = target.closest('.card');
                const item = currentClasses[index];
                const parsed = parseClassTime(item.date);

                card.innerHTML = `
                    <input type="text" class="edit-field edit-class-title" value="${item.title}">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <input type="text" class="edit-field edit-class-code" value="${item.code || ''}">
                        <input type="text" class="edit-field edit-class-instructor" value="${item.instructor || ''}">
                    </div>
                    <select class="edit-field edit-class-day">
                        ${dayAbbreviations.map(d => `<option value="${d}" ${d === parsed.day ? 'selected' : ''}>${d}</option>`).join('')}
                    </select>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                        <input type="time" class="edit-field edit-class-start" value="${parsed.startTime || ''}">
                        <input type="time" class="edit-field edit-class-end" value="${parsed.endTime || ''}">
                    </div>
                    <div class="card-actions">
                        <button class="save-btn" data-action="save-class" data-index="${index}">${t.btn_save}</button>
                        <button class="cancel-btn" data-action="cancel-class">${t.btn_cancel}</button>
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

                if (!newTitle || !newStart || !newEnd) {
                    showToast(t.toast_time_req, true);
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
                showToast(t.toast_class_updated);
            } else if (action === 'cancel-class') {
                renderClassesList();
            }
        });

        tasksListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const action = target.dataset.action;
            const index = Number(target.dataset.index);
            let currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
            const t = translations[currentLang];

            if (action === 'delete-task') {
                currentTasks.splice(index, 1);
                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                updateProgressMetrics();
                showToast(t.toast_task_deleted);
            } else if (action === 'edit-task') {
                const taskCard = target.closest('.task-item');
                const task = currentTasks[index];
                const [taskDay, taskTime] = (task.date || 'Mon, 12:00').split(', ');

                taskCard.innerHTML = `
                    <div style="width: 100%;">
                        <input type="text" class="edit-field edit-task-title" value="${task.title}">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                            <select class="edit-field edit-task-day">
                                ${dayAbbreviations.map(d => `<option value="${d}" ${d === (taskDay || 'Mon') ? 'selected' : ''}>${d}</option>`).join('')}
                            </select>
                            <input type="time" class="edit-field edit-task-time" value="${(taskTime || '').trim()}">
                        </div>
                        <input type="text" class="edit-field edit-task-desc" value="${task.description || ''}">
                        <div class="card-actions">
                            <button class="save-btn" data-action="save-task" data-index="${index}">${t.btn_save}</button>
                            <button class="cancel-btn" data-action="cancel-task">${t.btn_cancel}</button>
                        </div>
                    </div>
                `;
            } else if (action === 'save-task') {
                const taskCard = target.closest('.task-item');
                const newTitle = taskCard.querySelector('.edit-task-title').value.trim();
                const newDay = taskCard.querySelector('.edit-task-day').value;
                const newTime = taskCard.querySelector('.edit-task-time').value;
                const newDesc = taskCard.querySelector('.edit-task-desc').value.trim();

                if (!newTitle || !newTime) {
                    showToast(t.toast_task_time_req, true);
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
                showToast(t.toast_task_updated);
            } else if (action === 'cancel-task') {
                renderTasksList();
            }
        });
    }

    // FAQ actions
    const faqList = document.getElementById('faq-list');
    const faqDetail = document.getElementById('faq-detail');
    const faqBackBtn = document.getElementById('faq-back-btn');
    const faqQuestionDisplay = document.getElementById('faq-detail-question');
    const faqAnswerDisplay = document.getElementById('faq-detail-answer');

    if (faqList && faqDetail) {
        faqList.addEventListener('click', (e) => {
            const button = e.target.closest('.faq-button');
            if (!button) return;

            const faqId = button.dataset.faq;
            const faqItem = faqDatabase[currentLang][faqId];

            if (faqItem) {
                faqQuestionDisplay.textContent = faqItem.question;
                faqAnswerDisplay.textContent = faqItem.answer;
                faqList.style.display = 'none';
                faqDetail.style.display = 'flex';
            }
        });

        if (faqBackBtn) {
            faqBackBtn.addEventListener('click', () => {
                faqDetail.style.display = 'none';
                faqList.style.display = 'flex';
            });
        }
    }

    // Discord webhook transmission
    const contactForm = document.getElementById('contact-form');
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1541116574692286535/9_-c0bSZ33hJB3CoDlIARtjmkGSCnlJx_E4yRyzH8OAsaxb5IxO-NGHRwaquwWa1N7U7';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const t = translations[currentLang];

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject');
            const messageInput = document.getElementById('contact-message');
            const submitBtn = document.getElementById('contact-submit-btn');
            const errorMsg = document.getElementById('contact-error-message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (!name || !email || !subject || !message) {
                if (errorMsg) errorMsg.textContent = t.toast_contact_req;
                showToast(t.toast_contact_req, true);
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = t.btn_transmitting;

            const discordPayload = {
                username: "Obsidian Terminal",
                avatar_url: "https://i.imgur.com/83pL34z.png",
                embeds: [
                    {
                        title: `Transmission: ${subject}`,
                        color: 14334463,
                        fields: [
                            { name: "Sender", value: name, inline: true },
                            { name: "Email", value: email, inline: true },
                            { name: "Message", value: message, inline: false }
                        ],
                        footer: { text: "Obsidian Architect Communication Log" },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            try {
                const response = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(discordPayload)
                });

                if (response.ok) {
                    showToast(t.toast_discord_ok);
                    contactForm.reset();
                    if (errorMsg) errorMsg.textContent = "";
                } else {
                    showToast(t.toast_discord_err, true);
                }
            } catch (err) {
                showToast(t.toast_discord_net_err, true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = t.btn_transmit;
            }
        });
    }

    // Initialize UI language
    setLanguage(currentLang);

    const viewAllTasksBtn = document.getElementById('view-all-tasks');
    if (viewAllTasksBtn) {
        viewAllTasksBtn.addEventListener('click', () => {
            window.location.href = 'classes.html';
        });
    }
});