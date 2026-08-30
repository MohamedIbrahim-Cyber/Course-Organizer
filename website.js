document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Defensive Security Utilities (XSS Prevention & Prototype Hardening)
    // --------------------------------------------------------------------------
    
    // Robust HTML Sanitizer to prevent DOM-based XSS
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/`/g, '&#x60;');
    }

    // Prototype-Pollution Resistant JSON Parser
    function safeJSONParse(rawStr, fallback = null) {
        if (!rawStr || typeof rawStr !== 'string') return fallback;
        try {
            const parsed = JSON.parse(rawStr, (key, value) => {
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                    return undefined; // Drop hazardous prototype-pollution properties
                }
                return value;
            });
            return parsed !== null && parsed !== undefined ? parsed : fallback;
        } catch {
            return fallback;
        }
    }

    // Avatar URL Sanitizer against malicious schemes (javascript:, data:text/html, etc.)
    function sanitizeAvatarUrl(url) {
        if (!url || typeof url !== 'string') return 'photos/avatar.png';
        const trimmed = url.trim();
        
        // Allowed local presets
        const allowedPresets = [
            'photos/avatar.png',
            'photos/websitelogo.png',
            'photos/security.png',
            'photos/serverlink.png'
        ];
        if (allowedPresets.includes(trimmed)) {
            return trimmed;
        }

        // Allowed safe Base64 image formats
        if (/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(trimmed)) {
            return trimmed;
        }

        // Allowed HTTPS URLs (e.g. imgur, trusted cdns)
        if (/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[^\s"']+$/.test(trimmed)) {
            return trimmed;
        }

        return 'photos/avatar.png';
    }

    // Strict Schema Validator for Backup Restores
    function validateBackupSchema(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            return { valid: false, error: 'Backup payload must be a JSON object.' };
        }

        // Reject prototype pollution attempts
        if (Object.prototype.hasOwnProperty.call(data, '__proto__') ||
            Object.prototype.hasOwnProperty.call(data, 'constructor') ||
            Object.prototype.hasOwnProperty.call(data, 'prototype')) {
            return { valid: false, error: 'Malicious prototype properties detected.' };
        }

        const sanitized = {
            classes: [],
            tasks: [],
            operatorName: 'Architect'
        };

        // 1. Classes array validation (Max 50 courses, max 250 chars per field)
        const rawClasses = data.classes || data.obsidianClasses;
        if (rawClasses !== undefined) {
            if (!Array.isArray(rawClasses) || rawClasses.length > 50) {
                return { valid: false, error: 'Classes list must be an array with maximum 50 courses.' };
            }

            for (const item of rawClasses) {
                if (!item || typeof item !== 'object' || Array.isArray(item)) {
                    return { valid: false, error: 'Each class record must be a valid object.' };
                }
                if (typeof item.title !== 'string' || item.title.trim().length === 0 || item.title.length > 250) {
                    return { valid: false, error: 'Class title is required and must be under 250 characters.' };
                }
                const code = item.code ? String(item.code).slice(0, 100) : '';
                const instructor = item.instructor ? String(item.instructor).slice(0, 250) : '';
                const date = item.date ? String(item.date).slice(0, 250) : 'Mon, 09:00 - 10:30';

                sanitized.classes.push({
                    title: String(item.title).trim().slice(0, 250),
                    code,
                    instructor,
                    date
                });
            }
        }

        // 2. Tasks array validation (Max 200 tasks, max 250/1000 chars per field)
        const rawTasks = data.tasks || data.obsidianTasks;
        if (rawTasks !== undefined) {
            if (!Array.isArray(rawTasks) || rawTasks.length > 200) {
                return { valid: false, error: 'Tasks list must be an array with maximum 200 entries.' };
            }

            for (const item of rawTasks) {
                if (!item || typeof item !== 'object' || Array.isArray(item)) {
                    return { valid: false, error: 'Each task record must be a valid object.' };
                }
                if (typeof item.title !== 'string' || item.title.trim().length === 0 || item.title.length > 250) {
                    return { valid: false, error: 'Task title is required and must be under 250 characters.' };
                }
                const description = item.description ? String(item.description).slice(0, 1000) : '';
                const date = item.date ? String(item.date).slice(0, 250) : 'Mon, 23:59';
                const completed = Boolean(item.completed);

                sanitized.tasks.push({
                    title: String(item.title).trim().slice(0, 250),
                    description,
                    date,
                    completed
                });
            }
        }

        // 3. Operator Name validation (Max 60 chars)
        const rawName = data.operatorName || data.obsidian_operator_name;
        if (rawName !== undefined && rawName !== null) {
            if (typeof rawName !== 'string' || rawName.length > 60) {
                return { valid: false, error: 'Operator name must be a string under 60 characters.' };
            }
            sanitized.operatorName = rawName.trim().slice(0, 60);
        }

        return { valid: true, sanitized };
    }

    // --------------------------------------------------------------------------
    // 2. Core Translation Dictionary (English & Arabic)
    // --------------------------------------------------------------------------
    const translations = {
        en: {
            logo: "Obsidian Architect",
            nav_home: "Home",
            nav_add: "Add Class",
            nav_classes: "My Classes",
            nav_contact: "Contact us",
            welcome_header: "Welcome back",
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
            no_classes_empty: "No classes match your filter criteria.",
            active_tasks_heading: "Active Tasks",
            active_tasks_desc: "Pending operational objectives",
            btn_add_task: "Add a Task",
            no_tasks_empty: "No tasks match your filter criteria.",
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
            toast_contact_req: "All fields and bot verification are required.",
            toast_discord_ok: "Transmission beamed to Discord channel!",
            toast_discord_err: "Discord transmission error.",
            toast_discord_net_err: "Transmission relayed locally.",
            
            // Feature translations
            search_placeholder: "Search courses, codes, instructors, or task objectives...",
            filter_by_day: "Schedule:",
            filter_by_task: "Tasks:",
            chip_all: "All Days",
            chip_today: "Today",
            chip_sun: "Sun",
            chip_mon: "Mon",
            chip_tue: "Tue",
            chip_wed: "Wed",
            chip_thu: "Thu",
            chip_fri: "Fri",
            chip_sat: "Sat",
            chip_all_tasks: "All Tasks",
            chip_active_tasks: "Active",
            chip_completed_tasks: "Completed",
            notif_title: "System Alerts",
            notif_clear: "Mark All Read",
            notif_empty: "All queues clear. No unread alerts.",
            profile_modal_title: "Operator Terminal Profile",
            operator_name_label: "Call-Sign / Architect Name",
            choose_avatar_label: "Select System Avatar",
            custom_photo_label: "Or Upload Custom Photo",
            btn_choose_photo: "Choose Photo",
            upload_hint: "Supports PNG, JPG, WebP. Click or drag to change.",
            toast_photo_loaded: "Custom photo loaded! Click Save Profile to apply.",
            toast_photo_too_large: "Image exceeds 5MB. Please choose a smaller image.",
            btn_export_data: "Export Backup (JSON)",
            btn_import_data: "Import Backup",
            toast_profile_saved: "Operator profile updated.",
            toast_export_ok: "System backup downloaded successfully.",
            toast_import_ok: "Backup restored successfully!",
            toast_import_err: "Invalid or corrupted backup JSON file format.",
            live_status_in_session: "● IN SESSION:",
            live_status_upcoming: "⏱ NEXT NODE:",
            live_status_concluded: "✓ ALL NODES CONCLUDED FOR TODAY",
            live_status_none: "○ NO LECTURES SCHEDULED TODAY"
        },
        ar: {
            logo: "المهندس أوبسيديان",
            nav_home: "الرئيسية",
            nav_add: "إضافة محاضرة",
            nav_classes: "محاضراتي",
            nav_contact: "تواصل معنا",
            welcome_header: "مرحبًا بعودتك",
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
            due_label: "موعد التسليم: ",
            no_date_set: "لم يحدد تاريخ",
            no_desc: "لا يوجد وصف مدخل.",
            my_classes_title: "محاضراتي",
            stat_classes_indexed: "المحاضرات المسجلة",
            stat_tasks_completion: "نسبة إنجاز المهام",
            stat_registered_suffix: " مسجلة",
            reg_classes_heading: "المحاضرات المسجلة",
            reg_classes_desc: "المساقات والمواد المفهرسة في محطتك الأكاديمية",
            btn_add_class: "إضافة مادة",
            no_classes_empty: "لا توجد محاضرات تطابق معايير البحث الحالية.",
            active_tasks_heading: "المهام النشطة",
            active_tasks_desc: "الأهداف الأكاديمية والواجبات المعلقة",
            btn_add_task: "إضافة مهمة",
            no_tasks_empty: "لا توجد مهام تطابق معايير البحث الحالية.",
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
            toast_contact_req: "جميع الحقول والتحقق الأمني مطلوبة لإتمام الإرسال.",
            toast_discord_ok: "تم إرسال الرسالة بنجاح عبر Discord!",
            toast_discord_err: "حدث خطأ أثناء الإرسال.",
            toast_discord_net_err: "تم تسجيل الرسالة محليًا بنجاح.",
            
            // Feature translations (Arabic)
            search_placeholder: "ابحث في المواد، الأكواد، المحاضرين، أو أهداف المهام...",
            filter_by_day: "الجدول:",
            filter_by_task: "المهام:",
            chip_all: "جميع الأيام",
            chip_today: "اليوم",
            chip_sun: "الأحد",
            chip_mon: "الاثنين",
            chip_tue: "الثلاثاء",
            chip_wed: "الأربعاء",
            chip_thu: "الخميس",
            chip_fri: "الجمعة",
            chip_sat: "السبت",
            chip_all_tasks: "جميع المهام",
            chip_active_tasks: "النشطة",
            chip_completed_tasks: "المكتملة",
            notif_title: "تنبيهات النظام",
            notif_clear: "تحديد الكل كمقروء",
            notif_empty: "جميع القوائم منجزة. لا توجد تنبيهات جديدة.",
            profile_modal_title: "الملف التعريفي للمهندس",
            operator_name_label: "اسم المهندس / نداء المحطة",
            choose_avatar_label: "اختر صورة الرمز",
            custom_photo_label: "أو ارفع صورة مخصصة من جهازك",
            btn_choose_photo: "اختيار صورة",
            upload_hint: "يدعم PNG، JPG، WebP. انقر أو اسحب لتغيير الصورة.",
            toast_photo_loaded: "تم تحميل صورتك المخصصة! اضغط حفظ الملف الشخصي لتطبيقها.",
            toast_photo_too_large: "حجم الصورة يتجاوز 5 ميجابايت. يرجى اختيار صورة أصغر.",
            btn_export_data: "تصدير نسخة احتياطية (JSON)",
            btn_import_data: "استيراد نسخة",
            toast_profile_saved: "تم حفظ الملف التعريفي بنجاح.",
            toast_export_ok: "تم تحميل النسخة الاحتياطية بنجاح.",
            toast_import_ok: "تم استيراد واستعادة البيانات بنجاح!",
            toast_import_err: "ملف النسخة الاحتياطية تالف أو غير صالح.",
            live_status_in_session: "● قيد الانعقاد:",
            live_status_upcoming: "⏱ المحاضرة القادمة:",
            live_status_concluded: "✓ انتهت جميع محاضرات اليوم",
            live_status_none: "○ لا توجد محاضرات مجدولة لليوم"
        }
    };

    // --------------------------------------------------------------------------
    // 3. System Defaults & Local Storage Initialization
    // --------------------------------------------------------------------------
    const legacyDefaultClassTitles = [
        "Network Security & Cryptography",
        "Autonomous Robotics Engineering",
        "Database Systems & Architecture",
        "Quantum Algorithms & Computation",
        "Advanced Operating Systems",
        "Distributed Systems & Cloud",
        "Cyber Security Protocols"
    ].map(s => s.toLowerCase().trim());

    const legacyDefaultTaskTitles = [
        "Kernel Synchronization Lab",
        "Microservices Architecture Essay",
        "Network Packet Analysis WireGuard",
        "RSA Encryption Lab Report",
        "Robotics Inverse Kinematics",
        "Database B-Tree Index Optimization"
    ].map(s => s.toLowerCase().trim());

    const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    function generateUniqueId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    function initializeDefaultData() {
        // Retrieve existing classes without re-seeding built-ins on refresh
        let localClasses = safeJSONParse(localStorage.getItem('obsidianClasses'), null);
        if (localClasses === null) {
            localStorage.setItem('obsidianClasses', JSON.stringify([]));
        } else if (Array.isArray(localClasses)) {
            // Strip out old sample/mock default titles if still lingering
            const cleaned = localClasses.filter(c => {
                if (!c || !c.title) return false;
                const titleNorm = String(c.title).toLowerCase().trim();
                return !legacyDefaultClassTitles.includes(titleNorm);
            }).map((c, i) => {
                if (!c.id) c.id = generateUniqueId('cls') + '_' + i;
                return c;
            });
            localStorage.setItem('obsidianClasses', JSON.stringify(cleaned));
        } else {
            localStorage.setItem('obsidianClasses', JSON.stringify([]));
        }

        // Retrieve existing tasks without re-seeding built-ins on refresh
        let localTasks = safeJSONParse(localStorage.getItem('obsidianTasks'), null);
        if (localTasks === null) {
            localStorage.setItem('obsidianTasks', JSON.stringify([]));
        } else if (Array.isArray(localTasks)) {
            // Strip out old sample/mock default titles if still lingering
            const cleanedTasks = localTasks.filter(t => {
                if (!t || !t.title) return false;
                const titleNorm = String(t.title).toLowerCase().trim();
                return !legacyDefaultTaskTitles.includes(titleNorm);
            }).map((t, i) => {
                if (!t.id) t.id = generateUniqueId('tsk') + '_' + i;
                return t;
            });
            localStorage.setItem('obsidianTasks', JSON.stringify(cleanedTasks));
        } else {
            localStorage.setItem('obsidianTasks', JSON.stringify([]));
        }

        // Remove obsolete legacy backup keys so deleted data is never resurrected
        localStorage.removeItem('obsidian_backup_classes');
        localStorage.removeItem('obsidian_backup_tasks');
    }
    initializeDefaultData();

    // --------------------------------------------------------------------------
    // 4. FAQ Database
    // --------------------------------------------------------------------------
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

    // --------------------------------------------------------------------------
    // 5. Language & Theme Engines
    // --------------------------------------------------------------------------
    let currentLang = localStorage.getItem('obsidian_lang') || 'en';
    const langBtn = document.getElementById('lang-btn');

    function updateOperatorGreeting() {
        const rawName = localStorage.getItem('obsidian_operator_name') || 'Architect';
        const operatorName = String(rawName).slice(0, 60);
        const welcomeEl = document.getElementById('welcome-header-display');
        if (welcomeEl) {
            if (currentLang === 'ar') {
                welcomeEl.textContent = `مرحبًا بعودتك ${operatorName}.`;
            } else {
                welcomeEl.textContent = `Welcome back ${operatorName}.`;
            }
        }
    }

    function updateAvatarImages() {
        const rawAvatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';
        const safeAvatar = sanitizeAvatarUrl(rawAvatar);
        const navAvatars = document.querySelectorAll('#nav-avatar-img, .profile-pic img');
        navAvatars.forEach(img => {
            img.src = safeAvatar;
        });
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('obsidian_lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        if (langBtn) {
            langBtn.textContent = lang === 'ar' ? 'EN' : 'AR';
        }

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (key === 'welcome_header') {
                    updateOperatorGreeting();
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Placeholders
        const placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderEls.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        updateDateDisplay();
        updateDashboardCounters();
        renderSchedule();
        renderPriorityTasks();
        renderClassesList();
        renderTasksList();
        updateProgressMetrics();
        renderFaqList();
        renderNotifications();
        updateLiveCountdown();
        updateOperatorGreeting();
    }

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            setLanguage(currentLang === 'en' ? 'ar' : 'en');
        });
    }

    // Theme Engine
    const themeBtn = document.getElementById('theme-btn');
    let currentTheme = localStorage.getItem('obsidian_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('obsidian_theme', currentTheme);
        });
    }

    // Toast Notifications
    function showToast(message, isError = false) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        toast.textContent = String(message || '');
        toast.style.borderColor = isError ? 'var(--accent-alert)' : 'var(--primary)';
        toast.style.color = isError ? 'var(--accent-alert)' : 'var(--text-main)';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // --------------------------------------------------------------------------
    // 6. Time & Date Utility Parsers
    // --------------------------------------------------------------------------
    function normalizeDay(dayStr) {
        if (!dayStr) return 'Sun';
        const s = dayStr.trim().toLowerCase();
        if (s.startsWith('sun') || s.includes('أحد')) return 'Sun';
        if (s.startsWith('mon') || s.includes('اثنين')) return 'Mon';
        if (s.startsWith('tue') || s.includes('ثلاثاء')) return 'Tue';
        if (s.startsWith('wed') || s.includes('أربعاء')) return 'Wed';
        if (s.startsWith('thu') || s.includes('خميس')) return 'Thu';
        if (s.startsWith('fri') || s.includes('جمعة')) return 'Fri';
        if (s.startsWith('sat') || s.includes('سبت')) return 'Sat';
        return 'Sun';
    }

    function parseClassTime(scheduleString) {
        if (!scheduleString) return { day: 'Sun', startTime: '09:00', endTime: '10:30', startMinutes: 540, endMinutes: 630 };
        const parts = scheduleString.split(',');
        const dayPart = parts[0] ? parts[0].trim() : 'Sun';
        const day = normalizeDay(dayPart);
        const timePart = parts[1] ? parts[1].trim() : '09:00 - 10:30';
        const times = timePart.split('-');
        const startTime = times[0] ? times[0].trim() : '09:00';
        const endTime = times[1] ? times[1].trim() : '10:30';

        const [startHours, startMins] = startTime.split(':').map(Number);
        const [endHours, endMins] = endTime.split(':').map(Number);

        const startMinutes = (isNaN(startHours) ? 9 : startHours) * 60 + (isNaN(startMins) ? 0 : startMins);
        const endMinutes = (isNaN(endHours) ? 10 : endHours) * 60 + (isNaN(endMins) ? 30 : endMins);

        return { day, startTime, endTime, startMinutes, endMinutes };
    }

    function getCurrentTimeSnapshot() {
        const now = new Date();
        const dayIndex = now.getDay();
        const dayAbbreviation = dayAbbreviations[dayIndex];
        const dayEn = daysEn[dayIndex];
        const dayAr = daysAr[dayIndex];
        const monthEn = monthsEn[now.getMonth()];
        const monthAr = monthsAr[now.getMonth()];
        const dayNumber = now.getDate();
        const year = now.getFullYear();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return {
            dateObj: now,
            dayIndex,
            dayAbbreviation,
            dayEn,
            dayAr,
            monthEn,
            monthAr,
            dayNumber,
            year,
            currentMinutes
        };
    }

    function updateDateDisplay() {
        const dateEl = document.getElementById('schedule-date');
        if (!dateEl) return;
        const now = getCurrentTimeSnapshot();
        if (currentLang === 'ar') {
            dateEl.textContent = `${now.dayAr}، ${now.dayNumber} ${now.monthAr} ${now.year}`;
        } else {
            dateEl.textContent = `${now.dayEn}, ${now.monthEn} ${now.dayNumber}, ${now.year}`;
        }
    }

    // --------------------------------------------------------------------------
    // 7. Dashboard Counters & Live Next-Class Banner
    // --------------------------------------------------------------------------
    function updateDashboardCounters() {
        const todayClassesCounter = document.getElementById('today-classes-counter');
        const todayTasksCounter = document.getElementById('today-tasks-counter');
        const thisWeekTasksCounter = document.getElementById('this-week-tasks-counter');

        const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
        const tasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
        const currentTime = getCurrentTimeSnapshot();

        // 1. Classes Today
        const todayClassesCount = classes.filter(c => {
            if (!c) return false;
            const parsed = parseClassTime(c.date);
            return parsed.day === currentTime.dayAbbreviation;
        }).length;

        // 2. Tasks Due Today
        const todayTasksCount = tasks.filter(t => {
            if (!t || t.completed) return false;
            const taskDay = normalizeDay(t.date);
            return taskDay === currentTime.dayAbbreviation;
        }).length;

        // 3. Tasks Due This Active Week
        const activeWeekTasksCount = tasks.filter(t => t && !t.completed).length;

        if (todayClassesCounter) todayClassesCounter.textContent = todayClassesCount;
        if (todayTasksCounter) todayTasksCounter.textContent = todayTasksCount;
        if (thisWeekTasksCounter) thisWeekTasksCounter.textContent = activeWeekTasksCount;
    }

    function updateLiveCountdown() {
        const banner = document.getElementById('live-countdown-banner');
        const statusText = document.getElementById('live-status-text');
        const timerText = document.getElementById('live-countdown-timer');
        if (!banner || !statusText || !timerText) return;

        const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
        const now = getCurrentTimeSnapshot();
        const t = translations[currentLang];

        const todayClasses = classes
            .filter(Boolean)
            .map(c => ({ ...c, parsed: parseClassTime(c.date) }))
            .filter(c => c.parsed.day === now.dayAbbreviation)
            .sort((a, b) => a.parsed.startMinutes - b.parsed.startMinutes);

        if (todayClasses.length === 0) {
            statusText.textContent = t.live_status_none;
            timerText.textContent = "--:--";
            return;
        }

        // Check if currently in class
        const currentClass = todayClasses.find(c => now.currentMinutes >= c.parsed.startMinutes && now.currentMinutes < c.parsed.endMinutes);
        if (currentClass) {
            const minutesLeft = currentClass.parsed.endMinutes - now.currentMinutes;
            statusText.textContent = `${t.live_status_in_session} ${currentClass.title} ${currentClass.code ? `(${currentClass.code})` : ''}`;
            timerText.textContent = `${minutesLeft}m remaining`;
            return;
        }

        // Check upcoming class today
        const nextClass = todayClasses.find(c => c.parsed.startMinutes > now.currentMinutes);
        if (nextClass) {
            const minutesToStart = nextClass.parsed.startMinutes - now.currentMinutes;
            const hours = Math.floor(minutesToStart / 60);
            const mins = minutesToStart % 60;
            const formattedTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

            statusText.textContent = `${t.live_status_upcoming} ${nextClass.title} (${nextClass.parsed.startTime})`;
            timerText.textContent = `Starts in ${formattedTime}`;
            return;
        }

        // All concluded
        statusText.textContent = t.live_status_concluded;
        timerText.textContent = "DONE";
    }

    setInterval(updateLiveCountdown, 20000);

    // --------------------------------------------------------------------------
    // 8. Render Schedule & Priority Tasks (Dashboard) - XSS Hardened
    // --------------------------------------------------------------------------
    function renderSchedule() {
        const timelineContainer = document.getElementById('dashboard-schedule');
        if (!timelineContainer) return;

        const currentTime = getCurrentTimeSnapshot();
        const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
        const t = translations[currentLang];

        const parsedClasses = classes.filter(Boolean).map(classItem => {
            const parsed = parseClassTime(classItem.date);
            return { ...classItem, parsed };
        });

        let displayClasses = parsedClasses.filter(c => c.parsed.day === currentTime.dayAbbreviation)
            .sort((a, b) => a.parsed.startMinutes - b.parsed.startMinutes);

        let isTodaySchedule = true;
        if (displayClasses.length === 0) {
            displayClasses = parsedClasses.slice(0, 3);
            isTodaySchedule = false;
        }

        timelineContainer.textContent = '';

        if (displayClasses.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'timeline-item';
            
            const dot = document.createElement('div');
            dot.className = 'dot';
            
            const card = document.createElement('div');
            card.className = 'card';
            
            const h1 = document.createElement('h1');
            h1.style.fontSize = '1.25rem';
            h1.style.margin = '0';
            h1.textContent = t.no_classes_indexed;
            
            const p = document.createElement('p');
            p.style.opacity = '0.5';
            p.style.margin = '0';
            p.style.fontSize = '0.9rem';
            p.textContent = t.no_classes_indexed_sub;
            
            card.appendChild(h1);
            card.appendChild(p);
            emptyDiv.appendChild(dot);
            emptyDiv.appendChild(card);
            timelineContainer.appendChild(emptyDiv);
            return;
        }

        displayClasses.forEach((classItem, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'timeline-item';
            const isHighlight = isTodaySchedule && index === 0;
            
            const dot = document.createElement('div');
            dot.className = isHighlight ? 'dot active' : 'dot';
            
            const card = document.createElement('div');
            card.className = isHighlight ? 'card highlighted' : 'card';
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'time';
            timeSpan.textContent = `${isTodaySchedule ? '' : `${classItem.parsed.day} • `}${classItem.parsed.startTime} - ${classItem.parsed.endTime}`;
            
            const titleH1 = document.createElement('h1');
            titleH1.style.fontSize = '1.2rem';
            titleH1.style.margin = '0.25rem 0 0 0';
            titleH1.textContent = classItem.code ? `${classItem.title} (${classItem.code})` : classItem.title;
            
            card.appendChild(timeSpan);
            card.appendChild(titleH1);

            if (classItem.instructor) {
                const instP = document.createElement('p');
                instP.style.opacity = '0.5';
                instP.style.margin = '4px 0 0 0';
                instP.style.fontSize = '0.85rem';
                instP.textContent = `${t.instructor_label}${classItem.instructor}`;
                card.appendChild(instP);
            }

            itemDiv.appendChild(dot);
            itemDiv.appendChild(card);
            timelineContainer.appendChild(itemDiv);
        });
    }

    function renderPriorityTasks() {
        const tasksContainer = document.getElementById('dashboard-tasks');
        if (!tasksContainer) return;

        const currentTasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
        const t = translations[currentLang];
        tasksContainer.textContent = '';

        const validTasks = currentTasks.filter(Boolean);

        if (validTasks.length === 0) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'smallcard';
            
            const h3 = document.createElement('h3');
            h3.style.margin = '0';
            h3.textContent = t.no_tasks;
            
            const p = document.createElement('p');
            p.style.opacity = '0.5';
            p.style.margin = '0';
            p.style.fontSize = '0.85rem';
            p.textContent = t.no_tasks_sub;
            
            emptyCard.appendChild(h3);
            emptyCard.appendChild(p);
            tasksContainer.appendChild(emptyCard);
            return;
        }

        validTasks.slice(0, 4).forEach(taskItem => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'smallcard';
            
            const infoDiv = document.createElement('div');
            
            const h3 = document.createElement('h3');
            h3.style.margin = '0';
            h3.style.fontSize = '1rem';
            if (taskItem.completed) {
                h3.style.textDecoration = 'line-through';
                h3.style.opacity = '0.5';
            }
            h3.textContent = taskItem.title || '';
            
            const p = document.createElement('p');
            p.style.opacity = '0.5';
            p.style.fontSize = '0.85rem';
            p.style.marginTop = '4px';
            p.style.marginBottom = '0';
            p.textContent = taskItem.description || '';
            
            infoDiv.appendChild(h3);
            infoDiv.appendChild(p);
            cardDiv.appendChild(infoDiv);

            if (taskItem.date) {
                const dateSpan = document.createElement('span');
                dateSpan.style.fontSize = '0.85rem';
                dateSpan.style.color = 'var(--primary)';
                dateSpan.style.fontWeight = '600';
                dateSpan.textContent = taskItem.date;
                cardDiv.appendChild(dateSpan);
            }

            tasksContainer.appendChild(cardDiv);
        });
    }

    // --------------------------------------------------------------------------
    // 9. Filter & Search Engine (My Classes page)
    // --------------------------------------------------------------------------
    let activeDayFilter = 'all';
    let activeTaskFilter = 'all';
    let activeSearchQuery = '';

    const searchInput = document.getElementById('classes-search-input');
    const dayFilterChips = document.getElementById('day-filter-chips');
    const taskFilterChips = document.getElementById('task-filter-chips');

    if (searchInput) {
        // Explicitly clear value and disable browser autofill/autocomplete
        searchInput.value = '';
        activeSearchQuery = '';
        searchInput.setAttribute('autocomplete', 'off');
        searchInput.setAttribute('autocorrect', 'off');
        searchInput.setAttribute('autocapitalize', 'off');
        searchInput.setAttribute('spellcheck', 'false');

        searchInput.addEventListener('input', (e) => {
            activeSearchQuery = e.target.value.trim().toLowerCase();
            renderClassesList();
            renderTasksList();
        });

        // Ensure search input is cleared whenever the page is loaded or restored from cache
        window.addEventListener('pageshow', () => {
            if (searchInput) {
                searchInput.value = '';
                activeSearchQuery = '';
                renderClassesList();
                renderTasksList();
            }
        });
    }

    if (dayFilterChips) {
        dayFilterChips.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-chip')) {
                dayFilterChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                activeDayFilter = e.target.dataset.day;
                renderClassesList();
            }
        });
    }

    if (taskFilterChips) {
        taskFilterChips.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-chip')) {
                taskFilterChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                activeTaskFilter = e.target.dataset.taskFilter;
                renderTasksList();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 10. Render Classes & Tasks Hub (My Classes page) - XSS Hardened
    // --------------------------------------------------------------------------
    const classesListContainer = document.getElementById('classes-list');
    const tasksListContainer = document.getElementById('tasks-list');
    const tasksProgressPercentage = document.getElementById('tasks-progress-percentage');
    const tasksProgressFill = document.getElementById('tasks-progress-fill');
    const classesProgressPercentage = document.getElementById('classes-progress-percentage');
    const classesProgressFill = document.getElementById('classes-progress-fill');

    function updateProgressMetrics() {
        const currentTasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
        const currentClasses = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
        const t = translations[currentLang];

        if (classesProgressPercentage) {
            classesProgressPercentage.textContent = `${currentClasses.length}${t.stat_registered_suffix}`;
        }
        if (classesProgressFill) {
            classesProgressFill.style.width = currentClasses.length > 0 ? `${Math.min(currentClasses.length * 20, 100)}%` : '0%';
        }

        const totalTasks = currentTasks.length;
        const completedTasks = currentTasks.filter(task => task && task.completed).length;
        const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        if (tasksProgressPercentage) {
            tasksProgressPercentage.textContent = `${percent}%`;
        }
        if (tasksProgressFill) {
            tasksProgressFill.style.width = `${percent}%`;
        }
    }

    function renderClassesList() {
        if (!classesListContainer) return;
        const currentClasses = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
        const t = translations[currentLang];
        const now = getCurrentTimeSnapshot();

        const filtered = currentClasses.filter(c => {
            if (!c) return false;
            const parsed = parseClassTime(c.date);
            const matchesDay = activeDayFilter === 'all' || 
                (activeDayFilter === 'today' && parsed.day === now.dayAbbreviation) ||
                (parsed.day.toLowerCase() === activeDayFilter.toLowerCase());

            const query = activeSearchQuery;
            const matchesSearch = !query || 
                (c.title && c.title.toLowerCase().includes(query)) ||
                (c.code && c.code.toLowerCase().includes(query)) ||
                (c.instructor && c.instructor.toLowerCase().includes(query));

            return matchesDay && matchesSearch;
        });

        classesListContainer.textContent = '';

        if (filtered.length === 0) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'card';
            emptyCard.style.gridColumn = '1 / -1';
            emptyCard.style.textAlign = 'center';
            emptyCard.style.padding = '2rem';
            
            const emptyP = document.createElement('p');
            emptyP.style.color = 'var(--text-muted)';
            emptyP.style.margin = '0';
            emptyP.textContent = t.no_classes_empty;
            
            emptyCard.appendChild(emptyP);
            classesListContainer.appendChild(emptyCard);
            return;
        }

        filtered.forEach((item) => {
            const itemId = item.id || ('cls_' + Math.random().toString(36).slice(2, 8));
            item.id = itemId;

            const card = document.createElement('article');
            card.className = 'card';
            card.dataset.id = itemId;

            const headerFlex = document.createElement('div');
            headerFlex.className = 'card-header-flex';

            const titleEl = document.createElement('h3');
            titleEl.style.margin = '0';
            titleEl.style.color = 'var(--text-main)';
            titleEl.style.fontSize = '1.1rem';
            titleEl.textContent = item.title || '';
            headerFlex.appendChild(titleEl);

            if (item.code) {
                const codeSpan = document.createElement('span');
                codeSpan.style.color = 'var(--primary)';
                codeSpan.style.fontSize = '0.85rem';
                codeSpan.style.fontWeight = '700';
                codeSpan.textContent = item.code;
                headerFlex.appendChild(codeSpan);
            }
            card.appendChild(headerFlex);

            const instructorP = document.createElement('p');
            instructorP.style.margin = '0';
            instructorP.style.fontSize = '0.9rem';
            instructorP.style.color = 'var(--text-muted)';
            instructorP.textContent = item.instructor 
                ? `${t.instructor_label}${item.instructor}` 
                : `${t.instructor_label}${t.not_assigned}`;
            card.appendChild(instructorP);

            const dateP = document.createElement('p');
            dateP.style.margin = '0';
            dateP.style.fontSize = '0.85rem';
            dateP.style.color = 'var(--text-muted)';
            dateP.textContent = item.date || t.no_schedule_set;
            card.appendChild(dateP);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'card-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.dataset.action = 'edit-class';
            editBtn.dataset.id = itemId;
            editBtn.textContent = t.btn_edit;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.dataset.action = 'delete-class';
            deleteBtn.dataset.id = itemId;
            deleteBtn.textContent = t.btn_delete;

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            card.appendChild(actionsDiv);

            classesListContainer.appendChild(card);
        });
    }

    function renderTasksList() {
        if (!tasksListContainer) return;
        const currentTasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
        const t = translations[currentLang];

        const filtered = currentTasks.filter(task => {
            if (!task) return false;
            const matchesStatus = activeTaskFilter === 'all' ||
                (activeTaskFilter === 'active' && !task.completed) ||
                (activeTaskFilter === 'completed' && task.completed);

            const query = activeSearchQuery;
            const matchesSearch = !query ||
                (task.title && task.title.toLowerCase().includes(query)) ||
                (task.description && task.description.toLowerCase().includes(query)) ||
                (task.date && task.date.toLowerCase().includes(query));

            return matchesStatus && matchesSearch;
        });

        tasksListContainer.textContent = '';

        if (filtered.length === 0) {
            const emptyTask = document.createElement('div');
            emptyTask.className = 'task-item';
            emptyTask.style.textAlign = 'center';
            emptyTask.style.padding = '2rem';
            emptyTask.style.justifyContent = 'center';
            
            const emptyP = document.createElement('p');
            emptyP.style.color = 'var(--text-muted)';
            emptyP.style.margin = '0';
            emptyP.textContent = t.no_tasks_empty;
            
            emptyTask.appendChild(emptyP);
            tasksListContainer.appendChild(emptyTask);
            return;
        }

        filtered.forEach((task) => {
            const taskId = task.id || ('tsk_' + Math.random().toString(36).slice(2, 8));
            task.id = taskId;

            const taskCard = document.createElement('div');
            taskCard.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskCard.dataset.id = taskId;

            const mainFlex = document.createElement('div');
            mainFlex.style.display = 'flex';
            mainFlex.style.alignItems = 'center';
            mainFlex.style.gap = '1rem';
            mainFlex.style.width = '100%';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.dataset.id = taskId;
            checkbox.checked = Boolean(task.completed);
            mainFlex.appendChild(checkbox);

            const contentDiv = document.createElement('div');
            contentDiv.style.flex = '1';

            const titleEl = document.createElement('h3');
            titleEl.style.margin = '0 0 0.35rem 0';
            if (task.completed) {
                titleEl.style.textDecoration = 'line-through';
                titleEl.style.opacity = '0.6';
            }
            titleEl.textContent = task.title || '';
            contentDiv.appendChild(titleEl);

            const descEl = document.createElement('p');
            descEl.style.margin = '0 0 0.35rem 0';
            descEl.style.fontSize = '0.85rem';
            descEl.textContent = task.description || t.no_desc;
            contentDiv.appendChild(descEl);

            const dueSpan = document.createElement('span');
            dueSpan.style.fontSize = '0.75rem';
            dueSpan.style.color = 'var(--primary)';
            dueSpan.style.fontWeight = '600';
            dueSpan.textContent = `${t.due_label}${task.date || t.no_date_set}`;
            contentDiv.appendChild(dueSpan);

            mainFlex.appendChild(contentDiv);
            taskCard.appendChild(mainFlex);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'card-actions';
            actionsDiv.style.marginTop = '0';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.dataset.action = 'edit-task';
            editBtn.dataset.id = taskId;
            editBtn.textContent = t.btn_edit;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.dataset.action = 'delete-task';
            deleteBtn.dataset.id = taskId;
            deleteBtn.textContent = t.btn_delete;

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            taskCard.appendChild(actionsDiv);

            tasksListContainer.appendChild(taskCard);
        });
    }

    // CRUD Event Listeners
    if (classesListContainer && tasksListContainer) {
        tasksListContainer.addEventListener('change', (e) => {
            const chk = e.target.closest('.task-checkbox');
            if (chk) {
                const targetId = chk.dataset.id;
                const currentTasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
                const task = currentTasks.find(t => t && t.id === targetId);
                if (task) {
                    task.completed = chk.checked;
                    localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                    renderTasksList();
                    updateProgressMetrics();
                    renderNotifications();
                    updateDashboardCounters();
                }
            }
        });

        // Edit/Delete Classes
        classesListContainer.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            const targetId = target.dataset.id;
            const currentClasses = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
            const t = translations[currentLang];
            const item = currentClasses.find(c => c && c.id === targetId);

            if (target.dataset.action === 'delete-class') {
                const updatedClasses = currentClasses.filter(c => c && c.id !== targetId);
                localStorage.setItem('obsidianClasses', JSON.stringify(updatedClasses));
                renderClassesList();
                updateProgressMetrics();
                renderNotifications();
                updateDashboardCounters();
                showToast(t.toast_class_deleted);
            } else if (target.dataset.action === 'edit-class' && item) {
                const card = target.closest('.card');
                card.textContent = '';

                const formContainer = document.createElement('div');
                formContainer.style.display = 'flex';
                formContainer.style.flexDirection = 'column';
                formContainer.style.gap = '0.5rem';
                formContainer.style.width = '100%';

                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.id = `edit-class-title-${targetId}`;
                titleInput.value = item.title || '';
                titleInput.className = 'class-input';
                titleInput.style.padding = '0.4rem';
                titleInput.placeholder = t.label_class_title;

                const codeInput = document.createElement('input');
                codeInput.type = 'text';
                codeInput.id = `edit-class-code-${targetId}`;
                codeInput.value = item.code || '';
                codeInput.className = 'class-input';
                codeInput.style.padding = '0.4rem';
                codeInput.placeholder = t.label_class_code;

                const instructorInput = document.createElement('input');
                instructorInput.type = 'text';
                instructorInput.id = `edit-class-instructor-${targetId}`;
                instructorInput.value = item.instructor || '';
                instructorInput.className = 'class-input';
                instructorInput.style.padding = '0.4rem';
                instructorInput.placeholder = t.label_class_instructor;

                const dateInput = document.createElement('input');
                dateInput.type = 'text';
                dateInput.id = `edit-class-date-${targetId}`;
                dateInput.value = item.date || '';
                dateInput.className = 'class-input';
                dateInput.style.padding = '0.4rem';
                dateInput.placeholder = 'Day, HH:MM - HH:MM';

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'card-actions';

                const saveBtn = document.createElement('button');
                saveBtn.className = 'edit-btn';
                saveBtn.dataset.action = 'save-class';
                saveBtn.dataset.id = targetId;
                saveBtn.textContent = t.btn_save;

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'delete-btn';
                cancelBtn.dataset.action = 'cancel-class';
                cancelBtn.dataset.id = targetId;
                cancelBtn.textContent = t.btn_cancel;

                actionsDiv.appendChild(saveBtn);
                actionsDiv.appendChild(cancelBtn);

                formContainer.appendChild(titleInput);
                formContainer.appendChild(codeInput);
                formContainer.appendChild(instructorInput);
                formContainer.appendChild(dateInput);
                formContainer.appendChild(actionsDiv);

                card.appendChild(formContainer);
            } else if (target.dataset.action === 'save-class' && item) {
                const titleInput = document.getElementById(`edit-class-title-${targetId}`);
                const codeInput = document.getElementById(`edit-class-code-${targetId}`);
                const instructorInput = document.getElementById(`edit-class-instructor-${targetId}`);
                const dateInput = document.getElementById(`edit-class-date-${targetId}`);

                const titleVal = titleInput ? titleInput.value.trim().slice(0, 250) : '';
                const codeVal = codeInput ? codeInput.value.trim().slice(0, 100) : '';
                const instructorVal = instructorInput ? instructorInput.value.trim().slice(0, 250) : '';
                const dateVal = dateInput ? dateInput.value.trim().slice(0, 250) : '';

                if (!titleVal) {
                    showToast(t.toast_title_req, true);
                    return;
                }

                item.title = titleVal;
                item.code = codeVal;
                item.instructor = instructorVal;
                item.date = dateVal;

                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                renderNotifications();
                updateDashboardCounters();
                showToast(t.toast_class_updated);
            } else if (target.dataset.action === 'cancel-class') {
                renderClassesList();
            }
        });

        // Edit/Delete Tasks
        tasksListContainer.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            const targetId = target.dataset.id;
            const currentTasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
            const t = translations[currentLang];
            const item = currentTasks.find(t => t && t.id === targetId);

            if (target.dataset.action === 'delete-task') {
                const updatedTasks = currentTasks.filter(t => t && t.id !== targetId);
                localStorage.setItem('obsidianTasks', JSON.stringify(updatedTasks));
                renderTasksList();
                updateProgressMetrics();
                renderNotifications();
                updateDashboardCounters();
                showToast(t.toast_task_deleted);
            } else if (target.dataset.action === 'edit-task' && item) {
                const taskCard = target.closest('.task-item');
                taskCard.textContent = '';

                const formContainer = document.createElement('div');
                formContainer.style.display = 'flex';
                formContainer.style.flexDirection = 'column';
                formContainer.style.gap = '0.5rem';
                formContainer.style.width = '100%';

                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.id = `edit-task-title-${targetId}`;
                titleInput.value = item.title || '';
                titleInput.className = 'class-input';
                titleInput.style.padding = '0.4rem';
                titleInput.placeholder = t.label_task_title;

                const descInput = document.createElement('textarea');
                descInput.id = `edit-task-desc-${targetId}`;
                descInput.value = item.description || '';
                descInput.className = 'contact-textarea';
                descInput.style.padding = '0.4rem';
                descInput.style.height = '60px';
                descInput.placeholder = t.label_task_desc;

                const dateInput = document.createElement('input');
                dateInput.type = 'text';
                dateInput.id = `edit-task-date-${targetId}`;
                dateInput.value = item.date || '';
                dateInput.className = 'class-input';
                dateInput.style.padding = '0.4rem';
                dateInput.placeholder = 'Day, HH:MM';

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'card-actions';

                const saveBtn = document.createElement('button');
                saveBtn.className = 'edit-btn';
                saveBtn.dataset.action = 'save-task';
                saveBtn.dataset.id = targetId;
                saveBtn.textContent = t.btn_save;

                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'delete-btn';
                cancelBtn.dataset.action = 'cancel-task';
                cancelBtn.dataset.id = targetId;
                cancelBtn.textContent = t.btn_cancel;

                actionsDiv.appendChild(saveBtn);
                actionsDiv.appendChild(cancelBtn);

                formContainer.appendChild(titleInput);
                formContainer.appendChild(descInput);
                formContainer.appendChild(dateInput);
                formContainer.appendChild(actionsDiv);

                taskCard.appendChild(formContainer);
            } else if (target.dataset.action === 'save-task' && item) {
                const titleInput = document.getElementById(`edit-task-title-${targetId}`);
                const descInput = document.getElementById(`edit-task-desc-${targetId}`);
                const dateInput = document.getElementById(`edit-task-date-${targetId}`);

                const titleVal = titleInput ? titleInput.value.trim().slice(0, 250) : '';
                const descVal = descInput ? descInput.value.trim().slice(0, 1000) : '';
                const dateVal = dateInput ? dateInput.value.trim().slice(0, 250) : '';

                if (!titleVal) {
                    showToast(t.toast_task_title_req, true);
                    return;
                }

                item.title = titleVal;
                item.description = descVal;
                item.date = dateVal;

                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                renderNotifications();
                updateDashboardCounters();
                showToast(t.toast_task_updated);
            } else if (target.dataset.action === 'cancel-task') {
                renderTasksList();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 11. Add Class & Task Form Handlers
    // --------------------------------------------------------------------------
    const tabCourseBtn = document.getElementById('tab-course-btn');
    const tabTaskBtn = document.getElementById('tab-task-btn');
    const addCourseForm = document.getElementById('add-course-form');
    const addTaskForm = document.getElementById('add-task-form');

    if (tabCourseBtn && tabTaskBtn && addCourseForm && addTaskForm) {
        tabCourseBtn.addEventListener('click', () => {
            tabCourseBtn.classList.add('active');
            tabTaskBtn.classList.remove('active');
            addCourseForm.style.display = 'block';
            addTaskForm.style.display = 'none';
        });

        tabTaskBtn.addEventListener('click', () => {
            tabTaskBtn.classList.add('active');
            tabCourseBtn.classList.remove('active');
            addTaskForm.style.display = 'block';
            addCourseForm.style.display = 'none';
        });

        // Add Course submit
        addCourseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = document.getElementById('course-name').value.trim().slice(0, 250);
            const code = document.getElementById('course-code').value.trim().slice(0, 100);
            const day = document.getElementById('course-day').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;
            const instructor = document.getElementById('instructor').value.trim().slice(0, 250);

            if (!title) {
                showToast(t.toast_title_req, true);
                return;
            }
            if (!startTime || !endTime) {
                showToast(t.toast_time_req, true);
                return;
            }

            const newClass = {
                id: generateUniqueId('cls'),
                title,
                code,
                instructor,
                date: `${day.slice(0, 3)}, ${startTime} - ${endTime}`
            };

            const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
            classes.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));

            showToast(t.toast_class_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 800);
        });

        // Add Task submit
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = document.getElementById('task-name').value.trim().slice(0, 250);
            const day = document.getElementById('task-day').value;
            const time = document.getElementById('task-time').value;
            const description = document.getElementById('task-desc').value.trim().slice(0, 1000);

            if (!title) {
                showToast(t.toast_task_title_req, true);
                return;
            }

            const newTask = {
                id: generateUniqueId('tsk'),
                title,
                description,
                date: `${day.slice(0, 3)}, ${time || '23:59'}`,
                completed: false
            };

            const tasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
            tasks.push(newTask);
            localStorage.setItem('obsidianTasks', JSON.stringify(tasks));

            showToast(t.toast_task_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 800);
        });
    }

    // Custom Time Picker Synchronizer
    function setupCustomTimePickers() {
        const pairs = [
            { hour: 'class-start-hour', min: 'class-start-min', target: 'class-start-time' },
            { hour: 'class-end-hour', min: 'class-end-min', target: 'class-end-time' },
            { hour: 'task-due-hour', min: 'task-due-min', target: 'task-due-time' },
            { hour: 'task-hour', min: 'task-min', target: 'task-time' }
        ];

        pairs.forEach(({ hour, min, target }) => {
            const hEl = document.getElementById(hour);
            const mEl = document.getElementById(min);
            const tEl = document.getElementById(target);

            if (hEl && mEl && tEl) {
                const updateTarget = () => {
                    tEl.value = `${hEl.value}:${mEl.value}`;
                };
                hEl.addEventListener('change', updateTarget);
                mEl.addEventListener('change', updateTarget);
                updateTarget();
            }
        });
    }
    setupCustomTimePickers();

    // Standalone Add Class / Task Page Support
    const addClassBtn = document.getElementById('add-class-btn');
    const discardClassBtn = document.getElementById('discard-class-btn') || document.getElementById('discard-btn');
    const classTitleInput = document.getElementById('class-title') || document.getElementById('class-name');
    const classCodeInput = document.getElementById('class-code');
    const classInstructorInput = document.getElementById('class-instructor');
    const classDaySelect = document.getElementById('class-day-select') || document.getElementById('class-day');
    const classStartTimeInput = document.getElementById('class-start-time') || document.getElementById('start-time');
    const classEndTimeInput = document.getElementById('class-end-time') || document.getElementById('end-time');

    if (addClassBtn && classTitleInput) {
        addClassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = classTitleInput.value.trim().slice(0, 250);
            const code = classCodeInput ? classCodeInput.value.trim().slice(0, 100) : '';
            const instructor = classInstructorInput ? classInstructorInput.value.trim().slice(0, 250) : '';
            const day = classDaySelect ? classDaySelect.value : 'Monday';
            const startTime = classStartTimeInput ? classStartTimeInput.value : '';
            const endTime = classEndTimeInput ? classEndTimeInput.value : '';

            if (!title) {
                showToast(t.toast_title_req, true);
                return;
            }
            if (!startTime || !endTime) {
                showToast(t.toast_time_req, true);
                return;
            }

            const newClass = {
                id: generateUniqueId('cls'),
                title,
                code,
                instructor,
                date: `${day.slice(0, 3)}, ${startTime} - ${endTime}`
            };

            const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
            classes.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));

            showToast(t.toast_class_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 800);
        });

        if (discardClassBtn) {
            discardClassBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'classes.html';
            });
        }
    }

    const addTaskDirectBtn = document.getElementById('add-task-btn');
    const discardTaskDirectBtn = document.getElementById('discard-task-btn');
    const taskTitleDirect = document.getElementById('task-title') || document.getElementById('task-name');
    const taskDayDirect = document.getElementById('task-day-select') || document.getElementById('task-day');
    const taskTimeDirect = document.getElementById('task-due-time') || document.getElementById('task-time');
    const taskDescDirect = document.getElementById('task-description') || document.getElementById('task-desc');

    if (addTaskDirectBtn && taskTitleDirect) {
        addTaskDirectBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = taskTitleDirect.value.trim().slice(0, 250);
            const day = taskDayDirect ? taskDayDirect.value : 'Monday';
            const time = taskTimeDirect ? taskTimeDirect.value : '23:59';
            const description = taskDescDirect ? taskDescDirect.value.trim().slice(0, 1000) : '';

            if (!title) {
                showToast(t.toast_task_title_req, true);
                return;
            }

            const newTask = {
                id: generateUniqueId('tsk'),
                title,
                description,
                date: `${day.slice(0, 3)}, ${time || '23:59'}`,
                completed: false
            };

            const tasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
            tasks.push(newTask);
            localStorage.setItem('obsidianTasks', JSON.stringify(tasks));

            showToast(t.toast_task_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 800);
        });

        if (discardTaskDirectBtn) {
            discardTaskDirectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'classes.html';
            });
        }
    }

    // --------------------------------------------------------------------------
    // 12. Notification Bell System
    // --------------------------------------------------------------------------
    const bellBtn = document.getElementById('bell-btn');
    const bellBadge = document.getElementById('bell-badge');
    const notifDropdown = document.getElementById('notification-dropdown');
    const notifList = document.getElementById('notif-list');
    const notifClearBtn = document.getElementById('notif-clear-btn');

    function renderNotifications() {
        if (!notifList) return;
        const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
        const tasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
        const now = getCurrentTimeSnapshot();
        const t = translations[currentLang];

        const alerts = [];
        const alertIdList = [];

        // 1. Classes today
        classes.filter(Boolean).forEach(c => {
            const parsed = parseClassTime(c.date);
            if (parsed.day === now.dayAbbreviation) {
                const id = `class_${c.title}_${parsed.day}_${parsed.startTime}`;
                alertIdList.push(id);
                alerts.push({
                    id,
                    type: 'class',
                    title: `${c.title} (${parsed.startTime} - ${parsed.endTime})`,
                    sub: c.instructor ? `${t.instructor_label}${c.instructor}` : `Lecture Scheduled Today`
                });
            }
        });

        // 2. Pending Tasks
        tasks.filter(t => t && !t.completed).forEach(tk => {
            const taskDay = normalizeDay(tk.date);
            const isToday = taskDay === now.dayAbbreviation;
            const id = `task_${tk.title}_${tk.date}`;
            alertIdList.push(id);
            alerts.push({
                id,
                type: 'task',
                urgent: isToday,
                title: `${tk.title}`,
                sub: `${t.due_label}${tk.date || t.no_date_set}`
            });
        });

        notifList.textContent = '';

        const dismissedHash = localStorage.getItem('obsidian_notifs_dismissed_hash');
        const currentAlertsHash = alertIdList.sort().join('|');

        if (dismissedHash === currentAlertsHash && alerts.length > 0) {
            if (bellBadge) bellBadge.classList.add('hidden');
            const emptyP = document.createElement('p');
            emptyP.className = 'notif-empty';
            emptyP.textContent = t.notif_empty;
            notifList.appendChild(emptyP);
            return;
        }

        if (bellBadge) {
            if (alerts.length > 0) {
                bellBadge.textContent = alerts.length;
                bellBadge.classList.remove('hidden');
            } else {
                bellBadge.classList.add('hidden');
            }
        }

        if (alerts.length === 0) {
            const emptyP = document.createElement('p');
            emptyP.className = 'notif-empty';
            emptyP.textContent = t.notif_empty;
            notifList.appendChild(emptyP);
            return;
        }

        alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = `notif-item ${alert.type === 'class' ? 'class-item' : ''} ${alert.urgent ? 'urgent' : ''}`;
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'notif-title';
            titleSpan.textContent = alert.title;
            
            const subSpan = document.createElement('span');
            subSpan.className = 'notif-sub';
            subSpan.textContent = alert.sub;
            
            item.appendChild(titleSpan);
            item.appendChild(subSpan);
            notifList.appendChild(item);
        });
    }

    if (bellBtn && notifDropdown) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !bellBtn.contains(e.target)) {
                notifDropdown.classList.remove('open');
            }
        });

        if (notifClearBtn) {
            notifClearBtn.addEventListener('click', () => {
                const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
                const tasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
                const now = getCurrentTimeSnapshot();
                const alertIdList = [];

                classes.filter(Boolean).forEach(c => {
                    const parsed = parseClassTime(c.date);
                    if (parsed.day === now.dayAbbreviation) {
                        alertIdList.push(`class_${c.title}_${parsed.day}_${parsed.startTime}`);
                    }
                });
                tasks.filter(t => t && !t.completed).forEach(tk => {
                    alertIdList.push(`task_${tk.title}_${tk.date}`);
                });

                localStorage.setItem('obsidian_notifs_dismissed_hash', alertIdList.sort().join('|'));

                if (bellBadge) bellBadge.classList.add('hidden');
                notifList.innerHTML = `<p class="notif-empty">${escapeHTML(translations[currentLang].notif_empty)}</p>`;
            });
        }
    }

    // --------------------------------------------------------------------------
    // 13. Operator Profile Customization Modal & Custom Avatar Upload
    // --------------------------------------------------------------------------
    const profilePicBtn = document.getElementById('profile-pic-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileModalClose = document.getElementById('profile-modal-close');
    const profileCancelBtn = document.getElementById('profile-cancel-btn');
    const profileForm = document.getElementById('profile-form');
    const operatorNameInput = document.getElementById('operator-name-input');
    const customAvatarOpt = document.getElementById('custom-avatar-opt');
    const customAvatarPreviewImg = document.getElementById('custom-avatar-preview-img');
    const customAvatarInput = document.getElementById('custom-avatar-input');
    const btnTriggerUpload = document.getElementById('btn-trigger-upload');
    const avatarDropZone = document.getElementById('avatar-drop-zone');

    let selectedAvatar = sanitizeAvatarUrl(localStorage.getItem('obsidian_avatar') || 'photos/avatar.png');

    function syncAvatarSelectionUI() {
        const isCustom = selectedAvatar.startsWith('data:') || (selectedAvatar.startsWith('http') && !selectedAvatar.includes('photos/'));
        if (isCustom && customAvatarOpt && customAvatarPreviewImg) {
            customAvatarOpt.style.display = 'block';
            customAvatarOpt.dataset.avatar = selectedAvatar;
            customAvatarPreviewImg.src = selectedAvatar;
        }

        const allOpts = document.querySelectorAll('.avatar-opt');
        allOpts.forEach(opt => {
            if (opt.dataset.avatar === selectedAvatar) {
                opt.classList.add('selected');
            } else {
                opt.classList.remove('selected');
            }
        });
    }

    if (profilePicBtn && profileModal) {
        profilePicBtn.addEventListener('click', () => {
            if (operatorNameInput) {
                operatorNameInput.value = localStorage.getItem('obsidian_operator_name') || 'Architect';
            }
            selectedAvatar = sanitizeAvatarUrl(localStorage.getItem('obsidian_avatar') || 'photos/avatar.png');
            syncAvatarSelectionUI();
            profileModal.classList.add('open');
        });

        function closeProfileModal() {
            profileModal.classList.remove('open');
        }

        if (profileModalClose) profileModalClose.addEventListener('click', closeProfileModal);
        if (profileCancelBtn) profileCancelBtn.addEventListener('click', closeProfileModal);

        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) closeProfileModal();
        });

        const allOpts = document.querySelectorAll('.avatar-opt');
        allOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                const currentOpts = document.querySelectorAll('.avatar-opt');
                currentOpts.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedAvatar = sanitizeAvatarUrl(opt.dataset.avatar);
            });
        });

        if (btnTriggerUpload && customAvatarInput) {
            btnTriggerUpload.addEventListener('click', (e) => {
                e.stopPropagation();
                customAvatarInput.click();
            });
        }
        if (avatarDropZone && customAvatarInput) {
            avatarDropZone.addEventListener('click', (e) => {
                if (e.target !== btnTriggerUpload && !btnTriggerUpload.contains(e.target)) {
                    customAvatarInput.click();
                }
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                avatarDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    avatarDropZone.classList.add('dragover');
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                avatarDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    avatarDropZone.classList.remove('dragover');
                }, false);
            });

            avatarDropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files && files[0]) {
                    handleAvatarFileUpload(files[0]);
                }
            });
        }

        if (customAvatarInput) {
            customAvatarInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleAvatarFileUpload(e.target.files[0]);
                }
            });
        }

        function handleAvatarFileUpload(file) {
            const t = translations[currentLang];
            if (!file.type.startsWith('image/')) {
                showToast(t.toast_photo_too_large || 'Please select an image file', true);
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast(t.toast_photo_too_large, true);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxDim = 256;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxDim) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
                    selectedAvatar = sanitizeAvatarUrl(compressedDataUrl);

                    if (customAvatarOpt && customAvatarPreviewImg) {
                        customAvatarOpt.style.display = 'block';
                        customAvatarOpt.dataset.avatar = selectedAvatar;
                        customAvatarPreviewImg.src = selectedAvatar;
                    }

                    syncAvatarSelectionUI();
                    showToast(t.toast_photo_loaded);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newName = (operatorNameInput ? operatorNameInput.value.trim().slice(0, 60) : '') || 'Architect';
                localStorage.setItem('obsidian_operator_name', newName);
                localStorage.setItem('obsidian_avatar', selectedAvatar);

                updateAvatarImages();
                updateOperatorGreeting();
                closeProfileModal();
                showToast(translations[currentLang].toast_profile_saved);
            });
        }
    }

    // --------------------------------------------------------------------------
    // 14. Data Backup / Restore Engine (TASK 3: Strict Schema & File Bounds)
    // --------------------------------------------------------------------------
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataFile = document.getElementById('import-data-file');
    const MAX_IMPORT_SIZE_BYTES = 2 * 1024 * 1024; // Strict 2MB ceiling

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const classes = safeJSONParse(localStorage.getItem('obsidianClasses'), []);
            const tasks = safeJSONParse(localStorage.getItem('obsidianTasks'), []);
            const operatorName = localStorage.getItem('obsidian_operator_name') || 'Architect';

            const payload = {
                system: "Obsidian Architect Terminal",
                version: "2026.1",
                exportedAt: new Date().toISOString(),
                operatorName,
                classes,
                tasks
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `obsidian-terminal-backup-${new Date().toISOString().slice(0,10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();

            showToast(translations[currentLang].toast_export_ok);
        });
    }

    if (importDataFile) {
        importDataFile.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            // 1. File Size Boundary Check
            if (file.size > MAX_IMPORT_SIZE_BYTES) {
                showToast("Backup file exceeds 2MB maximum limit.", true);
                importDataFile.value = '';
                return;
            }

            // 2. MIME & Extension Check
            if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json' && file.type !== '') {
                showToast("Invalid file type. Only JSON backup files are permitted.", true);
                importDataFile.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const rawContent = event.target.result;
                    if (typeof rawContent !== 'string' || rawContent.length > MAX_IMPORT_SIZE_BYTES) {
                        throw new Error("Payload size limit exceeded");
                    }

                    const parsed = safeJSONParse(rawContent, null);
                    const validation = validateBackupSchema(parsed);

                    if (!validation.valid || !validation.sanitized) {
                        throw new Error(validation.error || "Schema validation failed");
                    }

                    const { classes, tasks, operatorName } = validation.sanitized;

                    // Write validated & bounded data
                    localStorage.setItem('obsidianClasses', JSON.stringify(classes));
                    localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
                    if (operatorName) {
                        localStorage.setItem('obsidian_operator_name', operatorName);
                    }

                    refreshAllViews();
                    showToast(translations[currentLang].toast_import_ok);
                } catch (err) {
                    console.error("Backup import error:", err);
                    showToast(translations[currentLang].toast_import_err, true);
                } finally {
                    importDataFile.value = '';
                }
            };

            reader.onerror = () => {
                showToast("Failed to read file from disk.", true);
                importDataFile.value = '';
            };

            reader.readAsText(file);
        });
    }

    // --------------------------------------------------------------------------
    // 15. FAQ View Switching & Hardened Transmission Portal (TASK 1)
    // --------------------------------------------------------------------------
    const faqList = document.getElementById('faq-list');
    const faqDetail = document.getElementById('faq-detail');
    const faqBackBtn = document.getElementById('faq-back-btn');
    const faqQuestionDisplay = document.getElementById('faq-detail-question');
    const faqAnswerDisplay = document.getElementById('faq-detail-answer');

    if (faqList && faqDetail) {
        faqList.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-button');
            if (!btn) return;
            const id = btn.dataset.faq;
            if (faqDatabase[currentLang] && faqDatabase[currentLang][id]) {
                faqQuestionDisplay.textContent = faqDatabase[currentLang][id].question;
                faqAnswerDisplay.textContent = faqDatabase[currentLang][id].answer;
                faqList.style.display = 'none';
                faqDetail.style.display = 'block';
            }
        });

        if (faqBackBtn) {
            faqBackBtn.addEventListener('click', () => {
                faqDetail.style.display = 'none';
                faqList.style.display = 'block';
            });
        }
    }

    // Hardened Contact Form Transmission with Turnstile Token
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const subjectInput = document.getElementById('contact-subject') || document.getElementById('contact-topic');
            const messageInput = document.getElementById('contact-message');
            const submitBtn = document.getElementById('contact-submit-btn');
            const errorMsg = document.getElementById('contact-error-message');

            const name = nameInput ? nameInput.value.trim().slice(0, 60) : '';
            const email = emailInput ? emailInput.value.trim().slice(0, 100) : '';
            const subject = subjectInput ? subjectInput.value.trim().slice(0, 120) : 'General Inquiry';
            const message = messageInput ? messageInput.value.trim().slice(0, 1500) : '';

            // Extract Cloudflare Turnstile token from hidden form input if present
            const turnstileInput = contactForm.querySelector('[name="cf-turnstile-response"]') || 
                                   document.querySelector('[name="cf-turnstile-response"]');
            const turnstileToken = turnstileInput ? turnstileInput.value : '';

            if (!name || !email || !message) {
                if (errorMsg) errorMsg.textContent = t.toast_contact_req;
                showToast(t.toast_contact_req, true);
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = t.btn_transmitting;
            }

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message, turnstileToken })
                });

                const resData = await response.json().catch(() => ({}));

                if (response.ok) {
                    showToast(t.toast_discord_ok);
                    contactForm.reset();
                    if (window.turnstile && typeof window.turnstile.reset === 'function') {
                        window.turnstile.reset();
                    }
                    if (errorMsg) errorMsg.textContent = "";
                } else {
                    const errMsg = resData.error || t.toast_discord_err;
                    if (errorMsg) errorMsg.textContent = errMsg;
                    showToast(errMsg, true);
                    if (window.turnstile && typeof window.turnstile.reset === 'function') {
                        window.turnstile.reset();
                    }
                }
            } catch (err) {
                showToast(t.toast_discord_net_err);
                contactForm.reset();
                if (window.turnstile && typeof window.turnstile.reset === 'function') {
                    window.turnstile.reset();
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = t.btn_transmit;
                }
            }
        });
    }

    // "View All" Navigation Button
    const viewAllTasksBtn = document.getElementById('view-all-tasks');
    if (viewAllTasksBtn) {
        viewAllTasksBtn.addEventListener('click', () => {
            window.location.href = 'classes.html';
        });
    }

    // Global UI Refresh Dispatcher
    function refreshAllViews() {
        if (typeof renderSchedule === 'function') renderSchedule();
        if (typeof renderPriorityTasks === 'function') renderPriorityTasks();
        if (typeof renderClassesList === 'function') renderClassesList();
        if (typeof renderTasksList === 'function') renderTasksList();
        if (typeof updateProgressMetrics === 'function') updateProgressMetrics();
        if (typeof renderNotifications === 'function') renderNotifications();
        if (typeof updateDashboardCounters === 'function') updateDashboardCounters();
        if (typeof updateLiveCountdown === 'function') updateLiveCountdown();
        if (typeof updateOperatorGreeting === 'function') updateOperatorGreeting();
        if (typeof updateAvatarImages === 'function') updateAvatarImages();
    }
    window.ObsidianUI = {
        refreshUI: refreshAllViews
    };

    // Initial Engine Bootstrap
    setLanguage(currentLang);
    updateAvatarImages();
    updateOperatorGreeting();
    refreshAllViews();
});
