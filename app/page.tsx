import Link from "next/link"

export const metadata = {
  title: "KOMPLEX - Learn Anytime, Anywhere",
  description: "Empowering education in Cambodia with online learning",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <div className="text-sm font-bold text-blue-700 leading-none">KOM</div>
                <div className="text-xs text-black font-semibold leading-none">PLEX</div>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium">
              Login
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Learn From Anywhere in Cambodia</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          KOMPLEX brings quality education to your fingertips. Learn new skills, teach others, and grow
          together with our community.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/signup?role=student"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Start Learning
          </Link>
          <Link
            href="/signup?role=educator"
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-semibold"
          >
            Become an Educator
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose KOMPLEX?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl mb-4">
              📚
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wide Course Selection</h3>
            <p className="text-gray-600">
              Choose from hundreds of courses ranging from programming to languages, all taught by experienced
              educators.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xl mb-4">
              🎥
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Engage with video lessons, assignments, quizzes, and real-time feedback to master new concepts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center text-xl mb-4">
              🌐
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bilingual Support</h3>
            <p className="text-gray-600">
              Learn in both Khmer and English. Switch languages anytime to match your learning preference.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress reports and performance analytics.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-xl mb-4">
              👨‍🏫
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Instructors</h3>
            <p className="text-gray-600">
              Learn from qualified educators who are passionate about sharing their knowledge with you.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-white rounded-lg border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl mb-4">
              ⏰
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn at Your Pace</h3>
            <p className="text-gray-600">
              Access courses anytime, anywhere. Study when you're free and progress at your own speed.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 py-20 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <p>Active Courses</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <p>Students Learning</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">200+</div>
            <p>Expert Educators</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">95%</div>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Learning Journey?</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of students and educators already learning on KOMPLEX.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
        >
          Join Now - It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-gray-50 px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">About</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Learning</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Explore Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  For Educators
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-600">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-gray-600">
          <p>© 2025 KOMPLEX. All rights reserved. Empowering education in Cambodia.</p>
        </div>
      </footer>
    </div>
  )
}
