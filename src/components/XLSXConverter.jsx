import React, { useState } from 'react';
import { trackEvent } from '../utils/Analytics';
import * as ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const XLSXConverter = () => {
  const [sheetsData, setSheetsData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [delimiter, setDelimiter] = useState(',');

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const processSheet = (worksheet) => {
    const data = [];
    let maxCells = 0;

    // First pass: determine the maximum number of columns
    worksheet.eachRow((row) => {
      maxCells = Math.max(maxCells, row.cellCount);
    });

    // Second pass: process the data with proper formatting
    worksheet.eachRow((row, rowNumber) => {
      const rowData = [];
      
      // Process each cell up to maxCells
      for (let i = 1; i <= maxCells; i++) {
        const cell = row.getCell(i);
        let value = '';

        try {
          if (cell.value === null || cell.value === undefined) {
            value = '';
          } else if (cell.value instanceof Date) {
            // Format date as YYYY-MM-DD
            const date = cell.value;
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            value = `${year}-${month}-${day}`;
          } else if (cell.type === ExcelJS.ValueType.RichText) {
            value = (cell.text || '').trim();
          } else if (cell.type === ExcelJS.ValueType.Formula) {
            // Handle date results from formulas
            if (cell.result instanceof Date) {
              const date = cell.result;
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              value = `${year}-${month}-${day}`;
            } else {
              value = (cell.result?.toString() || '').trim();
            }
          } else if (cell.type === ExcelJS.ValueType.Hyperlink) {
            // Handle hyperlinked emails - extract just the email text
            if (typeof cell.value === 'object' && cell.value.text) {
              value = cell.value.text.trim();
            } else if (typeof cell.value === 'object' && cell.value.target) {
              // If it's a mailto: link, extract just the email
              const target = cell.value.target;
              value = target.startsWith('mailto:') ? target.substring(7).trim() : target.trim();
            } else {
              value = cell.text?.trim() || '';
            }
          } else {
            // Handle plain text that might be an email
            const stringValue = cell.value.toString().trim();
            // If the cell has a hyperlink property, prefer the text content
            if (cell.hyperlink) {
              value = cell.text?.trim() || stringValue;
            } else {
              value = stringValue;
            }
          }
        } catch (cellError) {
          console.warn('Error reading cell:', cellError);
          value = '';
        }
        rowData.push(value);
      }

      // Ensure all rows have the same number of columns
      while (rowData.length < maxCells) {
        rowData.push('');
      }

      data.push(rowData);
    });

    return data;
  };

  const processFile = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      setError('Please select a valid XLSX file');
      trackEvent('conversion_error', 'File', 'Invalid file type');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File is too large (${sizeMB}MB). Maximum file size is 50MB.`);
      trackEvent('conversion_error', 'File', 'File too large', file.size);
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);
    setFileName(file.name.replace('.xlsx', ''));
    setSheetsData([]);
    setSelectedSheet(0);

    trackEvent('conversion_started', 'File', file.name, file.size);

    try {
      setProgressMessage('Reading file...');
      setProgress(10);

      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();

      setProgressMessage('Loading workbook...');
      setProgress(30);

      await workbook.xlsx.load(arrayBuffer);

      setProgressMessage('Processing sheets...');
      setProgress(50);

      const totalSheets = workbook.worksheets.length;
      const sheets = workbook.worksheets.map((worksheet, index) => {
        const sheetProgress = 50 + ((index + 1) / totalSheets) * 40;
        setProgress(Math.round(sheetProgress));
        setProgressMessage(`Processing sheet ${index + 1} of ${totalSheets}...`);

        const data = processSheet(worksheet);
        const csv = Papa.unparse(data, {
          quotes: false,
          delimiter: delimiter,
          quoteChar: '"',
          escapeChar: '"',
        });
        return {
          name: worksheet.name,
          data: data,
          csv: csv,
          rowCount: data.length
        };
      });

      setProgress(100);
      setProgressMessage('Conversion complete!');
      setSheetsData(sheets);

      trackEvent('conversion_success', 'File', file.name, sheets.length);
    } catch (error) {
      console.error('Detailed error:', error);
      const errorMsg = error.message || 'Error converting file';
      setError(errorMsg);
      trackEvent('conversion_error', 'File', errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 2000);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    await processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const regenerateCSV = (data) => {
    return Papa.unparse(data, {
      quotes: false,
      delimiter: delimiter,
      quoteChar: '"',
      escapeChar: '"',
    });
  };

  const downloadCSV = (sheetData, sheetName) => {
    const csv = regenerateCSV(sheetData.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    const delimiterName = delimiter === ',' ? 'csv' : delimiter === '\t' ? 'tsv' : 'csv';
    link.download = `${fileName}_${sheetName}.${delimiterName}`;
    link.click();

    trackEvent('download_sheet', 'Export', sheetName, sheetData.rowCount);
  };

  const downloadAllSheets = () => {
    sheetsData.forEach(sheet => {
      downloadCSV(sheet, sheet.name);
    });
    trackEvent('download_all', 'Export', 'All sheets', sheetsData.length);
  };

  return (
    <>
      <Helmet>
        <title>XLSX to CSV Converter</title>
        <meta name="description" content="Convert your XLSX files to CSV format easily and quickly with our online converter." />
        <meta name="keywords" content="XLSX to CSV, online converter, file conversion" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Replace with your logo */}
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">XC</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900">XLSX Converter</h1>
              </div>
              <nav className="flex space-x-4">
                <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
                <a href="#how-it-works" className="text-gray-500 hover:text-gray-900">How it works</a>
                <a href="#contact" className="text-gray-500 hover:text-gray-900">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Convert Excel Files to CSV
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast, secure, and free Excel to CSV converter. Works with multiple sheets, 
              handles complex formats, and runs entirely in your browser.
            </p>
          </div>

          {/* Main Converter Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 mb-12">
            <div className="space-y-6">
              {/* File Upload Section */}
              <div
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {isDragging ? 'Drop your file here' : 'Drag and drop your XLSX file here or click to browse'}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Maximum file size: 50MB
                </p>
              </div>

              {/* Delimiter Selector */}
              {!loading && sheetsData.length === 0 && (
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <label className="font-medium text-gray-700">Delimiter:</label>
                  <select
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    className="border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {loading && (
                <div className="space-y-4 py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">{progressMessage || 'Converting...'}</span>
                  </div>
                  {progress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                  {progress > 0 && (
                    <p className="text-center text-sm text-gray-500">{progress}%</p>
                  )}
                </div>
              )}

              {/* Sheets Section */}
              {sheetsData.length > 0 && (
                <div className="space-y-6">
                  {/* Delimiter Selector for Export */}
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                    <label className="font-medium text-gray-700">Export Delimiter:</label>
                    <select
                      value={delimiter}
                      onChange={(e) => setDelimiter(e.target.value)}
                      className="border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=",">Comma (,) - CSV</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab - TSV</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>

                  {/* Sheet Controls */}
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex-1 flex items-center space-x-4">
                        <label className="font-medium whitespace-nowrap text-gray-700">Sheet:</label>
                        <select
                          value={selectedSheet}
                          onChange={(e) => setSelectedSheet(Number(e.target.value))}
                          className="flex-1 border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {sheetsData.map((sheet, index) => (
                            <option key={index} value={index}>
                              {sheet.name} ({sheet.rowCount} rows)
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => downloadCSV(sheetsData[selectedSheet], sheetsData[selectedSheet].name)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download Sheet
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={downloadAllSheets}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Download All Sheets
                    </button>
                  </div>

                  {/* Preview Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      Preview: {sheetsData[selectedSheet].name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Showing first 100 rows of {sheetsData[selectedSheet].rowCount} total rows
                    </p>
                    <div className="overflow-x-auto border rounded-lg bg-white">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200">
                          {sheetsData[selectedSheet].data.slice(0, 100).map((row, rowIndex) => (
                            <tr 
                              key={rowIndex} 
                              className={rowIndex === 0 
                                ? "bg-gray-50 font-medium" 
                                : "hover:bg-gray-50 transition-colors"}
                            >
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <section id="features" className="py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Multiple Sheets</h3>
                <p className="text-gray-600">Convert all sheets at once or select individual sheets for conversion.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-gray-600">All conversion happens in your browser. Your files never leave your device.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-2">Fast & Free</h3>
                <p className="text-gray-600">Convert files instantly with no size limits. Always free to use.</p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload File</h3>
                <p className="text-gray-600">Select your XLSX file</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Preview</h3>
                <p className="text-gray-600">Review your data</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Select Sheets</h3>
                <p className="text-gray-600">Choose sheets to convert</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Download</h3>
                <p className="text-gray-600">Get your CSV files</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Product</h2>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#features" className="text-base text-gray-500 hover:text-gray-900">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="text-base text-gray-500 hover:text-gray-900">
                      How it works
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h2>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy-policy" className="text-base text-gray-500 hover:text-gray-900">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-and-conditions" className="text-base text-gray-500 hover:text-gray-900">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact</h2>
                <p className="mt-4 text-base text-gray-500">
                  Questions? Reach out at{' '}
                  <a href="mailto:contact@xlsx2csv.com" className="text-blue-600 hover:text-blue-500">
                    contact@xlsx2csv.com
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-base text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Company. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default XLSXConverter;