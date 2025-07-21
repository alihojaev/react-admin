export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation for our components, utilities, and best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Technology Stack */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">Technology Stack</h2>
            </div>
            <p className="text-gray-600 mb-4">
              This project is built with React 18.3.1 and Next.js 15.1.7, providing a modern development experience with server-side rendering and optimized performance.
            </p>
            <div className="space-y-2">
              <a 
                href="https://react.dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium block"
              >
                React Documentation →
              </a>
              <a 
                href="https://nextjs.org/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium block"
              >
                Next.js Documentation →
              </a>
            </div>
          </div>

          {/* Mantine UI Library */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">Mantine UI Library</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Built with Mantine v8.1.3 - a fully featured React components library with 120+ customizable components, 70+ hooks, and excellent TypeScript support.
            </p>
            <div className="space-y-2">
              <a 
                href="https://mantine.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium block"
              >
                Mantine Documentation →
              </a>
              <a 
                href="https://ui.mantine.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium block"
              >
                Mantine UI Components →
              </a>
              <a 
                href="https://mantine.dev/core/package/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium block"
              >
                Mantine Core Package →
              </a>
            </div>
          </div>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Tailwind CSS */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">Tailwind CSS</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A utility-first CSS framework that lets you rapidly build modern websites with utility classes like flex, pt-4, text-center and more.
            </p>
            <div className="space-y-2">
              <a 
                href="https://tailwindcss.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-600 hover:text-cyan-800 font-medium block"
              >
                Tailwind CSS Documentation →
              </a>
              <a 
                href="https://tailwindcss.com/docs/installation/using-vite" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-600 hover:text-cyan-800 font-medium block"
              >
                Vite Installation Guide →
              </a>
              <a 
                href="https://tailwindcss.com/plus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-600 hover:text-cyan-800 font-medium block"
              >
                Tailwind Plus Components →
              </a>
            </div>
          </div>

          {/* React Bits */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">React Bits</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A collection of React patterns, techniques, tips and tricks shared by the community to help you build better React applications.
            </p>
            <div className="space-y-2">
              <a 
                href="https://www.reactbits.dev/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-800 font-medium block"
              >
                React Bits Documentation →
              </a>
              <a 
                href="https://www.reactbits.dev/text-animations/split-text" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-800 font-medium block"
              >
                Text Animations & Split Text →
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Anime.js */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">Anime.js</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A fast and versatile JavaScript animation engine with an intuitive API for animating CSS properties, SVG, DOM elements and JavaScript objects.
            </p>
            <div className="space-y-2">
              <a 
                href="https://animejs.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 font-medium block"
              >
                Anime.js Homepage →
              </a>
              <a 
                href="https://animejs.com/documentation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800 font-medium block"
              >
                Anime.js Documentation →
              </a>
            </div>
          </div>

          {/* Uiverse.io */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">Uiverse.io</h2>
            </div>
            <p className="text-gray-600 mb-4">
              A creative platform for designers and developers to discover, create, and share beautiful UI elements, animations, and interactive components.
            </p>
            <div className="space-y-2">
              <a 
                href="https://uiverse.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 font-medium block"
              >
                Uiverse.io Platform →
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Examples */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">Examples</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Interactive examples and demonstrations of our components and features.
            </p>
            <div className="space-y-2">
              <a 
                href="/examples/inputs" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Inputs →
              </a>
              <a 
                href="/examples/grids" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Grids →
              </a>
              <a 
                href="/examples/drag-drop" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Drag & Drop →
              </a>
              <a 
                href="/examples/carousel" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Carousel →
              </a>
              <a 
                href="/examples/tables" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Tables →
              </a>
              <a 
                href="/splash-cursor" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Splash Cursor →
              </a>
              <a 
                href="/examples/animations" 
                className="text-green-600 hover:text-green-800 font-medium block"
              >
                Animations →
              </a>
            </div>
          </div>

          {/* API Reference */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-3">API Reference</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Complete API documentation with detailed parameter descriptions and usage examples.
            </p>
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
              View API docs →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 