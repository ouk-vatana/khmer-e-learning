export const mockCourses = [
  {
    id: "1",
    title: "Java Programming Basics",
    description: "Learn the fundamentals of Java programming from scratch",
    educatorId: "1",
    educatorName: "Mr. Sophea",
    level: "Beginner",
    students: 45,
    lessons: 20,
    image: "/java-programming-course.jpg",
    category: "Programming",
  },
  {
    id: "2",
    title: "Web Design Fundamentals",
    description: "Master HTML, CSS, and responsive design principles",
    educatorId: "1",
    educatorName: "Ms. Chantrea",
    level: "Beginner",
    students: 32,
    lessons: 18,
    image: "/web-design-course.jpg",
    category: "Web Design",
  },
  {
    id: "3",
    title: "English Communication",
    description: "Improve your English speaking and writing skills",
    educatorId: "2",
    educatorName: "Mr. David",
    level: "Intermediate",
    students: 28,
    lessons: 25,
    image: "/english-course.jpg",
    category: "Languages",
  },
]

export const mockEnrollments = [
  {
    courseId: "1",
    studentId: "1",
    progress: 80,
    completed: false,
  },
  {
    courseId: "2",
    studentId: "1",
    progress: 60,
    completed: false,
  },
  {
    courseId: "3",
    studentId: "1",
    progress: 45,
    completed: false,
  },
]

export const mockAssignments = [
  {
    id: "1",
    courseId: "1",
    title: "Build a Calculator Program",
    dueDate: "2025-01-20",
    points: 100,
    status: "pending",
  },
  {
    id: "2",
    courseId: "2",
    title: "Create a Responsive Website",
    dueDate: "2025-01-25",
    points: 100,
    status: "submitted",
    grade: 95,
  },
]

export const mockQuizzes = [
  {
    id: "1",
    courseId: "1",
    title: "Chapter 1 Review Quiz",
    questions: 10,
    timeLimit: 30,
    passingScore: 70,
  },
]

export const mockLessons = [
  {
    id: "1",
    courseId: "1",
    title: "Introduction to Java",
    description: "Learn what Java is and why it matters",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    order: 1,
  },
  {
    id: "2",
    courseId: "1",
    title: "Variables and Data Types",
    description: "Understand how to store and manage data",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    order: 2,
  },
]
