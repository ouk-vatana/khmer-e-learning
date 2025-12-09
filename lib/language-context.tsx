"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "km"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.myCoursesEd": "My Courses",
    "nav.grades": "Grades",
    "nav.students": "Students",
    "nav.messages": "Messages",
    "nav.settings": "Settings",
    "nav.browseCourses": "Browse Courses",
    "nav.myCourses": "My Courses",
    "nav.myWork": "My Work",
    "nav.gradesStudent": "Grades & Progress",

    // Auth
    "auth.register": "Sign Up",
    "auth.login": "Login",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.fullName": "Full Name",
    "auth.selectRole": "Select Role",
    "auth.educator": "Educator",
    "auth.student": "Student",
    "auth.createAccount": "Create Account",
    "auth.signIn": "Sign In",
    "auth.haveAccount": "Already have an account?",
    "auth.noAccount": "Don't have an account?",
    "auth.rememberMe": "Remember Me",
    "auth.welcomeBack": "Welcome back",
    "auth.getStarted": "Get Started",

    // Educator Dashboard
    "educator.dashboard": "Educator Dashboard",
    "educator.quickStats": "Quick Stats",
    "educator.activeCourses": "Active Courses",
    "educator.totalStudents": "Total Students",
    "educator.pendingSubmissions": "Pending Submissions",
    "educator.myCourses": "My Courses",
    "educator.createNewCourse": "Create New Course",
    "educator.enrolled": "enrolled",
    "educator.active": "active",
    "educator.edit": "Edit",
    "educator.delete": "Delete",
    "educator.viewGrades": "View Grades",
    "educator.postAnnouncement": "Post Announcement",
    "educator.courseTitle": "Course Title",
    "educator.courseDescription": "Course Description",
    "educator.difficulty": "Difficulty Level",
    "educator.beginner": "Beginner",
    "educator.intermediate": "Intermediate",
    "educator.advanced": "Advanced",
    "educator.courseImage": "Course Image",
    "educator.create": "Create",
    "educator.cancel": "Cancel",

    // Student Dashboard
    "student.dashboard": "My Learning Dashboard",
    "student.enrolledCourses": "Enrolled Courses",
    "student.progressOverall": "Overall Progress",
    "student.pendingAssignments": "Pending Assignments",
    "student.gradeAverage": "Grade Average",
    "student.enrolledIn": "Enrolled in",
    "student.lessonsCompleted": "lessons completed",
    "student.continueLearning": "Continue Learning",
    "student.dueIn": "Due in",
    "student.days": "days",
    "student.browseMoreCourses": "Browse More Courses",

    // Courses
    "course.allCourses": "All Courses",
    "course.filter": "Filter",
    "course.search": "Search Courses",
    "course.category": "Category",
    "course.enroll": "Enroll",
    "course.enrolled": "Enrolled",
    "course.viewDetails": "View Details",
    "course.lessons": "Lessons",
    "course.assignments": "Assignments",
    "course.quizzes": "Quizzes",
    "course.courseName": "Course Name",
    "course.educator": "Educator",
    "course.students": "Students",
    "course.level": "Level",

    // Lessons
    "lesson.title": "Lesson Title",
    "lesson.description": "Description",
    "lesson.video": "Video",
    "lesson.resources": "Resources",
    "lesson.downloadNotes": "Download Lesson Notes",
    "lesson.markComplete": "Mark as Complete",
    "lesson.nextLesson": "Next Lesson",
    "lesson.previousLesson": "Previous Lesson",
    "lesson.completed": "Completed",

    // Assignments
    "assignment.title": "Assignment",
    "assignment.dueDate": "Due Date",
    "assignment.points": "Points",
    "assignment.instructions": "Instructions",
    "assignment.submitAssignment": "Submit Assignment",
    "assignment.uploadFile": "Upload File",
    "assignment.submitted": "Submitted",
    "assignment.notSubmitted": "Not Submitted",
    "assignment.late": "Late",
    "assignment.feedback": "Feedback",
    "assignment.yourGrade": "Your Grade",
    "assignment.viewFeedback": "View Feedback",

    // Quizzes
    "quiz.title": "Quiz",
    "quiz.takeQuiz": "Take Quiz",
    "quiz.questions": "Questions",
    "quiz.timeLimit": "Time Limit",
    "quiz.passingScore": "Passing Score",
    "quiz.startQuiz": "Start Quiz",
    "quiz.submitQuiz": "Submit Quiz",
    "quiz.yourScore": "Your Score",
    "quiz.passed": "Passed",
    "quiz.failed": "Failed",
    "quiz.retakeQuiz": "Retake Quiz",
    "quiz.questionNumber": "Question",
    "quiz.of": "of",
    "quiz.nextQuestion": "Next Question",
    "quiz.previousQuestion": "Previous Question",
    "quiz.review": "Review",

    // Profile
    "profile.myProfile": "My Profile",
    "profile.editProfile": "Edit Profile",
    "profile.changePassword": "Change Password",
    "profile.logout": "Logout",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.bio": "Bio",
    "profile.photo": "Photo",
    "profile.save": "Save Changes",

    // Language
    "language.english": "English",
    "language.khmer": "ខ្មែរ",
    "language.selectLanguage": "Select Language",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.close": "Close",
    "common.search": "Search",
  },
  km: {
    // Navigation
    "nav.home": "ទំព័រដើម",
    "nav.myCoursesEd": "វគ្គរបស់ខ្ញុំ",
    "nav.grades": "ពិន្ទុ",
    "nav.students": "សិស្ស",
    "nav.messages": "សារ",
    "nav.settings": "ការកំណត់",
    "nav.browseCourses": "រកមើលវគ្គ",
    "nav.myCourses": "វគ្គរបស់ខ្ញុំ",
    "nav.myWork": "ការងាររបស់ខ្ញុំ",
    "nav.gradesStudent": "ពិន្ទុ និងវឌ្ឍនភាព",

    // Auth
    "auth.register": "ចុះឈ្មោះ",
    "auth.login": "ចូលប្រើប្រាស់",
    "auth.email": "អ័ក្សរឯកសារ",
    "auth.password": "ពាក្យសម្ងាត់",
    "auth.confirmPassword": "បញ្ជាក់ពាក្យសម្ងាត់",
    "auth.fullName": "ឈ្មោះពេញលេញ",
    "auth.selectRole": "ជ្រើសរើសតនមួយ",
    "auth.educator": "គ្រូ",
    "auth.student": "សិស្ស",
    "auth.createAccount": "បង្កើតគណនី",
    "auth.signIn": "ចូលប្រើប្រាស់",
    "auth.haveAccount": "មានគណនីរួចហើយ?",
    "auth.noAccount": "មិនមានគណនីទេ?",
    "auth.rememberMe": "ចាប់ចងចាំខ្ញុំ",
    "auth.welcomeBack": "ស្វាគមន៍ក្រលប់មកវិញ",
    "auth.getStarted": "ចាប់ផ្តើម",

    // Educator Dashboard
    "educator.dashboard": "ផ្ទាំងគ្រូ",
    "educator.quickStats": "ស្ថិតិរហ័ស",
    "educator.activeCourses": "វគ្គសक្រិយ",
    "educator.totalStudents": "សរុបសិស្ស",
    "educator.pendingSubmissions": "ការដាក់ស្នើប្រញាប់",
    "educator.myCourses": "វគ្គរបស់ខ្ញុំ",
    "educator.createNewCourse": "បង្កើតវគ្គថ្មី",
    "educator.enrolled": "ចុះឈ្មោះ",
    "educator.active": "សក្រិយ",
    "educator.edit": "កែប្រែ",
    "educator.delete": "លុប",
    "educator.viewGrades": "មើលពិន្ទុ",
    "educator.postAnnouncement": "ប្រកាសប្រកាយ",
    "educator.courseTitle": "ចំណងជើងវគ្គ",
    "educator.courseDescription": "ការពិពណ៌នាវគ្គ",
    "educator.difficulty": "កម្រិតលំបាក",
    "educator.beginner": "ថ្មីម្នាក់",
    "educator.intermediate": "មិនច្រើនច្រើនប្រឹង",
    "educator.advanced": "កម្រិតខ្ពស់",
    "educator.courseImage": "រូបភាពវគ្គ",
    "educator.create": "បង្កើត",
    "educator.cancel": "បោះបង់",

    // Student Dashboard
    "student.dashboard": "ផ្ទាំងរៀនរបស់ខ្ញុំ",
    "student.enrolledCourses": "វគ្គដែលចុះឈ្មោះ",
    "student.progressOverall": "វឌ្ឍនភាពទូទៅ",
    "student.pendingAssignments": "ការងារដែលកំពុងរង់ចាំ",
    "student.gradeAverage": "ពិន្ទុមធ្យម",
    "student.enrolledIn": "ចុះឈ្មោះក្នុង",
    "student.lessonsCompleted": "មេរៀនបានបញ្ចប់",
    "student.continueLearning": "បន្តរៀន",
    "student.dueIn": "ដល់កាលកំណត់ក្នុង",
    "student.days": "ថ្ងៃ",
    "student.browseMoreCourses": "រកមើលវគ្គលម្អិត",

    // Courses
    "course.allCourses": "វគ្គទាំងអស់",
    "course.filter": "ច្រោះលើក",
    "course.search": "ស្វាគមន៍វគ្គ",
    "course.category": "ប្រភេទ",
    "course.enroll": "ចុះឈ្មោះ",
    "course.enrolled": "ចុះឈ្មោះ",
    "course.viewDetails": "មើលលម្អិត",
    "course.lessons": "មេរៀន",
    "course.assignments": "ការងារ",
    "course.quizzes": "សម្ភស្ដារ",
    "course.courseName": "ឈ្មោះវគ្គ",
    "course.educator": "គ្រូ",
    "course.students": "សិស្ស",
    "course.level": "កម្រិត",

    // Lessons
    "lesson.title": "ចំណងជើងមេរៀន",
    "lesson.description": "ការពិពណ៌នា",
    "lesson.video": "វីដេអូ",
    "lesson.resources": "ធនធាន",
    "lesson.downloadNotes": "ទាញយកចំណាំមេរៀន",
    "lesson.markComplete": "សម្គាល់ថាបានបញ្ចប់",
    "lesson.nextLesson": "មេរៀនបន្ទាប់",
    "lesson.previousLesson": "មេរៀនមុន",
    "lesson.completed": "បានបញ្ចប់",

    // Assignments
    "assignment.title": "ការងារ",
    "assignment.dueDate": "កាលកំណត់",
    "assignment.points": "ពិន្ទុ",
    "assignment.instructions": "សេចក្តីណែនាំ",
    "assignment.submitAssignment": "ដាក់ស្នើការងារ",
    "assignment.uploadFile": "ផ្ទុកឯកសារ",
    "assignment.submitted": "ដាក់ស្នើ",
    "assignment.notSubmitted": "មិនបានដាក់ស្នើ",
    "assignment.late": "យឺត",
    "assignment.feedback": "មតិយោបល់",
    "assignment.yourGrade": "ពិន្ទុរបស់អ្នក",
    "assignment.viewFeedback": "មើលមតិយោបល់",

    // Quizzes
    "quiz.title": "សម្ភស្ដារ",
    "quiz.takeQuiz": "ឆ្លើយសម្ភស្ដារ",
    "quiz.questions": "សំណួរ",
    "quiz.timeLimit": "ដែនកំណត់ពេលវេលា",
    "quiz.passingScore": "ពិន្ទុប្រលង",
    "quiz.startQuiz": "ចាប់ផ្តើមសម្ភស្ដារ",
    "quiz.submitQuiz": "ដាក់ស្នើសម្ភស្ដារ",
    "quiz.yourScore": "ពិន្ទុរបស់អ្នក",
    "quiz.passed": "ឆ្លងកាត់",
    "quiz.failed": "មិនឆ្លងកាត់",
    "quiz.retakeQuiz": "ឆ្លើយសម្ភស្ដារម្ដងទៀត",
    "quiz.questionNumber": "សំណួរ",
    "quiz.of": "នៃ",
    "quiz.nextQuestion": "សំណួរបន្ទាប់",
    "quiz.previousQuestion": "សំណួរមុន",
    "quiz.review": "ពិនិត្យ",

    // Profile
    "profile.myProfile": "ប្រវត្តិរូបរបស់ខ្ញុំ",
    "profile.editProfile": "កែប្រែប្រវត្តិរូប",
    "profile.changePassword": "ផ្លាស់ប្តូរលេខសម្ងាត់",
    "profile.logout": "ចាកចេញ",
    "profile.name": "ឈ្មោះ",
    "profile.email": "អ័ក្សរឯកសារ",
    "profile.bio": "ជីវប្រវត្តិ",
    "profile.photo": "រូបថត",
    "profile.save": "រក្សាទុកការផ្លាស់ប្តូរ",

    // Language
    "language.english": "English",
    "language.khmer": "ខ្មែរ",
    "language.selectLanguage": "ជ្រើសរើសភាសា",

    // Common
    "common.loading": "កំពុងផ្ទុក...",
    "common.error": "កំហុស",
    "common.success": "ជោគជ័យ",
    "common.save": "រក្សាទុក",
    "common.delete": "លុប",
    "common.edit": "កែប្រែ",
    "common.back": "ត្រឡប់ក្រោយ",
    "common.next": "បន្ទាប់",
    "common.submit": "ដាក់ស្នើ",
    "common.close": "បិទ",
    "common.search": "ស្វាគមន៍",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null
    if (saved) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  if (!mounted) return null

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
