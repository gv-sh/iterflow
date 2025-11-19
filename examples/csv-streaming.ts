import { iter } from '../src/index.js';

/**
 * CSV Streaming and Transformation Example
 *
 * Demonstrates:
 * - Parsing CSV data line by line
 * - Data validation and cleaning
 * - Type conversion and normalization
 * - Aggregations and grouping
 * - Data enrichment and transformation
 * - Output formatting
 */

// Simulated CSV data (employees)
const csvData = `id,name,department,salary,hire_date,performance_score
101,Alice Johnson,Engineering,95000,2020-03-15,4.5
102,Bob Smith,Sales,72000,2019-07-22,3.8
103,Carol White,Engineering,105000,2018-01-10,4.9
104,David Brown,Marketing,68000,2021-05-01,3.5
105,Eve Davis,Sales,78000,2020-11-30,4.2
106,Frank Miller,Engineering,92000,2021-02-14,4.1
107,Grace Lee,Marketing,71000,2019-09-05,4.0
108,Henry Wilson,Sales,85000,2018-12-20,4.6
109,Ivy Martinez,Engineering,98000,2020-06-18,4.3
110,Jack Taylor,Marketing,65000,2022-01-10,3.7
111,Kate Anderson,Sales,80000,2021-08-25,4.4
112,Leo Thomas,Engineering,110000,2017-04-12,4.8`;

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  hireDate: Date;
  performanceScore: number;
}

console.log('=== CSV Streaming and Transformation Example ===\n');

// 1. Parse CSV data
function parseCSV(csvText: string): Employee[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return iter(lines)
    .drop(1) // Skip header row
    .map(line => {
      const values = line.split(',');
      return {
        id: parseInt(values[0]),
        name: values[1],
        department: values[2],
        salary: parseInt(values[3]),
        hireDate: new Date(values[4]),
        performanceScore: parseFloat(values[5])
      };
    })
    .toArray();
}

const employees = parseCSV(csvData);

console.log(`Loaded ${employees.length} employee records\n`);

// 2. Data validation - filter out invalid entries
const validEmployees = iter(employees)
  .filter(emp => emp.salary > 0)
  .filter(emp => emp.performanceScore >= 1 && emp.performanceScore <= 5)
  .filter(emp => !isNaN(emp.hireDate.getTime()))
  .toArray();

console.log(`Valid records: ${validEmployees.length}/${employees.length}\n`);

// 3. Group by department and calculate statistics
const departmentStats = iter(validEmployees)
  .groupBy(emp => emp.department)
  .map(([dept, emps]) => ({
    department: dept,
    count: emps.length,
    avgSalary: iter(emps).map(e => e.salary).mean(),
    minSalary: iter(emps).map(e => e.salary).min(),
    maxSalary: iter(emps).map(e => e.salary).max(),
    avgPerformance: iter(emps).map(e => e.performanceScore).mean(),
    totalPayroll: iter(emps).map(e => e.salary).sum()
  }))
  .sortBy((a, b) => b.totalPayroll - a.totalPayroll)
  .toArray();

console.log('Department Statistics:');
departmentStats.forEach(stat => {
  console.log(`\n${stat.department}:`);
  console.log(`  Employees: ${stat.count}`);
  console.log(`  Avg Salary: $${stat.avgSalary.toFixed(2)}`);
  console.log(`  Salary Range: $${stat.minSalary} - $${stat.maxSalary}`);
  console.log(`  Avg Performance: ${stat.avgPerformance.toFixed(2)}/5.0`);
  console.log(`  Total Payroll: $${stat.totalPayroll.toLocaleString()}`);
});
console.log('');

// 4. Top performers (performance score >= 4.5)
const topPerformers = iter(validEmployees)
  .filter(emp => emp.performanceScore >= 4.5)
  .sortBy((a, b) => b.performanceScore - a.performanceScore)
  .toArray();

console.log('Top Performers (score >= 4.5):');
topPerformers.forEach(emp => {
  console.log(`  ${emp.name} (${emp.department}): ${emp.performanceScore}/5.0`);
});
console.log('');

// 5. Salary analysis with percentiles
const salaries = iter(validEmployees)
  .map(emp => emp.salary)
  .sort((a, b) => a - b)
  .toArray();

const salaryStats = {
  mean: iter(salaries).mean(),
  median: iter(salaries).median(),
  quartiles: iter(salaries).quartiles(),
  p90: iter(salaries).percentile(90),
  stdDev: iter(salaries).stdDev()
};

console.log('Salary Analysis:');
console.log(`  Mean: $${salaryStats.mean.toFixed(2)}`);
console.log(`  Median: $${salaryStats.median.toFixed(2)}`);
console.log(`  Q1 (25th): $${salaryStats.quartiles.Q1.toFixed(2)}`);
console.log(`  Q3 (75th): $${salaryStats.quartiles.Q3.toFixed(2)}`);
console.log(`  90th Percentile: $${salaryStats.p90.toFixed(2)}`);
console.log(`  Std Dev: $${salaryStats.stdDev.toFixed(2)}`);
console.log('');

// 6. Tenure analysis - years since hire date
const today = new Date();
const employeesWithTenure = iter(validEmployees)
  .map(emp => ({
    ...emp,
    tenureYears: (today.getTime() - emp.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
  }))
  .toArray();

const avgTenure = iter(employeesWithTenure)
  .map(e => e.tenureYears)
  .mean();

const seniorEmployees = iter(employeesWithTenure)
  .filter(emp => emp.tenureYears >= 5)
  .sortBy((a, b) => b.tenureYears - a.tenureYears)
  .toArray();

console.log('Tenure Analysis:');
console.log(`  Average Tenure: ${avgTenure.toFixed(1)} years`);
console.log(`  Senior Employees (>=5 years): ${seniorEmployees.length}`);
if (seniorEmployees.length > 0) {
  console.log('  Longest Tenure:', seniorEmployees[0].name, `(${seniorEmployees[0].tenureYears.toFixed(1)} years)`);
}
console.log('');

// 7. Salary bands distribution
const salaryBands = [
  { name: 'Entry', min: 0, max: 70000 },
  { name: 'Mid', min: 70000, max: 90000 },
  { name: 'Senior', min: 90000, max: 110000 },
  { name: 'Lead', min: 110000, max: Infinity }
];

const bandDistribution = iter(salaryBands)
  .map(band => ({
    band: band.name,
    count: iter(validEmployees)
      .filter(emp => emp.salary >= band.min && emp.salary < band.max)
      .count(),
    avgPerformance: iter(validEmployees)
      .filter(emp => emp.salary >= band.min && emp.salary < band.max)
      .map(emp => emp.performanceScore)
      .mean() || 0
  }))
  .toArray();

console.log('Salary Band Distribution:');
bandDistribution.forEach(({ band, count, avgPerformance }) => {
  const bar = '█'.repeat(count * 2);
  console.log(`  ${band.padEnd(6)}: ${bar} (${count} employees, avg perf: ${avgPerformance.toFixed(2)})`);
});
console.log('');

// 8. Transform to enriched CSV output
const enrichedData = iter(employeesWithTenure)
  .map(emp => ({
    ...emp,
    salaryBand: salaryBands.find(b => emp.salary >= b.min && emp.salary < b.max)?.name || 'Unknown',
    performanceRating: emp.performanceScore >= 4.5 ? 'Excellent' :
                       emp.performanceScore >= 4.0 ? 'Good' :
                       emp.performanceScore >= 3.5 ? 'Satisfactory' : 'Needs Improvement',
    tenureCategory: emp.tenureYears >= 5 ? 'Senior' :
                    emp.tenureYears >= 2 ? 'Experienced' : 'New'
  }))
  .toArray();

console.log('Sample Enriched Records (first 3):');
enrichedData.slice(0, 3).forEach(emp => {
  console.log(`\n${emp.name}:`);
  console.log(`  Department: ${emp.department}`);
  console.log(`  Salary: $${emp.salary.toLocaleString()} (${emp.salaryBand})`);
  console.log(`  Performance: ${emp.performanceScore}/5.0 (${emp.performanceRating})`);
  console.log(`  Tenure: ${emp.tenureYears.toFixed(1)} years (${emp.tenureCategory})`);
});
console.log('');

// 9. Department comparison matrix
const deptComparison = iter(departmentStats)
  .map(dept => {
    const deptEmps = validEmployees.filter(e => e.department === dept.department);
    return {
      department: dept.department,
      headcount: dept.count,
      avgSalary: dept.avgSalary,
      avgPerformance: dept.avgPerformance,
      topPerformerCount: deptEmps.filter(e => e.performanceScore >= 4.5).length,
      avgTenure: iter(employeesWithTenure)
        .filter(e => e.department === dept.department)
        .map(e => e.tenureYears)
        .mean()
    };
  })
  .toArray();

console.log('Department Comparison:');
console.log('Dept          | Count | Avg Salary | Avg Perf | Top Perf | Avg Tenure');
console.log('--------------|-------|------------|----------|----------|------------');
deptComparison.forEach(d => {
  console.log(
    `${d.department.padEnd(13)} | ${d.headcount.toString().padStart(5)} | ` +
    `$${d.avgSalary.toFixed(0).padStart(9)} | ` +
    `${d.avgPerformance.toFixed(2).padStart(8)} | ` +
    `${d.topPerformerCount.toString().padStart(8)} | ` +
    `${d.avgTenure.toFixed(1).padStart(8)}y`
  );
});
console.log('');

// 10. Export filtered and sorted data (simulation)
const exportData = iter(validEmployees)
  .filter(emp => emp.performanceScore >= 4.0)
  .sortBy((a, b) => b.salary - a.salary)
  .map(emp => `${emp.id},${emp.name},${emp.department},${emp.salary},${emp.performanceScore}`)
  .toArray();

console.log(`Export ready: ${exportData.length} high-performing employees`);
console.log('First 3 export lines:');
console.log('id,name,department,salary,performance_score');
exportData.slice(0, 3).forEach(line => console.log(line));
