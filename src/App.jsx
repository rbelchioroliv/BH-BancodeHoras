import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import './app.css';

function App() {
  const [rows, setRows] = useState([
    { data: '', credito: '00:00:00', debito: '00:00:00', subtotal: 0, total: 0 }
  ]);
  const [employeeName, setEmployeeName] = useState(''); 


  const timeToDecimal = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const decimal = hours + minutes / 60 + seconds / 3600;
    return decimal || 0;
  };


  const decimalToTime = (decimal) => {
    const hours = Math.floor(decimal);
    const minutes = Math.floor((decimal - hours) * 60);
    const seconds = Math.round(((decimal - hours) * 60 - minutes) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleAddRow = () => {
    const newRow = { data: '', credito: '00:00:00', debito: '00:00:00', subtotal: 0, total: 0 };
    setRows([...rows, newRow]);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    const row = { ...newRows[index] };


    if (field === 'credito' || field === 'debito') {
      row[field] = value || '00:00:00';
      row.subtotal = timeToDecimal(row.credito) - timeToDecimal(row.debito);
    } else {
      row[field] = value;
    }

    row.total = index === 0 ? row.subtotal : row.subtotal + newRows[index - 1].total;
    newRows[index] = row;
    setRows(newRows);
  };

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Banco de Horas');

    
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = `${employeeName}`;
    worksheet.getCell('A1').style = {
      font: { bold: true },
      alignment: { horizontal: 'center' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } }
    };

   
    worksheet.addRow(['Data', 'Crédito (hh:mm:ss)', 'Débito (hh:mm:ss)', 'Subtotal', 'Total']);
    ['A', 'B', 'C', 'D', 'E'].forEach((col, i) => {
      worksheet.getCell(`${col}2`).style = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A9A9A9' } }
      };
    });


    rows.forEach(row => {
      worksheet.addRow([
        row.data,
        decimalToTime(timeToDecimal(row.credito)),
        decimalToTime(timeToDecimal(row.debito)),
        row.subtotal.toFixed(2),
        row.total.toFixed(2)
      ]);
    });


    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'banco_de_horas.xlsx');
  };

  return (
    <div className="container">
      <h1 className="fixed-header">Cálculo de Banco de Horas</h1>

      

      <button id='button' onClick={handleAddRow}>Adicionar Linha</button>
      
      <div className="employee-input">
        <input
          type="text"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          placeholder="Nome do Funcionário"
        />
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>Data</th>
            <th>Crédito (hh:mm:ss)</th>
            <th>Débito (hh:mm:ss)</th>
            <th>Subtotal</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="date"
                  value={row.data}
                  onChange={(e) => handleChange(index, 'data', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  step="1"
                  value={row.credito}
                  onChange={(e) => handleChange(index, 'credito', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="time"
                  step="1"
                  value={row.debito}
                  onChange={(e) => handleChange(index, 'debito', e.target.value)}
                />
              </td>
              <td>{row.subtotal.toFixed(2)}</td>
              <td>{row.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button id='button' onClick={handleExport}>Exportar para Excel</button>
    </div>
  );
}

export default App;
