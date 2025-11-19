import { iter } from '../src/index.js';

/**
 * Real-time Data Stream Filtering Example
 *
 * Demonstrates:
 * - Filtering event streams in real-time
 * - Pattern detection in data streams
 * - Sliding window analysis
 * - Anomaly detection
 * - Rate limiting and throttling simulation
 * - Stream deduplication
 */

// Simulate sensor data stream
interface SensorReading {
  timestamp: Date;
  sensorId: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'motion';
  value: number;
  unit: string;
  location: string;
}

// Generate simulated sensor data
function generateSensorData(): SensorReading[] {
  const data: SensorReading[] = [];
  const baseTime = new Date('2024-01-15T10:00:00Z');

  const sensors = [
    { id: 'TEMP-01', type: 'temperature' as const, unit: '°C', location: 'Room A' },
    { id: 'TEMP-02', type: 'temperature' as const, unit: '°C', location: 'Room B' },
    { id: 'HUM-01', type: 'humidity' as const, unit: '%', location: 'Room A' },
    { id: 'PRES-01', type: 'pressure' as const, unit: 'hPa', location: 'Room A' },
    { id: 'MOT-01', type: 'motion' as const, unit: 'events', location: 'Hallway' }
  ];

  for (let i = 0; i < 100; i++) {
    const sensor = sensors[i % sensors.length];
    const timestamp = new Date(baseTime.getTime() + i * 10000); // Every 10 seconds

    let value: number;
    switch (sensor.type) {
      case 'temperature':
        // Normal range 20-24°C, with occasional spikes
        value = 22 + Math.random() * 2 + (Math.random() > 0.9 ? 5 : 0);
        break;
      case 'humidity':
        // Normal range 40-60%
        value = 50 + Math.random() * 10 - 5;
        break;
      case 'pressure':
        // Normal range 1010-1020 hPa
        value = 1015 + Math.random() * 5 - 2.5;
        break;
      case 'motion':
        // Binary-ish 0 or 1, occasional bursts
        value = Math.random() > 0.7 ? 1 : 0;
        break;
    }

    data.push({
      timestamp,
      sensorId: sensor.id,
      type: sensor.type,
      value: parseFloat(value.toFixed(2)),
      unit: sensor.unit,
      location: sensor.location
    });
  }

  return data;
}

const sensorStream = generateSensorData();

console.log('=== Real-time Data Stream Filtering Example ===\n');
console.log(`Processing ${sensorStream.length} sensor readings...\n`);

// 1. Filter by sensor type
const temperatureReadings = iter(sensorStream)
  .filter(reading => reading.type === 'temperature')
  .toArray();

console.log('Temperature Readings:', temperatureReadings.length);
console.log('Sample:', temperatureReadings.slice(0, 3).map(r =>
  `${r.sensorId}: ${r.value}${r.unit} at ${r.timestamp.toTimeString().slice(0, 8)}`
));
console.log('');

// 2. Anomaly detection - values outside normal range
const temperatureAnomalies = iter(temperatureReadings)
  .filter(reading => reading.value > 26 || reading.value < 18)
  .toArray();

console.log('Temperature Anomalies (outside 18-26°C):');
temperatureAnomalies.forEach(a => {
  console.log(`  ${a.sensorId} at ${a.timestamp.toTimeString().slice(0, 8)}: ${a.value}${a.unit} (${a.location})`);
});
console.log('');

// 3. Deduplication - remove consecutive duplicate motion events
const motionReadings = iter(sensorStream)
  .filter(r => r.type === 'motion')
  .toArray();

const dedupedMotion = iter(motionReadings)
  .pairwise()
  .filter(([prev, curr]) => prev.value !== curr.value)
  .map(([_, curr]) => curr)
  .toArray();

console.log('Motion Events:');
console.log('  Raw events:', motionReadings.length);
console.log('  After deduplication:', dedupedMotion.length);
console.log('  Reduction:', ((1 - dedupedMotion.length / motionReadings.length) * 100).toFixed(1) + '%');
console.log('');

// 4. Sliding window analysis - detect sustained high temperature
const sustainedHighTemp = iter(temperatureReadings)
  .window(3)
  .filter(window => {
    const readings = Array.from(window);
    return readings.length === 3 && readings.every(r => r.value > 24);
  })
  .map(window => Array.from(window))
  .toArray();

console.log('Sustained High Temperature Periods (3+ consecutive readings > 24°C):');
console.log('  Detected:', sustainedHighTemp.length, 'periods');
if (sustainedHighTemp.length > 0) {
  const firstPeriod = sustainedHighTemp[0];
  console.log('  First period:', firstPeriod.map(r => r.value + r.unit).join(', '));
}
console.log('');

// 5. Rate calculation - changes per minute
const rateOfChange = iter(temperatureReadings)
  .pairwise()
  .map(([prev, curr]) => ({
    timestamp: curr.timestamp,
    sensorId: curr.sensorId,
    change: curr.value - prev.value,
    timeGap: (curr.timestamp.getTime() - prev.timestamp.getTime()) / 1000
  }))
  .toArray();

const significantChanges = iter(rateOfChange)
  .filter(change => Math.abs(change.change) > 2)
  .toArray();

console.log('Significant Temperature Changes (> 2°C):');
significantChanges.forEach(c => {
  console.log(`  ${c.sensorId} at ${c.timestamp.toTimeString().slice(0, 8)}: ${c.change > 0 ? '+' : ''}${c.change.toFixed(2)}°C`);
});
console.log('');

// 6. Multi-sensor correlation - find times when multiple conditions met
interface MultiSensorSnapshot {
  timestamp: Date;
  location: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  motion?: number;
}

// Group readings by time buckets (30 second windows)
const timeBuckets = iter(sensorStream)
  .groupBy(r => Math.floor(r.timestamp.getTime() / 30000))
  .map(([bucket, readings]) => {
    const snapshot: MultiSensorSnapshot = {
      timestamp: readings[0].timestamp,
      location: readings[0].location
    };

    readings.forEach(r => {
      if (r.type === 'temperature') snapshot.temperature = r.value;
      if (r.type === 'humidity') snapshot.humidity = r.value;
      if (r.type === 'pressure') snapshot.pressure = r.value;
      if (r.type === 'motion') snapshot.motion = r.value;
    });

    return snapshot;
  })
  .toArray();

// Find uncomfortable conditions (high temp + high humidity)
const uncomfortableConditions = iter(timeBuckets)
  .filter(s => s.temperature && s.humidity)
  .filter(s => s.temperature! > 24 && s.humidity! > 55)
  .toArray();

console.log('Uncomfortable Conditions (temp > 24°C AND humidity > 55%):');
console.log('  Detected:', uncomfortableConditions.length, 'time periods');
if (uncomfortableConditions.length > 0) {
  const example = uncomfortableConditions[0];
  console.log(`  Example: ${example.temperature}°C, ${example.humidity}% at ${example.timestamp.toTimeString().slice(0, 8)}`);
}
console.log('');

// 7. Top-N filter - highest values
const topTemperatures = iter(temperatureReadings)
  .sortBy((a, b) => b.value - a.value)
  .take(5)
  .toArray();

console.log('Top 5 Temperature Readings:');
topTemperatures.forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.value}${r.unit} - ${r.sensorId} (${r.location}) at ${r.timestamp.toTimeString().slice(0, 8)}`);
});
console.log('');

// 8. Pattern detection - rapid fluctuations
const fluctuations = iter(temperatureReadings)
  .window(4)
  .filter(window => {
    const readings = Array.from(window);
    if (readings.length < 4) return false;

    // Check for up-down-up or down-up-down pattern
    const changes = iter(readings)
      .pairwise()
      .map(([a, b]) => b.value - a.value)
      .toArray();

    return (changes[0] > 0 && changes[1] < 0 && changes[2] > 0) ||
           (changes[0] < 0 && changes[1] > 0 && changes[2] < 0);
  })
  .toArray();

console.log('Rapid Fluctuation Patterns Detected:', fluctuations.length);
console.log('');

// 9. Stream aggregation by location
const locationStats = iter(sensorStream)
  .groupBy(r => r.location)
  .map(([location, readings]) => {
    const tempReadings = readings.filter(r => r.type === 'temperature');
    const humReadings = readings.filter(r => r.type === 'humidity');

    return {
      location,
      readingCount: readings.length,
      avgTemp: tempReadings.length > 0 ? iter(tempReadings).map(r => r.value).mean() : null,
      avgHumidity: humReadings.length > 0 ? iter(humReadings).map(r => r.value).mean() : null,
      sensorTypes: iter(readings).map(r => r.type).distinct().toArray()
    };
  })
  .toArray();

console.log('Location Statistics:');
locationStats.forEach(loc => {
  console.log(`\n${loc.location}:`);
  console.log(`  Total Readings: ${loc.readingCount}`);
  if (loc.avgTemp) console.log(`  Avg Temperature: ${loc.avgTemp.toFixed(2)}°C`);
  if (loc.avgHumidity) console.log(`  Avg Humidity: ${loc.avgHumidity.toFixed(2)}%`);
  console.log(`  Sensor Types: ${loc.sensorTypes.join(', ')}`);
});
console.log('');

// 10. Simulated throttling - sample every Nth reading
const throttledStream = iter(sensorStream)
  .enumerate()
  .filter(([i, _]) => i % 5 === 0)
  .map(([_, reading]) => reading)
  .toArray();

console.log('Stream Throttling:');
console.log('  Original:', sensorStream.length, 'readings');
console.log('  Throttled (every 5th):', throttledStream.length, 'readings');
console.log('  Data reduction:', ((1 - throttledStream.length / sensorStream.length) * 100).toFixed(1) + '%');
console.log('');

// 11. Event-based filtering - motion detection with context
const motionEvents = iter(sensorStream)
  .filter(r => r.type === 'motion' && r.value === 1)
  .map(motionEvent => {
    // Find temperature reading around the same time
    const nearbyTemp = iter(temperatureReadings)
      .filter(t => Math.abs(t.timestamp.getTime() - motionEvent.timestamp.getTime()) < 15000)
      .first();

    return {
      time: motionEvent.timestamp,
      location: motionEvent.location,
      temperature: nearbyTemp?.value
    };
  })
  .toArray();

console.log('Motion Events with Temperature Context:');
console.log('  Total motion events:', motionEvents.length);
motionEvents.slice(0, 5).forEach(e => {
  const tempStr = e.temperature ? `${e.temperature}°C` : 'N/A';
  console.log(`  ${e.time.toTimeString().slice(0, 8)} in ${e.location} (temp: ${tempStr})`);
});
console.log('');

// 12. Real-time statistics summary
const realtimeStats = {
  totalReadings: sensorStream.length,
  uniqueSensors: iter(sensorStream).map(r => r.sensorId).distinct().count(),
  timeSpan: (iter(sensorStream).last()!.timestamp.getTime() - iter(sensorStream).first()!.timestamp.getTime()) / 1000,
  anomalyRate: (temperatureAnomalies.length / temperatureReadings.length * 100).toFixed(2),
  avgReadingsPerSensor: (sensorStream.length / iter(sensorStream).map(r => r.sensorId).distinct().count()).toFixed(1)
};

console.log('=== Real-time Stream Summary ===');
console.log('Total Readings:', realtimeStats.totalReadings);
console.log('Unique Sensors:', realtimeStats.uniqueSensors);
console.log('Time Span:', realtimeStats.timeSpan, 'seconds');
console.log('Temperature Anomaly Rate:', realtimeStats.anomalyRate + '%');
console.log('Avg Readings per Sensor:', realtimeStats.avgReadingsPerSensor);
