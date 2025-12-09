"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import {
  getCourseById,
  updateCourse,
  deleteCourse,
  getLessonsByCourse,
  getAssignmentsByCourse,
  getQuizzesByCourse,
  createLesson,
  createAssignment,
  createQuiz,
  updateLesson,
  updateAssignment,
  updateQuiz,
  deleteLesson,
  deleteAssignment,
  deleteQuiz,
  type Course,
  type Lesson,
  type Assignment,
  type Quiz,
  type QuizQuestion,
} from "@/lib/data-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const courseId = params.courseId as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    if (courseId) {
      loadCourseData()
    }
  }, [courseId])

  const loadCourseData = () => {
    const courseData = getCourseById(courseId)
    if (!courseData) {
      router.push("/courses")
      return
    }
    setCourse(courseData)
    setLessons(getLessonsByCourse(courseId))
    setAssignments(getAssignmentsByCourse(courseId))
    setQuizzes(getQuizzesByCourse(courseId))
    setLoading(false)
  }

  const handleDeleteCourse = () => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      deleteCourse(courseId)
      router.push("/courses")
    }
  }

  if (loading || !course) {
    return (
      <ProtectedPage requiredRoles={["educator"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage requiredRoles={["educator"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
              <p className="text-gray-600 mt-2">{course.title}</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("educator.delete")}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Course Info</TabsTrigger>
              <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
              <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes ({quizzes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <CourseInfoTab course={course} onUpdate={loadCourseData} />
            </TabsContent>

            <TabsContent value="lessons">
              <LessonsTab courseId={courseId} lessons={lessons} onUpdate={loadCourseData} />
            </TabsContent>

            <TabsContent value="assignments">
              <AssignmentsTab courseId={courseId} assignments={assignments} onUpdate={loadCourseData} />
            </TabsContent>

            <TabsContent value="quizzes">
              <QuizzesTab courseId={courseId} quizzes={quizzes} onUpdate={loadCourseData} />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}

// Course Info Tab
function CourseInfoTab({ course, onUpdate }: { course: Course; onUpdate: () => void }) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    level: course.level,
    category: course.category,
    image: course.image,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    updateCourse(course.id, formData)
    setLoading(false)
    onUpdate()
    alert("Course updated successfully!")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              {t("educator.courseTitle")}
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              {t("educator.courseDescription")}
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="level" className="text-sm font-medium">
                {t("educator.difficulty")}
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="Beginner">{t("educator.beginner")}</option>
                <option value="Intermediate">{t("educator.intermediate")}</option>
                <option value="Advanced">{t("educator.advanced")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium">
              {t("educator.courseImage")} (URL)
            </label>
            <input
              id="image"
              name="image"
              type="url"
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? t("common.loading") : t("common.save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Lessons Tab
function LessonsTab({
  courseId,
  lessons,
  onUpdate,
}: {
  courseId: string
  lessons: Lesson[]
  onUpdate: () => void
}) {
  const { t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    order: lessons.length + 1,
  })

  const handleOpenDialog = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson)
      setFormData({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        order: lesson.order,
      })
    } else {
      setEditingLesson(null)
      setFormData({
        title: "",
        description: "",
        videoUrl: "",
        order: lessons.length + 1,
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLesson) {
      updateLesson(editingLesson.id, formData)
    } else {
      createLesson({
        courseId,
        ...formData,
      })
    }
    setDialogOpen(false)
    onUpdate()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      deleteLesson(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("course.lessons")}</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("lesson.title")}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("lesson.description")}</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("lesson.video")} URL</label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingLesson ? t("common.save") : "Add"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("educator.cancel")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lessons.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No lessons yet. Add your first lesson!</p>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(lesson)}
                  >
                    {t("common.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(lesson.id)}
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Assignments Tab
function AssignmentsTab({
  courseId,
  assignments,
  onUpdate,
}: {
  courseId: string
  assignments: Assignment[]
  onUpdate: () => void
}) {
  const { t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    points: 100,
    instructions: "",
  })

  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment)
      setFormData({
        title: assignment.title,
        description: assignment.description || "",
        dueDate: assignment.dueDate,
        points: assignment.points,
        instructions: assignment.instructions || "",
      })
    } else {
      setEditingAssignment(null)
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        points: 100,
        instructions: "",
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData)
    } else {
      createAssignment({
        courseId,
        ...formData,
      })
    }
    setDialogOpen(false)
    onUpdate()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("course.assignments")}</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
              Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("assignment.title")}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("assignment.description")}</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("assignment.dueDate")}</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("assignment.points")}</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("assignment.instructions")}</label>
                <textarea
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                  placeholder="Provide detailed instructions for students..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingAssignment ? t("common.save") : "Add"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("educator.cancel")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No assignments yet. Add your first assignment!
            </p>
          ) : (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-gray-600">
                    Due: {assignment.dueDate} • {assignment.points} {t("assignment.points")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(assignment)}
                  >
                    {t("common.edit")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Quizzes Tab
function QuizzesTab({
  courseId,
  quizzes,
  onUpdate,
}: {
  courseId: string
  quizzes: Quiz[]
  onUpdate: () => void
}) {
  const { t } = useLanguage()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    passingScore: 70,
    questions: [] as QuizQuestion[],
  })
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 10,
  })

  const handleOpenDialog = (quiz?: Quiz) => {
    if (quiz) {
      setEditingQuiz(quiz)
      setFormData({
        title: quiz.title,
        description: quiz.description || "",
        timeLimit: quiz.timeLimit,
        passingScore: quiz.passingScore,
        questions: quiz.questions,
      })
    } else {
      setEditingQuiz(null)
      setFormData({
        title: "",
        description: "",
        timeLimit: 30,
        passingScore: 70,
        questions: [],
      })
    }
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10,
    })
    setDialogOpen(true)
  }

  const addQuestion = () => {
    if (!questionForm.question || questionForm.options.some((opt) => !opt)) {
      alert("Please fill in the question and all options")
      return
    }
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          id: Date.now().toString(),
          ...questionForm,
        },
      ],
    })
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      points: 10,
    })
  }

  const removeQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((q) => q.id !== questionId),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.questions.length === 0) {
      alert("Please add at least one question")
      return
    }
    if (editingQuiz) {
      updateQuiz(editingQuiz.id, formData)
    } else {
      createQuiz({
        courseId,
        ...formData,
      })
    }
    setDialogOpen(false)
    onUpdate()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      deleteQuiz(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("course.quizzes")}</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuiz ? "Edit Quiz" : "Add New Quiz"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("quiz.title")}</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("quiz.description")}</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("quiz.timeLimit")} (minutes)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.timeLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, timeLimit: parseInt(e.target.value) })
                    }
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("quiz.passingScore")} (%)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={formData.passingScore}
                    onChange={(e) =>
                      setFormData({ ...formData, passingScore: parseInt(e.target.value) })
                    }
                    className="w-full rounded-md border px-3 py-2"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Questions ({formData.questions.length})</h3>

                {/* Add Question Form */}
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question</label>
                    <input
                      type="text"
                      value={questionForm.question}
                      onChange={(e) =>
                        setQuestionForm({ ...questionForm, question: e.target.value })
                      }
                      className="w-full rounded-md border px-3 py-2"
                      placeholder="Enter question text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Options</label>
                    {questionForm.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={questionForm.correctAnswer === idx}
                          onChange={() =>
                            setQuestionForm({ ...questionForm, correctAnswer: idx })
                          }
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...questionForm.options]
                            newOptions[idx] = e.target.value
                            setQuestionForm({ ...questionForm, options: newOptions })
                          }}
                          className="flex-1 rounded-md border px-3 py-2"
                          placeholder={`Option ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Points</label>
                      <input
                        type="number"
                        min={1}
                        value={questionForm.points}
                        onChange={(e) =>
                          setQuestionForm({
                            ...questionForm,
                            points: parseInt(e.target.value),
                          })
                        }
                        className="w-20 rounded-md border px-3 py-2"
                      />
                    </div>
                    <Button type="button" onClick={addQuestion} className="bg-green-600 hover:bg-green-700">
                      Add Question
                    </Button>
                  </div>
                </div>

                {/* Questions List */}
                {formData.questions.length > 0 && (
                  <div className="space-y-2">
                    {formData.questions.map((q, idx) => (
                      <div key={q.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">
                              {idx + 1}. {q.question} ({q.points} points)
                            </p>
                            <ul className="mt-2 space-y-1">
                              {q.options.map((opt, optIdx) => (
                                <li
                                  key={optIdx}
                                  className={`text-sm ${
                                    optIdx === q.correctAnswer ? "text-green-600 font-semibold" : ""
                                  }`}
                                >
                                  {optIdx === q.correctAnswer ? "✓ " : "  "}
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(q.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingQuiz ? t("common.save") : "Create Quiz"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("educator.cancel")}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {quizzes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No quizzes yet. Add your first quiz!</p>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium">{quiz.title}</p>
                  <p className="text-sm text-gray-600">
                    {quiz.questions.length} {t("quiz.questions")} • {quiz.timeLimit}{" "}
                    {t("quiz.timeLimit")} • Passing: {quiz.passingScore}%
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(quiz)}>
                    {t("common.edit")}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(quiz.id)}>
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

