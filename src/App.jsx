import XLSXConverter from './components/XLSXConverter'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">XLSX to CSV Converter</h1>
        <XLSXConverter />
      </div>
    </div>
  )
}

export default App