import React, { useState } from 'react';
import { trackEvent } from '../utils/Analytics';
import * as ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Analytics from '../utils/Analytics';

const XLSXConverter = () => {
  const [sheetsData, setSheetsData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSheet, setSelectedSheet] = useState(0);

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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setFileName(file.name.replace('.xlsx', ''));
    setSheetsData([]);
    setSelectedSheet(0);

    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);
      
      const sheets = workbook.worksheets.map(worksheet => {
        const data = processSheet(worksheet);
        const csv = Papa.unparse(data, {
          quotes: false, // Disable quotes around fields
          delimiter: ',', // Use comma as delimiter
          quoteChar: '"', // Define quote character (will only be used when necessary)
          escapeChar: '"', // Define escape character for fields that actually contain commas or quotes
        });
        return {
          name: worksheet.name,
          data: data,
          csv: csv,
          rowCount: data.length
        };
      });

      setSheetsData(sheets);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message || 'Error converting file');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (csv, sheetName) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}_${sheetName}.csv`;
    link.click();
  };

  const downloadAllSheets = () => {
    sheetsData.forEach(sheet => {
      downloadCSV(sheet.csv, sheet.name);
    });
  };

  return (
    <>
      <Helmet>
        <title>XLSX to CSV Converter</title>
        <meta name="description" content="Convert your XLSX files to CSV format easily and quickly with our online converter." />
        <meta name="keywords" content="XLSX to CSV, online converter, file conversion" />
      </Helmet>
      <Analytics />
      <main className="max-w-3xl mx-auto">
        <section>
          <div>
            <h1 className="text-gray-600">Get your CSV files</h1>
            {/* Other content */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
    </>
  );
};

export default XLSXConverter;