"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getQuizById, getCourseById, markQuizCompleted, type QuizQuestion } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"

export function QuizPlayer({ quizId }: { quizId: string }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const quiz = getQuizById(quizId)
  const course = quiz ? getCourseById(quiz.courseId) : null
  const quizQuestions = quiz?.questions || []
  
  // Initialize time remaining based on quiz time limit
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (quiz?.timeLimit) {
      return quiz.timeLimit * 60 // Convert minutes to seconds
    }
    return 30 * 60 // Default 30 minutes
  })
  
  useEffect(() => {
    if (!submitted && quiz && quizQuestions.length > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer)
            // Calculate score when time runs out
            let correctCount = 0
            answers.forEach((answer, idx) => {
              if (answer === quizQuestions[idx]?.correctAnswer) {
                correctCount++
              }
            })
            const finalScore = quizQuestions.length > 0 
              ? Math.round((correctCount / quizQuestions.length) * 100)
              : 0
            setScore(finalScore)
            setSubmitted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [submitted, quiz?.id, quizQuestions.length])

  if (!quiz || !course) {
    return <div className="p-6">{t("common.error")}</div>
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-600">This quiz has no questions yet.</p>
      </div>
    )
  }

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0
    answers.forEach((answer, idx) => {
      if (answer === quizQuestions[idx]?.correctAnswer) {
        correctCount++
      }
    })
    const finalScore = quizQuestions.length > 0 
      ? Math.round((correctCount / quizQuestions.length) * 100)
      : 0
    setScore(finalScore)
    setSubmitted(true)
    
    // Mark quiz as completed and update progress
    if (user?.id && quiz) {
      markQuizCompleted(quiz.courseId, quizId, user.id)
      // Trigger progress update event
      window.dispatchEvent(new CustomEvent('progressUpdated'))
    }
  }

  // Initialize answers array when quiz loads
  useEffect(() => {
    if (quizQuestions.length > 0 && answers.length === 0) {
      setAnswers(new Array(quizQuestions.length).fill(null))
    }
  }, [quizQuestions.length, answers.length])

  const question = quizQuestions[currentQuestion]
  const passed = score >= (quiz?.passingScore || 70)

  if (submitted) {
    return (
      <div className="space-y-6 p-4 sm:p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className={`inline-block mb-4 p-4 rounded-full ${passed ? "bg-green-100" : "bg-red-100"}`}>
              <div className="text-4xl">{passed ? "✓" : "✗"}</div>
            </div>
            <h2 className={`text-2xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
              {passed ? t("quiz.passed") : t("quiz.failed")}
            </h2>
            <p className="text-4xl font-bold text-gray-900 mt-4">{score}%</p>
            <p className="text-gray-600 mt-2">
              You answered {answers.filter((a, idx) => a === quizQuestions[idx].correctAnswer).length} of{" "}
              {quizQuestions.length} questions correctly
            </p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
              {t("quiz.retakeQuiz")}
            </button>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Answer Review</h3>
          {quizQuestions.map((q, idx) => {
            const isCorrect = answers[idx] === q.correctAnswer
            return (
              <Card key={q.id} className={isCorrect ? "border-green-200" : "border-red-200"}>
                <CardContent className="pt-4">
                  <p className="font-medium text-gray-900 mb-3">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2 rounded text-sm ${
                          optIdx === answers[idx] && isCorrect
                            ? "bg-green-100 text-green-700 font-medium"
                            : optIdx === answers[idx] && !isCorrect
                              ? "bg-red-100 text-red-700 font-medium"
                              : optIdx === q.correctAnswer && !isCorrect
                                ? "bg-green-100 text-green-700"
                                : ""
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Quiz Header */}
      <Card>
        <CardContent className="pt-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600">{course.title}</p>
          </div>
          <div className={`text-right p-3 rounded ${minutes === 0 && seconds < 300 ? "bg-red-100" : "bg-blue-100"}`}>
            <p className="text-xs text-gray-600">Time Remaining</p>
            <p className={`text-2xl font-bold ${minutes === 0 && seconds < 300 ? "text-red-600" : "text-blue-600"}`}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Question Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            {t("quiz.questionNumber")} {currentQuestion + 1} {t("quiz.of")} {quizQuestions.length}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {answers.filter((a) => a !== null).length}/{quizQuestions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle>{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              className={`w-full p-3 rounded border-2 text-left transition-colors ${
                answers[currentQuestion] === idx
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="inline-block w-6 h-6 rounded-full border-2 mr-3 text-center text-sm font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-2 justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {t("quiz.previousQuestion")}
        </button>

        {currentQuestion === quizQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
          >
            {t("quiz.submitQuiz")}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            {t("quiz.nextQuestion")}
          </button>
        )}
      </div>

      {/* Question Map */}
      <div>
        <p className="text-sm font-medium mb-2">{t("quiz.review")}</p>
        <div className="flex flex-wrap gap-2">
          {quizQuestions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-10 h-10 rounded font-medium ${
                currentQuestion === idx
                  ? "bg-blue-600 text-white"
                  : answers[idx] !== null
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
