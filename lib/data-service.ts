// Data service for managing courses, assignments, lessons, quizzes using localStorage

export interface Course {
  id: string
  title: string
  description: string
  educatorId: string
  educatorName: string
  level: "Beginner" | "Intermediate" | "Advanced"
  students: number
  lessons: number
  image: string
  category: string
  createdAt: string
}

export interface Assignment {
  id: string
  courseId: string
  title: string
  description?: string
  dueDate: string
  points: number
  instructions?: string
  status?: "pending" | "submitted" | "graded"
  grade?: number
  createdAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl: string
  order: number
  resources?: string[]
  createdAt: string
}

export interface Quiz {
  id: string
  courseId: string
  title: string
  description?: string
  questions: QuizQuestion[]
  timeLimit: number // in minutes
  passingScore: number
  createdAt: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // index of correct option
  points: number
}

export interface Enrollment {
  courseId: string
  studentId: string
  progress: number
  completed: boolean
  enrolledAt: string
}

// Initialize default data if localStorage is empty
function initializeData() {
  if (typeof window === "undefined") return

  const hasData = localStorage.getItem("komplex_courses")
  if (hasData) return

  // Initialize with default courses
  const defaultCourses: Course[] = [
    {
      id: "1",
      title: "Java Programming Basics",
      description: "Learn the fundamentals of Java programming from scratch",
      educatorId: "1",
      educatorName: "Mr. Sophea",
      level: "Beginner",
      students: 45,
      lessons: 2,
      image: "/java-programming-course.jpg",
      category: "Programming",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Web Design Fundamentals",
      description: "Master HTML, CSS, and responsive design principles",
      educatorId: "1",
      educatorName: "Ms. Chantrea",
      level: "Beginner",
      students: 32,
      lessons: 0,
      image: "/web-design-course.jpg",
      category: "Web Design",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "English Communication",
      description: "Improve your English speaking and writing skills",
      educatorId: "2",
      educatorName: "Mr. David",
      level: "Intermediate",
      students: 28,
      lessons: 0,
      image: "/english-course.jpg",
      category: "Languages",
      createdAt: new Date().toISOString(),
    },
  ]

  const defaultLessons: Lesson[] = [
    {
      id: "1",
      courseId: "1",
      title: "Introduction to Java",
      description: "Learn what Java is and why it matters",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      courseId: "1",
      title: "Variables and Data Types",
      description: "Understand how to store and manage data",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      order: 2,
      createdAt: new Date().toISOString(),
    },
  ]

  const defaultAssignments: Assignment[] = [
    {
      id: "1",
      courseId: "1",
      title: "Build a Calculator Program",
      description: "Create a simple calculator using Java",
      dueDate: "2025-01-20",
      points: 100,
      instructions: "Submit your Java source code files",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      courseId: "2",
      title: "Create a Responsive Website",
      description: "Design and implement a responsive website",
      dueDate: "2025-01-25",
      points: 100,
      instructions: "Submit HTML, CSS, and JavaScript files",
      status: "submitted",
      grade: 95,
      createdAt: new Date().toISOString(),
    },
  ]

  const defaultQuizzes: Quiz[] = [
    {
      id: "1",
      courseId: "1",
      title: "Chapter 1 Review Quiz",
      description: "Test your understanding of Java basics",
      questions: [
        {
          id: "q1",
          question: "What is Java?",
          options: ["A programming language", "A coffee brand", "An operating system", "A database"],
          correctAnswer: 0,
          points: 10,
        },
        {
          id: "q2",
          question: "Which keyword is used to declare a variable in Java?",
          options: ["var", "let", "int", "variable"],
          correctAnswer: 2,
          points: 10,
        },
      ],
      timeLimit: 30,
      passingScore: 70,
      createdAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem("komplex_courses", JSON.stringify(defaultCourses))
  localStorage.setItem("komplex_lessons", JSON.stringify(defaultLessons))
  localStorage.setItem("komplex_assignments", JSON.stringify(defaultAssignments))
  localStorage.setItem("komplex_quizzes", JSON.stringify(defaultQuizzes))
  localStorage.setItem("komplex_enrollments", JSON.stringify([]))
}

// Courses
export function getCourses(): Course[] {
  if (typeof window === "undefined") return []
  initializeData()
  const data = localStorage.getItem("komplex_courses")
  return data ? JSON.parse(data) : []
}

export function getCourseById(id: string): Course | undefined {
  return getCourses().find((c) => c.id === id)
}

export function getCoursesByEducator(educatorId: string): Course[] {
  return getCourses().filter((c) => c.educatorId === educatorId)
}

export function createCourse(course: Omit<Course, "id" | "createdAt" | "lessons" | "students">): Course {
  const courses = getCourses()
  const newCourse: Course = {
    ...course,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    lessons: 0,
    students: 0,
  }
  courses.push(newCourse)
  localStorage.setItem("komplex_courses", JSON.stringify(courses))
  return newCourse
}

export function updateCourse(id: string, updates: Partial<Course>): Course | null {
  const courses = getCourses()
  const index = courses.findIndex((c) => c.id === id)
  if (index === -1) return null
  courses[index] = { ...courses[index], ...updates }
  localStorage.setItem("komplex_courses", JSON.stringify(courses))
  return courses[index]
}

export function deleteCourse(id: string): boolean {
  const courses = getCourses()
  const filtered = courses.filter((c) => c.id !== id)
  if (filtered.length === courses.length) return false
  localStorage.setItem("komplex_courses", JSON.stringify(filtered))
  
  // Also delete related lessons, assignments, quizzes
  deleteLessonsByCourse(id)
  deleteAssignmentsByCourse(id)
  deleteQuizzesByCourse(id)
  
  return true
}

// Lessons
export function getLessons(): Lesson[] {
  if (typeof window === "undefined") return []
  initializeData()
  const data = localStorage.getItem("komplex_lessons")
  return data ? JSON.parse(data) : []
}

export function getLessonsByCourse(courseId: string): Lesson[] {
  return getLessons()
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.order - b.order)
}

export function getLessonById(id: string): Lesson | undefined {
  return getLessons().find((l) => l.id === id)
}

export function createLesson(lesson: Omit<Lesson, "id" | "createdAt">): Lesson {
  const lessons = getLessons()
  const courseLessons = getLessonsByCourse(lesson.courseId)
  const maxOrder = courseLessons.length > 0 ? Math.max(...courseLessons.map((l) => l.order)) : 0
  
  const newLesson: Lesson = {
    ...lesson,
    id: Date.now().toString(),
    order: lesson.order || maxOrder + 1,
    createdAt: new Date().toISOString(),
  }
  lessons.push(newLesson)
  localStorage.setItem("komplex_lessons", JSON.stringify(lessons))
  
  // Update course lesson count
  const course = getCourseById(lesson.courseId)
  if (course) {
    updateCourse(lesson.courseId, { lessons: getLessonsByCourse(lesson.courseId).length + 1 })
  }
  
  return newLesson
}

export function updateLesson(id: string, updates: Partial<Lesson>): Lesson | null {
  const lessons = getLessons()
  const index = lessons.findIndex((l) => l.id === id)
  if (index === -1) return null
  lessons[index] = { ...lessons[index], ...updates }
  localStorage.setItem("komplex_lessons", JSON.stringify(lessons))
  return lessons[index]
}

export function deleteLesson(id: string): boolean {
  const lessons = getLessons()
  const lesson = lessons.find((l) => l.id === id)
  const filtered = lessons.filter((l) => l.id !== id)
  if (filtered.length === lessons.length) return false
  localStorage.setItem("komplex_lessons", JSON.stringify(filtered))
  
  // Update course lesson count
  if (lesson) {
    const course = getCourseById(lesson.courseId)
    if (course) {
      updateCourse(lesson.courseId, { lessons: getLessonsByCourse(lesson.courseId).length })
    }
  }
  
  return true
}

function deleteLessonsByCourse(courseId: string) {
  const lessons = getLessons()
  const filtered = lessons.filter((l) => l.courseId !== courseId)
  localStorage.setItem("komplex_lessons", JSON.stringify(filtered))
}

// Assignments
export function getAssignments(): Assignment[] {
  if (typeof window === "undefined") return []
  initializeData()
  const data = localStorage.getItem("komplex_assignments")
  return data ? JSON.parse(data) : []
}

export function getAssignmentsByCourse(courseId: string): Assignment[] {
  return getAssignments().filter((a) => a.courseId === courseId)
}

export function getAssignmentById(id: string): Assignment | undefined {
  return getAssignments().find((a) => a.id === id)
}

export function createAssignment(assignment: Omit<Assignment, "id" | "createdAt" | "status">): Assignment {
  const assignments = getAssignments()
  const newAssignment: Assignment = {
    ...assignment,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  assignments.push(newAssignment)
  localStorage.setItem("komplex_assignments", JSON.stringify(assignments))
  return newAssignment
}

export function updateAssignment(id: string, updates: Partial<Assignment>): Assignment | null {
  const assignments = getAssignments()
  const index = assignments.findIndex((a) => a.id === id)
  if (index === -1) return null
  assignments[index] = { ...assignments[index], ...updates }
  localStorage.setItem("komplex_assignments", JSON.stringify(assignments))
  return assignments[index]
}

export function deleteAssignment(id: string): boolean {
  const assignments = getAssignments()
  const filtered = assignments.filter((a) => a.id !== id)
  if (filtered.length === assignments.length) return false
  localStorage.setItem("komplex_assignments", JSON.stringify(filtered))
  return true
}

function deleteAssignmentsByCourse(courseId: string) {
  const assignments = getAssignments()
  const filtered = assignments.filter((a) => a.courseId !== courseId)
  localStorage.setItem("komplex_assignments", JSON.stringify(filtered))
}

// Quizzes
export function getQuizzes(): Quiz[] {
  if (typeof window === "undefined") return []
  initializeData()
  const data = localStorage.getItem("komplex_quizzes")
  return data ? JSON.parse(data) : []
}

export function getQuizzesByCourse(courseId: string): Quiz[] {
  return getQuizzes().filter((q) => q.courseId === courseId)
}

export function getQuizById(id: string): Quiz | undefined {
  return getQuizzes().find((q) => q.id === id)
}

export function createQuiz(quiz: Omit<Quiz, "id" | "createdAt">): Quiz {
  const quizzes = getQuizzes()
  const newQuiz: Quiz = {
    ...quiz,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  quizzes.push(newQuiz)
  localStorage.setItem("komplex_quizzes", JSON.stringify(quizzes))
  return newQuiz
}

export function updateQuiz(id: string, updates: Partial<Quiz>): Quiz | null {
  const quizzes = getQuizzes()
  const index = quizzes.findIndex((q) => q.id === id)
  if (index === -1) return null
  quizzes[index] = { ...quizzes[index], ...updates }
  localStorage.setItem("komplex_quizzes", JSON.stringify(quizzes))
  return quizzes[index]
}

export function deleteQuiz(id: string): boolean {
  const quizzes = getQuizzes()
  const filtered = quizzes.filter((q) => q.id !== id)
  if (filtered.length === quizzes.length) return false
  localStorage.setItem("komplex_quizzes", JSON.stringify(filtered))
  return true
}

function deleteQuizzesByCourse(courseId: string) {
  const quizzes = getQuizzes()
  const filtered = quizzes.filter((q) => q.courseId !== courseId)
  localStorage.setItem("komplex_quizzes", JSON.stringify(filtered))
}

// Enrollments
export function getEnrollments(): Enrollment[] {
  if (typeof window === "undefined") return []
  initializeData()
  const data = localStorage.getItem("komplex_enrollments")
  return data ? JSON.parse(data) : []
}

export function enrollStudent(courseId: string, studentId: string): Enrollment {
  const enrollments = getEnrollments()
  const existing = enrollments.find((e) => e.courseId === courseId && e.studentId === studentId)
  if (existing) return existing
  
  const newEnrollment: Enrollment = {
    courseId,
    studentId,
    progress: 0,
    completed: false,
    enrolledAt: new Date().toISOString(),
  }
  enrollments.push(newEnrollment)
  localStorage.setItem("komplex_enrollments", JSON.stringify(enrollments))
  
  // Update course student count
  const course = getCourseById(courseId)
  if (course) {
    updateCourse(courseId, { students: course.students + 1 })
  }
  
  return newEnrollment
}

export function getEnrollmentsByStudent(studentId: string): Enrollment[] {
  return getEnrollments().filter((e) => e.studentId === studentId)
}

export function getEnrollmentsByCourse(courseId: string): Enrollment[] {
  return getEnrollments().filter((e) => e.courseId === courseId)
}

export function updateEnrollmentProgress(
  courseId: string,
  studentId: string,
  progress: number
): Enrollment | null {
  const enrollments = getEnrollments()
  const index = enrollments.findIndex(
    (e) => e.courseId === courseId && e.studentId === studentId
  )
  if (index === -1) return null
  
  enrollments[index] = {
    ...enrollments[index],
    progress: Math.min(100, Math.max(0, progress)), // Clamp between 0-100
    completed: progress >= 100,
  }
  localStorage.setItem("komplex_enrollments", JSON.stringify(enrollments))
  return enrollments[index]
}

export function calculateCourseProgress(
  courseId: string,
  studentId: string
): number {
  const course = getCourseById(courseId)
  if (!course) return 0
  
  const lessons = getLessonsByCourse(courseId)
  const assignments = getAssignmentsByCourse(courseId)
  const quizzes = getQuizzesByCourse(courseId)
  
  // Check completed lessons (stored in localStorage)
  const completedLessons = localStorage.getItem(`komplex_completed_lessons_${studentId}_${courseId}`)
  const completedLessonsArray = completedLessons ? JSON.parse(completedLessons) : []
  
  // Check completed assignments
  const completedAssignments = assignments.filter(
    (a) => a.status === "submitted" || a.status === "graded"
  )
  
  // Check completed quizzes (stored in localStorage)
  const completedQuizzes = localStorage.getItem(`komplex_completed_quizzes_${studentId}_${courseId}`)
  const completedQuizzesArray = completedQuizzes ? JSON.parse(completedQuizzes) : []
  
  // Calculate progress: 60% lessons + 25% assignments + 15% quizzes
  const totalItems = lessons.length + assignments.length + quizzes.length
  if (totalItems === 0) return 0
  
  const lessonProgress = lessons.length > 0 
    ? (completedLessonsArray.length / lessons.length) * 60 
    : 0
  const assignmentProgress = assignments.length > 0 
    ? (completedAssignments.length / assignments.length) * 25 
    : 0
  const quizProgress = quizzes.length > 0 
    ? (completedQuizzesArray.length / quizzes.length) * 15 
    : 0
  
  return Math.round(lessonProgress + assignmentProgress + quizProgress)
}

export function markLessonCompleted(
  courseId: string,
  lessonId: string,
  studentId: string
): void {
  const key = `komplex_completed_lessons_${studentId}_${courseId}`
  const completed = localStorage.getItem(key)
  const completedArray = completed ? JSON.parse(completed) : []
  
  if (!completedArray.includes(lessonId)) {
    completedArray.push(lessonId)
    localStorage.setItem(key, JSON.stringify(completedArray))
    
    // Update enrollment progress
    const progress = calculateCourseProgress(courseId, studentId)
    updateEnrollmentProgress(courseId, studentId, progress)
  }
}

export function markQuizCompleted(
  courseId: string,
  quizId: string,
  studentId: string
): void {
  const key = `komplex_completed_quizzes_${studentId}_${courseId}`
  const completed = localStorage.getItem(key)
  const completedArray = completed ? JSON.parse(completed) : []
  
  if (!completedArray.includes(quizId)) {
    completedArray.push(quizId)
    localStorage.setItem(key, JSON.stringify(completedArray))
    
    // Update enrollment progress
    const progress = calculateCourseProgress(courseId, studentId)
    updateEnrollmentProgress(courseId, studentId, progress)
  }
}

