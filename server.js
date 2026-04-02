const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  next();
});

const DATA_FILE = path.join(__dirname, 'src/app/employee/employee.data.ts');

function parseEmployees() {
  const content = fs.readFileSync(DATA_FILE, 'utf8');
  const match = content.match(/export const EMPLOYEES: Employee\[\] = (\[[\s\S]*?\]);\s*$/m);
  if (!match) return [];
  // eslint-disable-next-line no-eval
  return eval(match[1]);
}

function writeEmployees(employees) {
  const content = fs.readFileSync(DATA_FILE, 'utf8');
  const json = JSON.stringify(employees, null, 2)
    .replace(/"([^"]+)":/g, '$1:')   // remove quotes from keys
    .replace(/"/g, "'");             // double quotes → single quotes
  const updated = content.replace(
    /export const EMPLOYEES: Employee\[\] = \[[\s\S]*?\];\s*$/m,
    `export const EMPLOYEES: Employee[] = ${json};\n`
  );
  fs.writeFileSync(DATA_FILE, updated, 'utf8');
}

app.get('/api/employees', (req, res) => {
  try {
    res.json(parseEmployees());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/employees', (req, res) => {
  try {
    const employees = parseEmployees();
    const newEmp = req.body;
    if (employees.find(e => e.id === newEmp.id)) {
      return res.status(400).json({ error: 'Employee ID already exists' });
    }
    employees.push(newEmp);
    writeEmployees(employees);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/employees/:id', (req, res) => {
  try {
    const employees = parseEmployees();
    const filtered = employees.filter(e => e.id !== req.params.id);
    if (filtered.length === employees.length) return res.status(404).json({ error: 'Not found' });
    writeEmployees(filtered);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Employee API running on http://localhost:3000'));
