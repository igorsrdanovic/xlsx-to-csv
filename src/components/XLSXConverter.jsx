import React, { useState } from 'react';
import * as ExcelJS from 'exceljs';
import Papa from 'papaparse';

const XLSXConverter = () => {
  const [sheetsData, setSheetsData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSheet, setSelectedSheet] = useState(0);

  const processSheet = (worksheet) => {
    const data = [];
    worksheet.eachRow((row) => {
      const rowData = [];
      row.eachCell((cell) => {
        let value = '';
        try {
          if (cell.value === null || cell.value === undefined) {
            value = '';
          } else if (cell.value instanceof Date) {
            value = cell.value.toISOString();
          } else if (cell.type === ExcelJS.ValueType.RichText) {
            value = cell.text || '';
          } else if (cell.type === ExcelJS.ValueType.Formula) {
            value = cell.result?.toString() || '';
          } else {
            value = cell.value.toString();
          }
        } catch (cellError) {
          console.warn('Error reading cell:', cellError);
          value = '';
        }
        rowData.push(value);
      });
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
        const csv = Papa.unparse(data);
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
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">XLSX to CSV Converter</h2>
      <div className="space-y-6">
        <div>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </div>

        {loading && (
          <div className="text-center py-4 text-gray-600">
            Converting...
          </div>
        )}

        {sheetsData.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 flex items-center space-x-4">
                  <label className="font-medium whitespace-nowrap">Select Sheet:</label>
                  <select
                    value={selectedSheet}
                    onChange={(e) => setSelectedSheet(Number(e.target.value))}
                    className="flex-1 border rounded-md px-3 py-2 bg-white"
                  >
                    {sheetsData.map((sheet, index) => (
                      <option key={index} value={index}>
                        {sheet.name} ({sheet.rowCount} rows)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => downloadCSV(sheetsData[selectedSheet].csv, sheetsData[selectedSheet].name)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    Download Current Sheet
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <button
                  onClick={downloadAllSheets}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Download All Sheets
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Preview: {sheetsData[selectedSheet].name} 
                (Showing first 100 rows of {sheetsData[selectedSheet].rowCount})
              </h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    {sheetsData[selectedSheet].data.slice(0, 100).map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex === 0 ? "bg-gray-50 font-medium" : ""}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
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
  );
};

export default XLSXConverter;