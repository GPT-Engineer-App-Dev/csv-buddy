import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash, Save } from "lucide-react";
import Papa from "papaparse";

const CsvTool = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [newRow, setNewRow] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        },
      });
    }
  };

  const handleInputChange = (event, rowIndex, columnName) => {
    const newData = [...data];
    newData[rowIndex][columnName] = event.target.value;
    setData(newData);
  };

  const handleNewRowChange = (event, columnName) => {
    const newRowData = { ...newRow, [columnName]: event.target.value };
    setNewRow(newRowData);
  };

  const handleAddRow = () => {
    setData([...data, newRow]);
    setNewRow({});
  };

  const handleDeleteRow = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">CSV Management Tool</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <TableCell key={colIndex}>
                      <Input
                        value={row[header]}
                        onChange={(event) => handleInputChange(event, rowIndex, header)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteRow(rowIndex)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>
                    <Input
                      value={newRow[header] || ""}
                      onChange={(event) => handleNewRowChange(event, header)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="outline" size="icon" onClick={handleAddRow}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button className="mt-4" onClick={handleDownload}>
            <Save className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </>
      )}
    </div>
  );
};

export default CsvTool;