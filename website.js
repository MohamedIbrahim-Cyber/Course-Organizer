if (!window.ObsidianAuth) {
    window.ObsidianAuth = {
        currentUser: null,
        isCloudSynced: false,
        syncStatus: 'guest',
        _waitForRealAuth() {
            return new Promise((resolve, reject) => {
                if (window.ObsidianAuth._isReal) return resolve(window.ObsidianAuth);
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    if (window.ObsidianAuth._isReal) {
                        clearInterval(interval);
                        resolve(window.ObsidianAuth);
                    } else if (attempts > 100) { // 10 seconds
                        clearInterval(interval);
                        reject(new Error("Authentication module is taking longer than expected to load. Please check your network connection and try again."));
                    }
                }, 100);
            });
        },
        async signInWithGoogle(...args) {
            const real = await this._waitForRealAuth();
            return real.signInWithGoogle(...args);
        },
        async signInWithGoogleRedirect(...args) {
            const real = await this._waitForRealAuth();
            return real.signInWithGoogleRedirect(...args);
        },
        async loginWithGoogle(...args) {
            const real = await this._waitForRealAuth();
            return real.loginWithGoogle(...args);
        },
        async loginWithGoogleRedirect(...args) {
            const real = await this._waitForRealAuth();
            return real.loginWithGoogleRedirect(...args);
        },
        async signInWithEmail(email, password) {
            const real = await this._waitForRealAuth();
            return real.signInWithEmail(email, password);
        },
        async signUpWithEmail(email, password) {
            const real = await this._waitForRealAuth();
            return real.signUpWithEmail(email, password);
        },
        async sendMagicLink(email) {
            const real = await this._waitForRealAuth();
            return real.sendMagicLink(email);
        },
        async signOut() {
            const real = await this._waitForRealAuth();
            return real.signOut();
        },
        async logout() {
            const real = await this._waitForRealAuth();
            return real.logout();
        },
        getActiveConfig() { return { projectId: '' }; },
        saveCustomConfig() {},
        resetToDefaultConfig() {},
        async addClass(c) { return 'cls_local'; },
        async updateClass() {},
        async deleteClass() {},
        async addTask(t) { return 'tsk_local'; },
        async updateTask() {},
        async deleteTask() {},
        async saveUserProfile() {}
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Core Translation Dictionary (English & Arabic)
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
            toast_contact_req: "All fields are required.",
            toast_discord_ok: "Transmission beamed to Discord channel!",
            toast_discord_err: "Discord transmission error.",
            toast_discord_net_err: "Transmission relayed locally.",
            
            // New feature translations
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
            toast_import_err: "Invalid backup JSON file format.",
            live_status_in_session: "● IN SESSION:",
            live_status_upcoming: "⏱ NEXT NODE:",
            live_status_concluded: "✓ ALL NODES CONCLUDED FOR TODAY",
            live_status_none: "○ NO LECTURES SCHEDULED TODAY",
            btn_signin_cloud: "Sign In / Sync",
            btn_account: "Account",
            auth_modal_title: "Cloud Synchronization & Account",
            auth_sync_feature_title: "Cloud Synchronization",
            auth_modal_desc: "Sign in with your Google account to sync all your classes, task objectives, schedules, and custom preferences securely in real time across all devices.",
            btn_google_signin: "Continue with Google",
            btn_google_redirect: "Having trouble with popup? Sign in with Page Redirect",
            btn_signout: "Sign Out of Terminal",
            status_synced: "Synced",
            status_guest: "Guest (Offline)",
            auth_sync_desc: "Your classes and task objectives are synchronized in real-time across all your devices.",
            toast_auth_signin_ok: "Terminal authenticated. Cloud synchronization active.",
            toast_auth_signout_ok: "Signed out of terminal.",
            toast_auth_error: "Authentication error. Please try again.",
            toast_session_timeout: "Session timed out due to inactivity. Terminal locked safely.",
            toast_auth_popup_closed: "Sign-in popup was closed. Please try again or use the Page Redirect option.",
            toast_auth_popup_blocked: "Sign-in popup was blocked by browser. Please allow popups or use Page Redirect.",
            toast_auth_unauthorized_domain: "Domain not authorized. Add your Vercel/GitHub domain in Firebase Console > Authentication > Settings > Authorized domains.",
            toast_auth_op_not_allowed: "Google sign-in is disabled in Firebase Console > Authentication > Sign-in method.",
            auth_domain_guide_title: "Hosting on Vercel or GitHub Pages?",
            auth_domain_guide_desc: "Authorize this domain in Firebase Console to enable Google Sign-In:",
            btn_copy: "Copy Domain",
            btn_copied: "Copied!",
            auth_domain_step_1: "1. Go to Firebase Console > Authentication > Settings > Authorized domains",
            auth_domain_step_2: "2. Click 'Add domain' and paste your domain copied above.",
            btn_custom_firebase: "Configure Custom Firebase Project (Optional)",
            label_custom_firebase_json: "Paste your custom firebaseConfig JSON:",
            btn_reset_default: "Reset Default",
            btn_save_config: "Save & Reload",
            toast_config_saved: "Custom Firebase config saved! Reloading...",
            toast_config_reset: "Reset to default Firebase configuration.",
            toast_config_invalid: "Invalid JSON. Please provide a valid Firebase config object.",
            toast_domain_copied: "Domain copied to clipboard!"
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
            toast_contact_req: "جميع الحقول مطلوبة لإتمام الإرسال.",
            toast_discord_ok: "تم إرسال الرسالة بنجاح عبر Discord!",
            toast_discord_err: "حدث خطأ أثناء الإرسال.",
            toast_discord_net_err: "تم تسجيل الرسالة محليًا بنجاح.",
            
            // New feature translations (Arabic)
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
            toast_import_err: "ملف النسخة الاحتياطية غير صالح.",
            live_status_in_session: "● قيد الانعقاد:",
            live_status_upcoming: "⏱ المحاضرة القادمة:",
            live_status_concluded: "✓ انتهت جميع محاضرات اليوم",
            live_status_none: "○ لا توجد محاضرات مجدولة لليوم",
            btn_signin_cloud: "تسجيل الدخول / المزامنة",
            btn_account: "حسابي",
            auth_modal_title: "المزامنة السحابية والحساب",
            auth_sync_feature_title: "المزامنة السحابية الفورية",
            auth_modal_desc: "سجل الدخول باستخدام حساب Google لحفظ ومزامنة كافة محاضراتك ومهامك وجداولك وإعداداتك بشكل آمن عبر جميع أجهزتك.",
            btn_google_signin: "المتابعة باستخدام Google",
            btn_google_redirect: "مشكلة في النافذة المنبثقة؟ تسجيل الدخول عبر التحويل المباشر",
            btn_signout: "تسجيل الخروج من المحطة",
            status_synced: "متصل وسحابي",
            status_guest: "وضع الضيف (محلي)",
            auth_sync_desc: "يتم حفظ ومزامنة محاضراتك ومهامك في الوقت الفعلي عبر جميع أجهزتك.",
            toast_auth_signin_ok: "تم تسجيل الدخول بنجاح. المزامنة السحابية نشطة الآن.",
            toast_auth_signout_ok: "تم تسجيل الخروج بنجاح.",
            toast_auth_error: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مجددًا.",
            toast_session_timeout: "انتهت صلاحية الجلسة لعدم النشاط. تم قفل المحطة بأمان.",
            toast_auth_popup_closed: "تم إغلاق نافذة تسجيل الدخول. يرجى المحاولة مرة أخرى أو استخدام خيار التحويل المباشر.",
            toast_auth_popup_blocked: "تم حظر النافذة المنبثقة من قِبل المتصفح. يرجى السماح بالنوافذ المنبثقة أو استخدام خيار التحويل.",
            toast_auth_unauthorized_domain: "النطاق غير مصرح به. أضف نطاق Vercel أو GitHub في Firebase Console > Authentication > Settings > Authorized domains.",
            toast_auth_op_not_allowed: "تسجيل الدخول عبر Google غير مفعل في لوحة Firebase Console.",
            auth_domain_guide_title: "هل تستضيف الموقع على Vercel أو GitHub Pages؟",
            auth_domain_guide_desc: "قم بتفويض هذا النطاق في لوحة Firebase لتفعيل تسجيل الدخول بواسطة Google:",
            btn_copy: "نسخ النطاق",
            btn_copied: "تم النسخ!",
            auth_domain_step_1: "١. توجه إلى Firebase Console > Authentication > Settings > Authorized domains",
            auth_domain_step_2: "٢. انقر على 'Add domain' والصق النطاق المنسوخ أعلاه.",
            btn_custom_firebase: "تخصيص مشروع Firebase مخصص (اختياري)",
            label_custom_firebase_json: "الصق كود إعدادات firebaseConfig JSON الخاص بمشروعك:",
            btn_reset_default: "استعادة الافتراضي",
            btn_save_config: "حفظ وإعادة التحميل",
            toast_config_saved: "تم حفظ الإعدادات المخصصة بنجاح! جاري التحديث...",
            toast_config_reset: "تمت استعادة إعدادات Firebase الافتراضية.",
            toast_config_invalid: "صيغة JSON غير صحيحة. يرجى التحقق من كائن الإعدادات.",
            toast_domain_copied: "تم نسخ النطاق إلى الحافظة بنجاح!"
        }
    };

    const daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const daysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const monthsEn = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const dayAbbreviations = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // --------------------------------------------------------------------------
    // 2. Initial Sample Dataset Bootstrapping (if empty or blank)
    // --------------------------------------------------------------------------
    function initializeDefaultData() {
        const defaultClasses = [];

        const defaultTasks = [
            {
                title: "Kernel Synchronization Lab",
                description: "Implement semaphore lock barriers and solve race conditions in C/Rust.",
                date: "Wed, 23:59",
                completed: false
            },
            {
                title: "Microservices Architecture Essay",
                description: "Submit 5-page case study analyzing event-driven distributed consensus.",
                date: "Fri, 18:00",
                completed: false
            },
            {
                title: "Network Packet Analysis WireGuard",
                description: "Inspect PCAP stream captures and verify cryptographic handshakes.",
                date: "Sat, 20:00",
                completed: true
            }
        ];

        let localClasses = [];
        try {
            const raw = localStorage.getItem('obsidianClasses');
            localClasses = raw ? JSON.parse(raw) : [];
        } catch { localClasses = []; }

        // Filter out old default courses if present
        const oldDefaultTitles = ["Advanced Operating Systems", "Distributed Systems & Cloud", "Cyber Security Protocols"];
        localClasses = localClasses.filter(c => !oldDefaultTitles.includes(c.title));

        if (!Array.isArray(localClasses) || localClasses.length === 0) {
            let backupClasses = [];
            try {
                const bRaw = localStorage.getItem('obsidian_backup_classes');
                if (bRaw) {
                    backupClasses = JSON.parse(bRaw);
                    if (Array.isArray(backupClasses)) {
                        backupClasses = backupClasses.filter(c => !oldDefaultTitles.includes(c.title));
                    }
                }
            } catch { backupClasses = []; }

            const toStore = (Array.isArray(backupClasses) && backupClasses.length > 0) ? backupClasses : defaultClasses;
            localStorage.setItem('obsidianClasses', JSON.stringify(toStore));
            localStorage.setItem('obsidian_backup_classes', JSON.stringify(toStore));
        } else {
            localStorage.setItem('obsidianClasses', JSON.stringify(localClasses));
        }

        let localTasks = [];
        try {
            const raw = localStorage.getItem('obsidianTasks');
            localTasks = raw ? JSON.parse(raw) : [];
        } catch { localTasks = []; }

        if (!Array.isArray(localTasks) || localTasks.length === 0) {
            let backupTasks = [];
            try {
                const bRaw = localStorage.getItem('obsidian_backup_tasks');
                backupTasks = bRaw ? JSON.parse(bRaw) : [];
            } catch { backupTasks = []; }

            const toStore = (Array.isArray(backupTasks) && backupTasks.length > 0) ? backupTasks : defaultTasks;
            localStorage.setItem('obsidianTasks', JSON.stringify(toStore));
            localStorage.setItem('obsidian_backup_tasks', JSON.stringify(toStore));
        }
    }
    initializeDefaultData();

    // --------------------------------------------------------------------------
    // 3. FAQ Database
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
    // 4. Language & Theme Engines
    // --------------------------------------------------------------------------
    let currentLang = localStorage.getItem('obsidian_lang') || 'en';
    const langBtn = document.getElementById('lang-btn');

    function updateOperatorGreeting() {
        const operatorName = localStorage.getItem('obsidian_operator_name') || 'Architect';
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
        const savedAvatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';
        const navAvatars = document.querySelectorAll('.profile-pic img');
        navAvatars.forEach(img => {
            img.src = savedAvatar;
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
                    // Handled specially
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
        toast.textContent = message;
        toast.style.borderColor = isError ? 'var(--accent-alert)' : 'var(--primary)';
        toast.style.color = isError ? 'var(--accent-alert)' : 'var(--text-main)';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    // Defensive Security: HTML Sanitizer for user-provided strings
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // --------------------------------------------------------------------------
    // 5. Time & Date Utility Parsers
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

    function updateAvatarImages() {
        const avatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';
        const avatarImgs = document.querySelectorAll('#nav-avatar-img, .profile-pic img, #auth-user-avatar');
        avatarImgs.forEach(img => {
            img.src = avatar;
        });
    }

    function updateOperatorGreeting() {
        const welcomeHeader = document.getElementById('welcome-header-display');
        if (!welcomeHeader) return;
        const name = localStorage.getItem('obsidian_operator_name') || 'Architect';
        if (currentLang === 'ar') {
            welcomeHeader.textContent = `مرحبًا بعودتك يا ${name}.`;
        } else {
            welcomeHeader.textContent = `Welcome back ${name}.`;
        }
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
    // 6. Dashboard Counters & Live Next-Class Banner
    // --------------------------------------------------------------------------
    function updateDashboardCounters() {
        const todayClassesCounter = document.getElementById('today-classes-counter');
        const todayTasksCounter = document.getElementById('today-tasks-counter');
        const thisWeekTasksCounter = document.getElementById('this-week-tasks-counter');

        const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
        const currentTime = getCurrentTimeSnapshot();

        // 1. Classes Today
        const todayClassesCount = classes.filter(c => {
            const parsed = parseClassTime(c.date);
            return parsed.day === currentTime.dayAbbreviation;
        }).length;

        // 2. Tasks Due Today
        const todayTasksCount = tasks.filter(t => {
            if (t.completed) return false;
            const taskDay = normalizeDay(t.date);
            return taskDay === currentTime.dayAbbreviation;
        }).length;

        // 3. Tasks Due This Active Week (accurate window)
        const activeWeekTasksCount = tasks.filter(t => !t.completed).length;

        if (todayClassesCounter) todayClassesCounter.textContent = todayClassesCount;
        if (todayTasksCounter) todayTasksCounter.textContent = todayTasksCount;
        if (thisWeekTasksCounter) thisWeekTasksCounter.textContent = activeWeekTasksCount;
    }

    function updateLiveCountdown() {
        const banner = document.getElementById('live-countdown-banner');
        const statusText = document.getElementById('live-status-text');
        const timerText = document.getElementById('live-countdown-timer');
        if (!banner || !statusText || !timerText) return;

        const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const now = getCurrentTimeSnapshot();
        const t = translations[currentLang];

        const todayClasses = classes
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

    // Run live countdown clock every 20 seconds
    setInterval(updateLiveCountdown, 20000);

    // --------------------------------------------------------------------------
    // 7. Render Schedule & Priority Tasks (Dashboard)
    // --------------------------------------------------------------------------
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
            .sort((a, b) => a.parsed.startMinutes - b.parsed.startMinutes);

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
            const isHighlight = isTodaySchedule && index === 0;
            const dotClass = isHighlight ? 'dot active' : 'dot';
            const cardClass = isHighlight ? 'card highlighted' : 'card';

            itemDiv.innerHTML = `
                <div class="${dotClass}"></div>
                <div class="${cardClass}">
                    <span class="time">${isTodaySchedule ? '' : `${escapeHTML(classItem.parsed.day)} • `}${escapeHTML(classItem.parsed.startTime)} - ${escapeHTML(classItem.parsed.endTime)}</span>
                    <h1 style="font-size: 1.2rem; margin: 0.25rem 0 0 0;">${escapeHTML(classItem.title)} ${classItem.code ? `(${escapeHTML(classItem.code)})` : ''}</h1>
                    <p style="opacity: 0.5; margin: 4px 0 0 0; font-size: 0.85rem;">${classItem.instructor ? `${t.instructor_label}${escapeHTML(classItem.instructor)}` : ''}</p>
                </div>
            `;
            timelineContainer.appendChild(itemDiv);
        });
    }

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
                    <h3 style="margin: 0; font-size: 1rem; ${taskItem.completed ? 'text-decoration: line-through; opacity: 0.5;' : ''}">${escapeHTML(taskItem.title)}</h3>
                    <p style="opacity: 0.5; font-size: 0.85rem; margin-top: 4px; margin-bottom: 0;">${escapeHTML(taskItem.description || '')}</p>
                </div>
                <span style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">${escapeHTML(taskItem.date || '')}</span>
            `;
            tasksContainer.appendChild(cardDiv);
        });
    }

    // --------------------------------------------------------------------------
    // 8. Filter & Search Engine (My Classes page)
    // --------------------------------------------------------------------------
    let activeDayFilter = 'all';
    let activeTaskFilter = 'all';
    let activeSearchQuery = '';

    const searchInput = document.getElementById('classes-search-input');
    const dayFilterChips = document.getElementById('day-filter-chips');
    const taskFilterChips = document.getElementById('task-filter-chips');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeSearchQuery = e.target.value.trim().toLowerCase();
            renderClassesList();
            renderTasksList();
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
    // 9. Render Classes & Tasks Hub (My Classes page)
    // --------------------------------------------------------------------------
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

        if (classesProgressPercentage) {
            classesProgressPercentage.textContent = `${currentClasses.length}${t.stat_registered_suffix}`;
        }
        if (classesProgressFill) {
            classesProgressFill.style.width = currentClasses.length > 0 ? `${Math.min(currentClasses.length * 20, 100)}%` : '0%';
        }

        const totalTasks = currentTasks.length;
        const completedTasks = currentTasks.filter(task => task.completed).length;
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
        const currentClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const t = translations[currentLang];
        const now = getCurrentTimeSnapshot();

        // Apply filters
        const filtered = currentClasses.filter(c => {
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

        classesListContainer.innerHTML = '';

        if (filtered.length === 0) {
            classesListContainer.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted); margin: 0;">${t.no_classes_empty}</p>
                </div>`;
            return;
        }

        filtered.forEach((item) => {
            const originalIndex = currentClasses.indexOf(item);
            const card = document.createElement('article');
            card.className = 'card';
            card.dataset.index = originalIndex;
            card.innerHTML = `
                <div class="card-header-flex">
                    <h3 style="margin: 0; color: var(--text-main); font-size: 1.1rem;">${escapeHTML(item.title)}</h3>
                    ${item.code ? `<span style="color: var(--primary); font-size: 0.85rem; font-weight: 700;">${escapeHTML(item.code)}</span>` : ''}
                </div>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);">${item.instructor ? `${t.instructor_label}${escapeHTML(item.instructor)}` : `${t.instructor_label}${t.not_assigned}`}</p>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${escapeHTML(item.date || t.no_schedule_set)}</p>
                <div class="card-actions">
                    <button class="edit-btn" data-action="edit-class" data-index="${originalIndex}">${t.btn_edit}</button>
                    <button class="delete-btn" data-action="delete-class" data-index="${originalIndex}">${t.btn_delete}</button>
                </div>
            `;
            classesListContainer.appendChild(card);
        });
    }

    function renderTasksList() {
        if (!tasksListContainer) return;
        const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
        const t = translations[currentLang];

        // Apply filters
        const filtered = currentTasks.filter(task => {
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

        tasksListContainer.innerHTML = '';

        if (filtered.length === 0) {
            tasksListContainer.innerHTML = `
                <div class="task-item" style="text-align: center; padding: 2rem; justify-content: center;">
                    <p style="color: var(--text-muted); margin: 0;">${t.no_tasks_empty}</p>
                </div>`;
            return;
        }

        filtered.forEach((task) => {
            const originalIndex = currentTasks.indexOf(task);
            const taskCard = document.createElement('div');
            taskCard.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskCard.dataset.index = originalIndex;
            taskCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem; width: 100%;">
                    <input type="checkbox" class="task-checkbox" data-index="${originalIndex}" ${task.completed ? 'checked' : ''}>
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.35rem 0; ${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${escapeHTML(task.title)}</h3>
                        <p style="margin: 0 0 0.35rem 0; font-size: 0.85rem;">${escapeHTML(task.description || t.no_desc)}</p>
                        <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">${t.due_label}${escapeHTML(task.date || t.no_date_set)}</span>
                    </div>
                </div>
                <div class="card-actions" style="margin-top: 0;">
                    <button class="edit-btn" data-action="edit-task" data-index="${originalIndex}">${t.btn_edit}</button>
                    <button class="delete-btn" data-action="delete-task" data-index="${originalIndex}">${t.btn_delete}</button>
                </div>
            `;
            tasksListContainer.appendChild(taskCard);
        });
    }

    // CRUD Handlers for Classes & Tasks
    if (classesListContainer && tasksListContainer) {
        tasksListContainer.addEventListener('change', async (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const index = Number(e.target.dataset.index);
                const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
                if (currentTasks[index]) {
                    const isCompleted = e.target.checked;
                    currentTasks[index].completed = isCompleted;
                    
                    if (window.ObsidianAuth && window.ObsidianAuth.currentUser && currentTasks[index].id) {
                        await window.ObsidianAuth.updateTask(currentTasks[index].id, { completed: isCompleted });
                    }

                    localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                    renderTasksList();
                    updateProgressMetrics();
                    renderNotifications();
                    updateDashboardCounters();
                }
            }
        });

        // Edit/Delete Classes
        classesListContainer.addEventListener('click', async (e) => {
            const target = e.target;
            const index = Number(target.dataset.index);
            const currentClasses = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            const t = translations[currentLang];
            const item = currentClasses[index];

            if (target.dataset.action === 'delete-class') {
                if (window.ObsidianAuth && window.ObsidianAuth.currentUser && item && item.id) {
                    await window.ObsidianAuth.deleteClass(item.id);
                }
                currentClasses.splice(index, 1);
                localStorage.setItem('obsidianClasses', JSON.stringify(currentClasses));
                renderClassesList();
                updateProgressMetrics();
                renderNotifications();
                updateDashboardCounters();
                showToast(t.toast_class_deleted);
            } else if (target.dataset.action === 'edit-class') {
                const card = target.closest('.card');
                card.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                        <input type="text" id="edit-class-title-${index}" value="${item.title}" class="class-input" style="padding: 0.4rem;" placeholder="${t.label_class_title}">
                        <input type="text" id="edit-class-code-${index}" value="${item.code || ''}" class="class-input" style="padding: 0.4rem;" placeholder="${t.label_class_code}">
                        <input type="text" id="edit-class-instructor-${index}" value="${item.instructor || ''}" class="class-input" style="padding: 0.4rem;" placeholder="${t.label_class_instructor}">
                        <input type="text" id="edit-class-date-${index}" value="${item.date || ''}" class="class-input" style="padding: 0.4rem;" placeholder="Day, HH:MM - HH:MM">
                        <div class="card-actions">
                            <button class="edit-btn" data-action="save-class" data-index="${index}">${t.btn_save}</button>
                            <button class="delete-btn" data-action="cancel-class" data-index="${index}">${t.btn_cancel}</button>
                        </div>
                    </div>
                `;
            } else if (target.dataset.action === 'save-class') {
                const titleVal = document.getElementById(`edit-class-title-${index}`).value.trim();
                const codeVal = document.getElementById(`edit-class-code-${index}`).value.trim();
                const instructorVal = document.getElementById(`edit-class-instructor-${index}`).value.trim();
                const dateVal = document.getElementById(`edit-class-date-${index}`).value.trim();

                if (!titleVal) {
                    showToast(t.toast_title_req, true);
                    return;
                }

                const updatedClassData = {
                    title: titleVal,
                    code: codeVal,
                    instructor: instructorVal,
                    date: dateVal
                };

                if (window.ObsidianAuth && window.ObsidianAuth.currentUser && item && item.id) {
                    await window.ObsidianAuth.updateClass(item.id, updatedClassData);
                }

                currentClasses[index] = {
                    ...currentClasses[index],
                    ...updatedClassData
                };
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
        tasksListContainer.addEventListener('click', async (e) => {
            const target = e.target;
            const index = Number(target.dataset.index);
            const currentTasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
            const t = translations[currentLang];
            const item = currentTasks[index];

            if (target.dataset.action === 'delete-task') {
                if (window.ObsidianAuth && window.ObsidianAuth.currentUser && item && item.id) {
                    await window.ObsidianAuth.deleteTask(item.id);
                }
                currentTasks.splice(index, 1);
                localStorage.setItem('obsidianTasks', JSON.stringify(currentTasks));
                renderTasksList();
                updateProgressMetrics();
                renderNotifications();
                updateDashboardCounters();
                showToast(t.toast_task_deleted);
            } else if (target.dataset.action === 'edit-task') {
                const taskCard = target.closest('.task-item');
                taskCard.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                        <input type="text" id="edit-task-title-${index}" value="${item.title}" class="class-input" style="padding: 0.4rem;" placeholder="${t.label_task_title}">
                        <textarea id="edit-task-desc-${index}" class="contact-textarea" style="padding: 0.4rem; height: 60px;" placeholder="${t.label_task_desc}">${item.description || ''}</textarea>
                        <input type="text" id="edit-task-date-${index}" value="${item.date || ''}" class="class-input" style="padding: 0.4rem;" placeholder="Day, HH:MM">
                        <div class="card-actions">
                            <button class="edit-btn" data-action="save-task" data-index="${index}">${t.btn_save}</button>
                            <button class="delete-btn" data-action="cancel-task" data-index="${index}">${t.btn_cancel}</button>
                        </div>
                    </div>
                `;
            } else if (target.dataset.action === 'save-task') {
                const titleVal = document.getElementById(`edit-task-title-${index}`).value.trim();
                const descVal = document.getElementById(`edit-task-desc-${index}`).value.trim();
                const dateVal = document.getElementById(`edit-task-date-${index}`).value.trim();

                if (!titleVal) {
                    showToast(t.toast_task_title_req, true);
                    return;
                }

                const updatedTaskData = {
                    title: titleVal,
                    description: descVal,
                    date: dateVal
                };

                if (window.ObsidianAuth && window.ObsidianAuth.currentUser && item && item.id) {
                    await window.ObsidianAuth.updateTask(item.id, updatedTaskData);
                }

                currentTasks[index] = {
                    ...currentTasks[index],
                    ...updatedTaskData
                };
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
    // 10. Add Class & Add Task Form Flow (add class.html)
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
        addCourseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = document.getElementById('course-name').value.trim();
            const code = document.getElementById('course-code').value.trim();
            const day = document.getElementById('course-day').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;
            const instructor = document.getElementById('instructor').value.trim();

            if (!title) {
                showToast(t.toast_title_req, true);
                return;
            }
            if (!startTime || !endTime) {
                showToast(t.toast_time_req, true);
                return;
            }

            const newClass = {
                title,
                code,
                instructor,
                date: `${day.slice(0, 3)}, ${startTime} - ${endTime}`
            };

            if (window.ObsidianAuth && window.ObsidianAuth.currentUser) {
                const cloudId = await window.ObsidianAuth.addClass(newClass);
                if (cloudId) newClass.id = cloudId;
            }

            const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            classes.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));

            showToast(t.toast_class_indexed);
            setTimeout(() => {
                window.location.href = 'classes.html';
            }, 800);
        });

        // Add Task submit
        addTaskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = document.getElementById('task-name').value.trim();
            const day = document.getElementById('task-day').value;
            const time = document.getElementById('task-time').value;
            const description = document.getElementById('task-desc').value.trim();

            if (!title) {
                showToast(t.toast_task_title_req, true);
                return;
            }

            const newTask = {
                title,
                description,
                date: `${day.slice(0, 3)}, ${time || '23:59'}`,
                completed: false
            };

            if (window.ObsidianAuth && window.ObsidianAuth.currentUser) {
                const cloudId = await window.ObsidianAuth.addTask(newTask);
                if (cloudId) newTask.id = cloudId;
            }

            const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
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

    // Standalone Add Class / Task page handling
    const addClassBtn = document.getElementById('add-class-btn');
    const discardClassBtn = document.getElementById('discard-class-btn') || document.getElementById('discard-btn');
    const classTitleInput = document.getElementById('class-title') || document.getElementById('class-name');
    const classCodeInput = document.getElementById('class-code');
    const classInstructorInput = document.getElementById('class-instructor');
    const classDaySelect = document.getElementById('class-day-select') || document.getElementById('class-day');
    const classStartTimeInput = document.getElementById('class-start-time') || document.getElementById('start-time');
    const classEndTimeInput = document.getElementById('class-end-time') || document.getElementById('end-time');

    if (addClassBtn && classTitleInput) {
        addClassBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = classTitleInput.value.trim();
            const code = classCodeInput ? classCodeInput.value.trim() : '';
            const instructor = classInstructorInput ? classInstructorInput.value.trim() : '';
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
                title,
                code,
                instructor,
                date: `${day.slice(0, 3)}, ${startTime} - ${endTime}`
            };

            if (window.ObsidianAuth && window.ObsidianAuth.currentUser) {
                const cloudId = await window.ObsidianAuth.addClass(newClass);
                if (cloudId) newClass.id = cloudId;
            }

            const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            classes.push(newClass);
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));
            localStorage.setItem('obsidian_backup_classes', JSON.stringify(classes));

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
        addTaskDirectBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const t = translations[currentLang];
            const title = taskTitleDirect.value.trim();
            const day = taskDayDirect ? taskDayDirect.value : 'Monday';
            const time = taskTimeDirect ? taskTimeDirect.value : '23:59';
            const description = taskDescDirect ? taskDescDirect.value.trim() : '';

            if (!title) {
                showToast(t.toast_task_title_req, true);
                return;
            }

            const newTask = {
                title,
                description,
                date: `${day.slice(0, 3)}, ${time || '23:59'}`,
                completed: false
            };

            if (window.ObsidianAuth && window.ObsidianAuth.currentUser) {
                const cloudId = await window.ObsidianAuth.addTask(newTask);
                if (cloudId) newTask.id = cloudId;
            }

            const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
            tasks.push(newTask);
            localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
            localStorage.setItem('obsidian_backup_tasks', JSON.stringify(tasks));

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
    // 11. Notification Bell System
    // --------------------------------------------------------------------------
    const bellBtn = document.getElementById('bell-btn');
    const bellBadge = document.getElementById('bell-badge');
    const notifDropdown = document.getElementById('notification-dropdown');
    const notifList = document.getElementById('notif-list');
    const notifClearBtn = document.getElementById('notif-clear-btn');

    function renderNotifications() {
        if (!notifList) return;
        const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
        const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
        const now = getCurrentTimeSnapshot();
        const t = translations[currentLang];

        const alerts = [];
        const alertIdList = [];

        // 1. Classes today
        classes.forEach(c => {
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
        tasks.filter(t => !t.completed).forEach(tk => {
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

        notifList.innerHTML = '';

        // Check if user dismissed notifications for current state
        const dismissedHash = localStorage.getItem('obsidian_notifs_dismissed_hash');
        const currentAlertsHash = alertIdList.sort().join('|');

        if (dismissedHash === currentAlertsHash && alerts.length > 0) {
            if (bellBadge) bellBadge.classList.add('hidden');
            notifList.innerHTML = `<p class="notif-empty">${t.notif_empty}</p>`;
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
            notifList.innerHTML = `<p class="notif-empty">${t.notif_empty}</p>`;
            return;
        }

        alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = `notif-item ${alert.type === 'class' ? 'class-item' : ''} ${alert.urgent ? 'urgent' : ''}`;
            item.innerHTML = `
                <span class="notif-title">${escapeHTML(alert.title)}</span>
                <span class="notif-sub">${escapeHTML(alert.sub)}</span>
            `;
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
                const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
                const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
                const now = getCurrentTimeSnapshot();
                const alertIdList = [];

                classes.forEach(c => {
                    const parsed = parseClassTime(c.date);
                    if (parsed.day === now.dayAbbreviation) {
                        alertIdList.push(`class_${c.title}_${parsed.day}_${parsed.startTime}`);
                    }
                });
                tasks.filter(t => !t.completed).forEach(tk => {
                    alertIdList.push(`task_${tk.title}_${tk.date}`);
                });

                localStorage.setItem('obsidian_notifs_dismissed_hash', alertIdList.sort().join('|'));

                if (bellBadge) bellBadge.classList.add('hidden');
                notifList.innerHTML = `<p class="notif-empty">${translations[currentLang].notif_empty}</p>`;
            });
        }
    }

    // --------------------------------------------------------------------------
    // 12. Operator Profile Customization Modal & Custom Avatar Upload
    // --------------------------------------------------------------------------
    const profilePicBtn = document.getElementById('profile-pic-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileModalClose = document.getElementById('profile-modal-close');
    const profileCancelBtn = document.getElementById('profile-cancel-btn');
    const profileForm = document.getElementById('profile-form');
    const operatorNameInput = document.getElementById('operator-name-input');
    const avatarOpts = document.querySelectorAll('.avatar-opt');
    const customAvatarOpt = document.getElementById('custom-avatar-opt');
    const customAvatarPreviewImg = document.getElementById('custom-avatar-preview-img');
    const customAvatarInput = document.getElementById('custom-avatar-input');
    const btnTriggerUpload = document.getElementById('btn-trigger-upload');
    const avatarDropZone = document.getElementById('avatar-drop-zone');

    let selectedAvatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';

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
            selectedAvatar = localStorage.getItem('obsidian_avatar') || 'photos/avatar.png';
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

        // Click on preset or custom avatar options
        const allOpts = document.querySelectorAll('.avatar-opt');
        allOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                const currentOpts = document.querySelectorAll('.avatar-opt');
                currentOpts.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                selectedAvatar = opt.dataset.avatar;
            });
        });

        // Trigger file input on button click or dropzone click
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

            // Drag and drop handlers
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
                    // Downscale into canvas for performant Base64 storage
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
                    selectedAvatar = compressedDataUrl;

                    if (customAvatarOpt && customAvatarPreviewImg) {
                        customAvatarOpt.style.display = 'block';
                        customAvatarOpt.dataset.avatar = compressedDataUrl;
                        customAvatarPreviewImg.src = compressedDataUrl;
                    }

                    syncAvatarSelectionUI();
                    showToast(t.toast_photo_loaded);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const newName = operatorNameInput.value.trim() || 'Architect';
                localStorage.setItem('obsidian_operator_name', newName);
                localStorage.setItem('obsidian_avatar', selectedAvatar);

                if (window.ObsidianAuth && window.ObsidianAuth.currentUser) {
                    await window.ObsidianAuth.saveUserProfile(newName, selectedAvatar);
                }

                updateAvatarImages();
                updateOperatorGreeting();
                updateAuthModalState();
                closeProfileModal();
                showToast(translations[currentLang].toast_profile_saved);
            });
        }
    }

    // --------------------------------------------------------------------------
    // 13. Data Backup / Restore Engine (JSON Export / Import)
    // --------------------------------------------------------------------------
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataFile = document.getElementById('import-data-file');

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const classes = JSON.parse(localStorage.getItem('obsidianClasses') || '[]');
            const tasks = JSON.parse(localStorage.getItem('obsidianTasks') || '[]');
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
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (Array.isArray(parsed.classes)) {
                        localStorage.setItem('obsidianClasses', JSON.stringify(parsed.classes));
                    }
                    if (Array.isArray(parsed.tasks)) {
                        localStorage.setItem('obsidianTasks', JSON.stringify(parsed.tasks));
                    }
                    if (parsed.operatorName) {
                        localStorage.setItem('obsidian_operator_name', parsed.operatorName);
                    }

                    renderClassesList();
                    renderTasksList();
                    updateProgressMetrics();
                    updateDashboardCounters();
                    renderNotifications();
                    updateOperatorGreeting();
                    showToast(translations[currentLang].toast_import_ok);
                } catch (err) {
                    showToast(translations[currentLang].toast_import_err, true);
                }
            };
            reader.readAsText(file);
        });
    }

    // --------------------------------------------------------------------------
    // 14. FAQ View Switching & Transmission Portal
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

    // Contact Form Transmission
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

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : 'General Inquiry';
            const message = messageInput ? messageInput.value.trim() : '';

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
                    body: JSON.stringify({ name, email, subject, message })
                });

                if (response.ok) {
                    showToast(t.toast_discord_ok);
                    contactForm.reset();
                    if (errorMsg) errorMsg.textContent = "";
                } else {
                    showToast(t.toast_discord_err, true);
                }
            } catch (err) {
                showToast(t.toast_discord_net_err);
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = t.btn_transmit;
                }
            }
        });
    }

    // "View All" Button on Dashboard
    const viewAllTasksBtn = document.getElementById('view-all-tasks');
    if (viewAllTasksBtn) {
        viewAllTasksBtn.addEventListener('click', () => {
            window.location.href = 'classes.html';
        });
    }

    // --------------------------------------------------------------------------
    // 15. Authentication & Cloud Sync Engine (Firebase Modal & UI Sync)
    // --------------------------------------------------------------------------
    const authModalBtn = document.getElementById('auth-modal-btn');
    const authModal = document.getElementById('auth-modal');
    const authModalClose = document.getElementById('auth-modal-close');
    const authCancelBtn = document.getElementById('auth-cancel-btn');
    const authLoggedInView = document.getElementById('auth-logged-in-view');
    const authFormsView = document.getElementById('auth-forms-view');
    const authTabLogin = document.getElementById('auth-tab-login');
    const authTabRegister = document.getElementById('auth-tab-register');
    const groupAuthName = document.getElementById('group-auth-name');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authToggleActionBtn = document.getElementById('auth-toggle-action-btn');
    const authEmailForm = document.getElementById('auth-email-form');
    const btnGoogleAuth = document.getElementById('btn-google-auth');
    const btnGoogleRedirect = document.getElementById('btn-google-redirect');
    const btnAuthSignout = document.getElementById('btn-auth-signout');
    const navSyncIndicator = document.getElementById('nav-sync-indicator');
    const navAuthLabel = document.getElementById('nav-auth-label');

    function openAuthModal() {
        if (authModal) {
            updateAuthModalState();
            authModal.classList.add('open');
        }
    }

    function closeAuthModal() {
        if (authModal) {
            authModal.classList.remove('open');
        }
    }

    function updateAuthModalState() {
        const user = window.ObsidianAuth ? window.ObsidianAuth.currentUser : null;
        const t = translations[currentLang];
        const profilePicBtns = document.querySelectorAll('#profile-pic-btn, .profile-pic');

        if (user) {
            if (authLoggedInView) authLoggedInView.style.display = 'block';
            if (authFormsView) authFormsView.style.display = 'none';

            const authUserDisplayName = document.getElementById('auth-user-display-name');
            const authUserEmail = document.getElementById('auth-user-email');
            const authUserAvatar = document.getElementById('auth-user-avatar');

            const name = user.displayName || localStorage.getItem('obsidian_operator_name') || 'Architect';
            const avatar = localStorage.getItem('obsidian_avatar') || user.photoURL || 'photos/avatar.png';

            if (authUserDisplayName) authUserDisplayName.textContent = name;
            if (authUserEmail) authUserEmail.textContent = user.email || 'operator@terminal.io';
            if (authUserAvatar) authUserAvatar.src = avatar;

            if (navSyncIndicator) {
                navSyncIndicator.classList.remove('offline');
                navSyncIndicator.title = t.status_synced;
            }
            if (navAuthLabel) {
                navAuthLabel.textContent = name.split(' ')[0] || t.btn_account;
            }

            // Reveal profile photo in top navigation bar
            profilePicBtns.forEach(btn => {
                btn.style.display = 'flex';
                btn.classList.add('logged-in');
            });
        } else {
            if (authLoggedInView) authLoggedInView.style.display = 'none';
            if (authFormsView) authFormsView.style.display = 'block';

            if (navSyncIndicator) {
                navSyncIndicator.classList.add('offline');
                navSyncIndicator.title = t.status_guest;
            }
            if (navAuthLabel) {
                navAuthLabel.textContent = t.btn_signin_cloud;
            }

            // Hide profile photo when not authenticated
            profilePicBtns.forEach(btn => {
                btn.style.display = 'none';
                btn.classList.remove('logged-in');
            });
        }
    }

    if (authModalBtn) authModalBtn.addEventListener('click', openAuthModal);
    if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
    if (authCancelBtn) authCancelBtn.addEventListener('click', closeAuthModal);
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModal();
        });
    }

    // Auth Error Sanitizer & Localizer
    function getFriendlyAuthError(err) {
        const t = translations[currentLang];
        const msg = ((err && err.code) || (err && err.message) || '').toLowerCase();
        const currentHost = window.location.hostname || 'localhost';
        const isExternalHost = currentHost.includes('vercel.app') || 
                               currentHost.includes('github.io') || 
                               (currentHost !== 'localhost' && currentHost !== '127.0.0.1' && !currentHost.includes('.run.app'));

        const domainNotice = document.getElementById('auth-domain-notice');

        if (msg.includes('unauthorized-domain')) {
            if (domainNotice) domainNotice.classList.remove('hidden');
            return t.toast_auth_unauthorized_domain;
        }
        if (msg.includes('operation-not-allowed')) {
            return t.toast_auth_op_not_allowed;
        }
        if (msg.includes('popup-blocked')) {
            return t.toast_auth_popup_blocked;
        }
        if (msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request')) {
            if (isExternalHost && domainNotice) {
                domainNotice.classList.remove('hidden');
            }
            return t.toast_auth_popup_closed;
        }
        return (err && err.message) || t.toast_auth_error;
    }

    // Initialize Domain Helper & Custom Firebase Config in Auth Modal
    function initDomainAuthorizationHelper() {
        const hostnameDisplay = document.getElementById('current-hostname-display');
        const copyHostBtn = document.getElementById('btn-copy-hostname');
        const domainNotice = document.getElementById('auth-domain-notice');
        const toggleConfigBtn = document.getElementById('btn-toggle-custom-config');
        const customConfigContainer = document.getElementById('auth-custom-config-container');
        const customConfigTextarea = document.getElementById('custom-firebase-json');
        const saveConfigBtn = document.getElementById('btn-save-firebase-config');
        const resetConfigBtn = document.getElementById('btn-reset-firebase-config');

        const currentHost = window.location.hostname || 'localhost';
        if (hostnameDisplay) {
            hostnameDisplay.textContent = currentHost;
        }

        // Show domain helper if deployed on Vercel, GitHub Pages, or external custom domain
        if (domainNotice) {
            const isExternalHost = currentHost.includes('vercel.app') || 
                                   currentHost.includes('github.io') || 
                                   (currentHost !== 'localhost' && currentHost !== '127.0.0.1' && !currentHost.includes('.run.app'));
            if (isExternalHost) {
                domainNotice.classList.remove('hidden');
            }
        }

        if (copyHostBtn) {
            copyHostBtn.addEventListener('click', async () => {
                const t = translations[currentLang];
                try {
                    await navigator.clipboard.writeText(currentHost);
                    copyHostBtn.textContent = t.btn_copied || "Copied!";
                    showToast(t.toast_domain_copied || "Domain copied to clipboard!");
                    setTimeout(() => {
                        copyHostBtn.textContent = t.btn_copy || "Copy";
                    }, 2000);
                } catch (clipErr) {
                    showToast(currentHost);
                }
            });
        }

        if (toggleConfigBtn && customConfigContainer) {
            toggleConfigBtn.addEventListener('click', () => {
                const isHidden = customConfigContainer.style.display === 'none';
                customConfigContainer.style.display = isHidden ? 'block' : 'none';
                if (isHidden && customConfigTextarea && window.ObsidianAuth) {
                    const activeCfg = window.ObsidianAuth.getActiveConfig();
                    customConfigTextarea.value = JSON.stringify(activeCfg, null, 2);
                }
            });
        }

        if (saveConfigBtn && customConfigTextarea) {
            saveConfigBtn.addEventListener('click', () => {
                const t = translations[currentLang];
                const raw = customConfigTextarea.value.trim();
                try {
                    const parsed = JSON.parse(raw);
                    if (window.ObsidianAuth) {
                        window.ObsidianAuth.saveCustomConfig(parsed);
                        showToast(t.toast_config_saved || "Configuration saved! Reloading...");
                    }
                } catch (e) {
                    showToast(t.toast_config_invalid || "Invalid JSON configuration format.", true);
                }
            });
        }

        if (resetConfigBtn) {
            resetConfigBtn.addEventListener('click', () => {
                const t = translations[currentLang];
                if (window.ObsidianAuth) {
                    window.ObsidianAuth.resetToDefaultConfig();
                    showToast(t.toast_config_reset || "Configuration reset to default.");
                }
            });
        }
    }

    initDomainAuthorizationHelper();

    // Google Sign In (Popup)
    if (btnGoogleAuth) {
        btnGoogleAuth.addEventListener('click', async () => {
            const t = translations[currentLang];
            try {
                btnGoogleAuth.disabled = true;
                btnGoogleAuth.style.opacity = '0.7';
                const res = await window.ObsidianAuth.signInWithGoogle();
                if (res && (res.uid || res.user)) {
                    showToast(t.toast_auth_signin_ok);
                    closeAuthModal();
                }
            } catch (err) {
                console.error(err);
                showToast(getFriendlyAuthError(err), true);
            } finally {
                btnGoogleAuth.disabled = false;
                btnGoogleAuth.style.opacity = '1';
            }
        });
    }

    // Google Sign In (Redirect Fallback for popup-blockers or mobile)
    if (btnGoogleRedirect) {
        btnGoogleRedirect.addEventListener('click', async () => {
            try {
                btnGoogleRedirect.disabled = true;
                btnGoogleRedirect.style.opacity = '0.7';
                await window.ObsidianAuth.signInWithGoogleRedirect();
            } catch (err) {
                console.error(err);
                showToast(getFriendlyAuthError(err), true);
                btnGoogleRedirect.disabled = false;
                btnGoogleRedirect.style.opacity = '1';
            }
        });
    }

    // Email / Password & Magic Link Handlers
    const btnEmailSignin = document.getElementById('btn-email-signin');
    const btnEmailSignup = document.getElementById('btn-email-signup');
    const btnMagicLink = document.getElementById('btn-magic-link');
    const authEmailInput = document.getElementById('auth-email-input');
    const authPasswordInput = document.getElementById('auth-password-input');

    if (btnEmailSignin) {
        btnEmailSignin.addEventListener('click', async () => {
            const email = authEmailInput ? authEmailInput.value.trim() : '';
            const password = authPasswordInput ? authPasswordInput.value.trim() : '';
            if (!email || !password) {
                showToast('Please enter both email and password.', true);
                return;
            }
            try {
                btnEmailSignin.disabled = true;
                await window.ObsidianAuth.signInWithEmail(email, password);
                showToast('Signed in successfully!');
                closeAuthModal();
            } catch (err) {
                showToast(getFriendlyAuthError(err), true);
            } finally {
                btnEmailSignin.disabled = false;
            }
        });
    }

    if (btnEmailSignup) {
        btnEmailSignup.addEventListener('click', async () => {
            const email = authEmailInput ? authEmailInput.value.trim() : '';
            const password = authPasswordInput ? authPasswordInput.value.trim() : '';
            if (!email || !password) {
                showToast('Please enter both email and password.', true);
                return;
            }
            try {
                btnEmailSignup.disabled = true;
                await window.ObsidianAuth.signUpWithEmail(email, password);
                showToast('Account created! Check your email or sign in.');
                closeAuthModal();
            } catch (err) {
                showToast(getFriendlyAuthError(err), true);
            } finally {
                btnEmailSignup.disabled = false;
            }
        });
    }

    if (btnMagicLink) {
        btnMagicLink.addEventListener('click', async () => {
            const email = authEmailInput ? authEmailInput.value.trim() : '';
            if (!email) {
                showToast('Please enter your email address first.', true);
                return;
            }
            try {
                btnMagicLink.disabled = true;
                await window.ObsidianAuth.sendMagicLink(email);
                showToast('Magic link sent to your email!');
            } catch (err) {
                showToast(getFriendlyAuthError(err), true);
            } finally {
                btnMagicLink.disabled = false;
            }
        });
    }

    // Sign Out
    if (btnAuthSignout) {
        btnAuthSignout.addEventListener('click', async () => {
            const t = translations[currentLang];
            try {
                await window.ObsidianAuth.signOut();
                showToast(t.toast_auth_signout_ok);
                closeAuthModal();
            } catch (err) {
                console.error(err);
                showToast(err.message || 'Error signing out', true);
            }
        });
    }

    // Listen to Security Session Timeout
    window.addEventListener('obsidian-session-timeout', () => {
        const t = translations[currentLang];
        showToast(t.toast_session_timeout || 'Session timed out due to inactivity.', true);
        updateAuthModalState();
    });

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
        if (typeof updateAuthModalState === 'function') updateAuthModalState();
    }
    window.ObsidianUI = {
        refreshUI: refreshAllViews
    };

    // Listen to Firebase Auth & Cloud Data Events from firebase-sync.js
    window.addEventListener('obsidian-auth-state-changed', (e) => {
        refreshAllViews();
    });

    window.addEventListener('obsidian-auth-redirect-success', () => {
        const t = translations[currentLang];
        showToast(t.toast_auth_signin_ok);
        closeAuthModal();
        refreshAllViews();
    });

    window.addEventListener('obsidian-auth-redirect-error', (e) => {
        const err = e.detail && e.detail.error;
        showToast(getFriendlyAuthError(err), true);
    });

    window.addEventListener('obsidian-data-updated', () => {
        refreshAllViews();
    });

    window.addEventListener('obsidian-cloud-data-synced', (e) => {
        const { classes, tasks } = e.detail || {};
        if (classes) {
            localStorage.setItem('obsidianClasses', JSON.stringify(classes));
            localStorage.setItem('obsidian_backup_classes', JSON.stringify(classes));
        }
        if (tasks) {
            localStorage.setItem('obsidianTasks', JSON.stringify(tasks));
            localStorage.setItem('obsidian_backup_tasks', JSON.stringify(tasks));
        }
        refreshAllViews();
    });

    // Initial Engine Trigger
    setLanguage(currentLang);
    updateAvatarImages();
    updateOperatorGreeting();
    updateAuthModalState();
    refreshAllViews();
});
