import { iter } from '../src/index.js';

/**
 * Statistical Analysis Workflow Example
 *
 * Demonstrates:
 * - Comprehensive statistical analysis
 * - Distribution analysis
 * - Correlation and covariance
 * - Outlier detection
 * - Data normalization and standardization
 * - Multi-variable analysis
 * - Statistical testing workflows
 */

// Dataset: Student test scores across multiple subjects
interface StudentScore {
  studentId: string;
  name: string;
  math: number;
  science: number;
  english: number;
  history: number;
  studyHours: number;
  attendance: number; // percentage
}

const studentData: StudentScore[] = [
  { studentId: 'S001', name: 'Alice', math: 92, science: 88, english: 85, history: 90, studyHours: 25, attendance: 95 },
  { studentId: 'S002', name: 'Bob', math: 78, science: 82, english: 79, history: 75, studyHours: 15, attendance: 88 },
  { studentId: 'S003', name: 'Carol', math: 95, science: 94, english: 92, history: 93, studyHours: 30, attendance: 98 },
  { studentId: 'S004', name: 'David', math: 68, science: 72, english: 70, history: 65, studyHours: 10, attendance: 75 },
  { studentId: 'S005', name: 'Eve', math: 85, science: 87, english: 83, history: 86, studyHours: 20, attendance: 92 },
  { studentId: 'S006', name: 'Frank', math: 72, science: 75, english: 78, history: 74, studyHours: 12, attendance: 82 },
  { studentId: 'S007', name: 'Grace', math: 88, science: 90, english: 87, history: 89, studyHours: 22, attendance: 94 },
  { studentId: 'S008', name: 'Henry', math: 65, science: 68, english: 72, history: 70, studyHours: 8, attendance: 70 },
  { studentId: 'S009', name: 'Ivy', math: 90, science: 92, english: 88, history: 91, studyHours: 24, attendance: 96 },
  { studentId: 'S010', name: 'Jack', math: 80, science: 79, english: 82, history: 78, studyHours: 18, attendance: 85 },
  { studentId: 'S011', name: 'Kate', math: 94, science: 96, english: 93, history: 95, studyHours: 28, attendance: 99 },
  { studentId: 'S012', name: 'Leo', math: 70, science: 73, english: 75, history: 72, studyHours: 11, attendance: 80 },
  { studentId: 'S013', name: 'Mia', math: 86, science: 84, english: 89, history: 87, studyHours: 21, attendance: 93 },
  { studentId: 'S014', name: 'Noah', math: 76, science: 80, english: 77, history: 79, studyHours: 16, attendance: 86 },
  { studentId: 'S015', name: 'Olivia', math: 91, science: 89, english: 90, history: 88, studyHours: 26, attendance: 97 }
];

console.log('=== Statistical Analysis Workflow Example ===\n');
console.log(`Analyzing ${studentData.length} student records...\n`);

// 1. Descriptive Statistics for Each Subject
const subjects = ['math', 'science', 'english', 'history'] as const;

console.log('=== Descriptive Statistics by Subject ===\n');

const subjectStats = subjects.map(subject => {
  const scores = iter(studentData).map(s => s[subject]).toArray();

  return {
    subject,
    count: scores.length,
    mean: iter(scores).mean(),
    median: iter(scores).median(),
    mode: iter(scores).mode(),
    min: iter(scores).min(),
    max: iter(scores).max(),
    range: iter(scores).span(),
    variance: iter(scores).variance(),
    stdDev: iter(scores).stdDev(),
    quartiles: iter(scores).quartiles()
  };
});

subjectStats.forEach(stat => {
  console.log(`${stat.subject.toUpperCase()}:`);
  console.log(`  Count: ${stat.count}`);
  console.log(`  Mean: ${stat.mean.toFixed(2)}`);
  console.log(`  Median: ${stat.median.toFixed(2)}`);
  console.log(`  Mode: ${stat.mode.join(', ')}`);
  console.log(`  Range: ${stat.min} - ${stat.max} (span: ${stat.range})`);
  console.log(`  Std Dev: ${stat.stdDev.toFixed(2)}`);
  console.log(`  Quartiles: Q1=${stat.quartiles.Q1.toFixed(2)}, Q2=${stat.quartiles.Q2.toFixed(2)}, Q3=${stat.quartiles.Q3.toFixed(2)}`);
  console.log('');
});

// 2. Student Overall Performance
const studentPerformance = iter(studentData)
  .map(student => ({
    name: student.name,
    average: iter([student.math, student.science, student.english, student.history]).mean(),
    total: student.math + student.science + student.english + student.history,
    studyHours: student.studyHours,
    attendance: student.attendance
  }))
  .sortBy((a, b) => b.average - a.average)
  .toArray();

console.log('=== Student Performance Rankings ===\n');
studentPerformance.forEach((student, index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${student.name.padEnd(8)} - Avg: ${student.average.toFixed(2)}, Total: ${student.total}, Study: ${student.studyHours}h, Attendance: ${student.attendance}%`);
});
console.log('');

// 3. Correlation Analysis - Study Hours vs Performance
const mathScores = iter(studentData).map(s => s.math).toArray();
const studyHours = iter(studentData).map(s => s.studyHours).toArray();
const attendanceRates = iter(studentData).map(s => s.attendance).toArray();

const correlations = {
  studyVsMath: iter(studyHours).correlation(mathScores),
  attendanceVsMath: iter(attendanceRates).correlation(mathScores),
  mathVsScience: iter(mathScores).correlation(iter(studentData).map(s => s.science).toArray()),
  mathVsEnglish: iter(mathScores).correlation(iter(studentData).map(s => s.english).toArray())
};

console.log('=== Correlation Analysis ===\n');
console.log('Pearson Correlation Coefficients:');
console.log(`  Study Hours vs Math: ${correlations.studyVsMath.toFixed(3)}`);
console.log(`  Attendance vs Math: ${correlations.attendanceVsMath.toFixed(3)}`);
console.log(`  Math vs Science: ${correlations.mathVsScience.toFixed(3)}`);
console.log(`  Math vs English: ${correlations.mathVsEnglish.toFixed(3)}`);
console.log('');

// 4. Covariance Analysis
const covariances = {
  studyVsMath: iter.zip(studyHours, mathScores).covariance(),
  mathVsScience: iter.zip(mathScores, iter(studentData).map(s => s.science).toArray()).covariance()
};

console.log('=== Covariance Analysis ===\n');
console.log(`  Study Hours vs Math: ${covariances.studyVsMath.toFixed(2)}`);
console.log(`  Math vs Science: ${covariances.mathVsScience.toFixed(2)}`);
console.log('');

// 5. Outlier Detection using IQR Method
function detectOutliers(data: number[], label: string) {
  const sorted = iter(data).sort((a, b) => a - b).toArray();
  const q = iter(sorted).quartiles();
  const iqr = q.Q3 - q.Q1;
  const lowerBound = q.Q1 - 1.5 * iqr;
  const upperBound = q.Q3 + 1.5 * iqr;

  const outliers = iter(data)
    .filter(value => value < lowerBound || value > upperBound)
    .toArray();

  return { outliers, lowerBound, upperBound };
}

console.log('=== Outlier Detection (IQR Method) ===\n');
subjects.forEach(subject => {
  const scores = iter(studentData).map(s => s[subject]).toArray();
  const result = detectOutliers(scores, subject);

  console.log(`${subject.toUpperCase()}:`);
  console.log(`  Bounds: [${result.lowerBound.toFixed(2)}, ${result.upperBound.toFixed(2)}]`);
  console.log(`  Outliers: ${result.outliers.length > 0 ? result.outliers.join(', ') : 'None'}`);
});
console.log('');

// 6. Z-Score Normalization
function calculateZScores(data: number[]): number[] {
  const mean = iter(data).mean();
  const stdDev = iter(data).stdDev();

  return iter(data)
    .map(value => (value - mean) / stdDev)
    .toArray();
}

const mathZScores = calculateZScores(mathScores);

console.log('=== Z-Score Analysis (Math Scores) ===\n');
console.log('Students with exceptional performance (|z| > 1.5):');
iter(studentData)
  .enumerate()
  .filter(([i, _]) => Math.abs(mathZScores[i]) > 1.5)
  .map(([i, student]) => ({
    name: student.name,
    score: student.math,
    zScore: mathZScores[i]
  }))
  .toArray()
  .forEach(s => {
    console.log(`  ${s.name}: ${s.score} (z = ${s.zScore.toFixed(2)})`);
  });
console.log('');

// 7. Percentile Analysis
const percentiles = [10, 25, 50, 75, 90, 95];

console.log('=== Percentile Distribution (Math Scores) ===\n');
percentiles.forEach(p => {
  const value = iter(mathScores).percentile(p);
  console.log(`  ${p}th percentile: ${value.toFixed(2)}`);
});
console.log('');

// 8. Performance Categories
const categories = {
  excellent: { min: 90, max: 100, label: 'Excellent' },
  good: { min: 80, max: 90, label: 'Good' },
  satisfactory: { min: 70, max: 80, label: 'Satisfactory' },
  needsImprovement: { min: 0, max: 70, label: 'Needs Improvement' }
};

const performanceDistribution = Object.values(categories).map(cat => ({
  category: cat.label,
  count: iter(studentData)
    .filter(s => {
      const avg = iter([s.math, s.science, s.english, s.history]).mean();
      return avg >= cat.min && avg < cat.max;
    })
    .count()
}));

console.log('=== Performance Distribution ===\n');
performanceDistribution.forEach(dist => {
  const percentage = (dist.count / studentData.length * 100).toFixed(1);
  const bar = '█'.repeat(dist.count);
  console.log(`  ${dist.category.padEnd(20)}: ${bar} (${dist.count} students, ${percentage}%)`);
});
console.log('');

// 9. Multi-Subject Analysis - Find strengths and weaknesses
const studentAnalysis = iter(studentData)
  .map(student => {
    const scores = {
      math: student.math,
      science: student.science,
      english: student.english,
      history: student.history
    };

    const entries = Object.entries(scores);
    const strongest = iter(entries).sortBy(([_, score], [__, score2]) => score2 - score).first();
    const weakest = iter(entries).sortBy(([_, score], [__, score2]) => score - score2).first();

    return {
      name: student.name,
      average: iter(Object.values(scores)).mean(),
      strongest: strongest ? { subject: strongest[0], score: strongest[1] } : null,
      weakest: weakest ? { subject: weakest[0], score: weakest[1] } : null,
      consistency: iter(Object.values(scores)).stdDev()
    };
  })
  .toArray();

console.log('=== Individual Student Analysis ===\n');
studentAnalysis.slice(0, 5).forEach(analysis => {
  console.log(`${analysis.name}:`);
  console.log(`  Average: ${analysis.average.toFixed(2)}`);
  console.log(`  Strongest: ${analysis.strongest?.subject} (${analysis.strongest?.score})`);
  console.log(`  Weakest: ${analysis.weakest?.subject} (${analysis.weakest?.score})`);
  console.log(`  Consistency (σ): ${analysis.consistency.toFixed(2)}`);
  console.log('');
});

// 10. Statistical Summary Report
const overallStats = {
  totalStudents: studentData.length,
  overallAverage: iter(studentPerformance).map(s => s.average).mean(),
  highestAverage: iter(studentPerformance).first()?.average,
  lowestAverage: iter(studentPerformance).last()?.average,
  avgStudyHours: iter(studentData).map(s => s.studyHours).mean(),
  avgAttendance: iter(studentData).map(s => s.attendance).mean(),
  topPerformers: iter(studentPerformance).filter(s => s.average >= 90).count(),
  needsSupport: iter(studentPerformance).filter(s => s.average < 75).count()
};

console.log('=== Overall Statistical Summary ===');
console.log('');
console.log('Class Overview:');
console.log(`  Total Students: ${overallStats.totalStudents}`);
console.log(`  Overall Average: ${overallStats.overallAverage.toFixed(2)}`);
console.log(`  Highest Average: ${overallStats.highestAverage?.toFixed(2)}`);
console.log(`  Lowest Average: ${overallStats.lowestAverage?.toFixed(2)}`);
console.log(`  Range: ${(overallStats.highestAverage! - overallStats.lowestAverage!).toFixed(2)}`);
console.log('');
console.log('Engagement Metrics:');
console.log(`  Avg Study Hours/Week: ${overallStats.avgStudyHours.toFixed(2)}`);
console.log(`  Avg Attendance: ${overallStats.avgAttendance.toFixed(2)}%`);
console.log('');
console.log('Performance Categories:');
console.log(`  Top Performers (≥90): ${overallStats.topPerformers} students`);
console.log(`  Needs Support (<75): ${overallStats.needsSupport} students`);
console.log('');
console.log('Key Insights:');
console.log(`  • Study hours strongly correlate with math scores (r = ${correlations.studyVsMath.toFixed(3)})`);
console.log(`  • Math and Science scores are highly correlated (r = ${correlations.mathVsScience.toFixed(3)})`);
console.log(`  • ${overallStats.topPerformers} students (${(overallStats.topPerformers / overallStats.totalStudents * 100).toFixed(1)}%) are performing excellently`);

// 11. Comparative Analysis - Top vs Bottom Performers
const topHalf = iter(studentPerformance)
  .take(Math.floor(studentPerformance.length / 2))
  .toArray();

const bottomHalf = iter(studentPerformance)
  .drop(Math.floor(studentPerformance.length / 2))
  .toArray();

console.log('');
console.log('Top vs Bottom Half Comparison:');
console.log(`  Top Half Avg Study Hours: ${iter(topHalf).map(s => s.studyHours).mean().toFixed(2)}h`);
console.log(`  Bottom Half Avg Study Hours: ${iter(bottomHalf).map(s => s.studyHours).mean().toFixed(2)}h`);
console.log(`  Top Half Avg Attendance: ${iter(topHalf).map(s => s.attendance).mean().toFixed(2)}%`);
console.log(`  Bottom Half Avg Attendance: ${iter(bottomHalf).map(s => s.attendance).mean().toFixed(2)}%`);
