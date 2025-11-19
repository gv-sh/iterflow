# iterflow Examples

Practical examples demonstrating iterflow's capabilities.

## Running Examples

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Run any example with ts-node or compile and run
npx tsx examples/basic-stats.ts
npx tsx examples/moving-average.ts
npx tsx examples/fibonacci.ts
npx tsx examples/chaining.ts
npx tsx examples/react-hooks.ts
npx tsx examples/vue-composables.ts
npx tsx examples/nodejs-streams.ts
npx tsx examples/web-streams.ts
npx tsx examples/rxjs-interop.ts
npx tsx examples/express-middleware.ts
npx tsx examples/fastify-plugin.ts
npx tsx examples/time-series-analysis.ts
npx tsx examples/log-processing.ts
npx tsx examples/csv-streaming.ts
npx tsx examples/json-pipeline.ts
npx tsx examples/realtime-filtering.ts
npx tsx examples/statistical-workflow.ts
```

## Basic Examples

### basic-stats.ts
Basic statistical operations like mean, median, sum, min, and max.

### moving-average.ts
Calculate moving averages using sliding windows - useful for time series data.

### fibonacci.ts
Working with infinite sequences - demonstrates lazy evaluation by filtering even Fibonacci numbers.

### chaining.ts
Real-world data processing pipeline showing filtering, mapping, and aggregation on sales data.

## Framework Integration Examples

### react-hooks.ts
React hooks integration examples showing how to use iterflow in custom React hooks for:
- Filtered user lists with statistics
- Paginated data processing
- Real-time data aggregation
- Infinite scroll data management

### vue-composables.ts
Vue 3 composables integration examples demonstrating:
- Product list filtering and sorting
- Search functionality with statistics
- Data table with grouping
- Statistical analysis composables
- Virtual list data processing

### nodejs-streams.ts
Node.js streams integration showing how to use iterflow with Node.js streams:
- Converting iterables to readable streams
- Creating transform streams with iterflow operations
- Log processing and filtering
- Metrics aggregation
- Batch processing with backpressure

### web-streams.ts
Web Streams API integration demonstrating:
- Converting iterables to ReadableStream
- Creating TransformStreams with iterflow
- Event filtering and processing
- Sensor data aggregation
- Moving averages on streams
- Deduplication and batching

### rxjs-interop.ts
RxJS interoperability examples showing:
- Converting between Observables and iterables
- When to use iterflow vs RxJS
- Statistical analysis workflows
- Combining iterflow with reactive patterns
- Batch processing with Observables

### express-middleware.ts
Express.js middleware integration examples:
- Request analytics tracking
- Query parameter validation
- Response data aggregation
- Rate limiting with statistics
- Batch operation processing

### fastify-plugin.ts
Fastify plugin integration examples:
- Analytics plugin for request tracking
- Data processing with aggregation
- Pagination plugin
- Statistics calculations
- Batch processing utilities
- Time series analysis

## Advanced Data Processing Examples

### time-series-analysis.ts
Comprehensive time series analysis demonstrating:
- Simple Moving Average (SMA) and Exponential Moving Average (EMA)
- Bollinger Bands calculation
- Price change analysis and volatility metrics
- Trend detection and pattern recognition
- Resistance and support level identification
- Complete statistical summary of time series data

### log-processing.ts
Log file processing and parsing workflows:
- Structured log entry parsing and validation
- Filtering by log level and component
- Error pattern detection and clustering
- Performance metrics extraction
- Time-based activity analysis
- Anomaly detection in log streams
- Comprehensive log analysis reporting

### csv-streaming.ts
CSV data streaming and transformation:
- Efficient CSV parsing and validation
- Data cleaning and type conversion
- Department and salary band analysis
- Statistical aggregations and grouping
- Tenure and performance correlations
- Data enrichment and categorization
- Export formatting and filtering

### json-pipeline.ts
Complex JSON data pipeline processing:
- Nested JSON structure flattening
- Multi-stage data transformations
- Product and category sales analysis
- Customer behavior analytics
- Shipping and geographic analysis
- Order aggregation and enrichment
- Business metrics calculation

### realtime-filtering.ts
Real-time data stream filtering and analysis:
- Sensor data stream processing
- Anomaly detection with threshold filtering
- Stream deduplication and compression
- Sliding window pattern detection
- Multi-sensor correlation analysis
- Rate-of-change calculations
- Stream throttling and sampling

### statistical-workflow.ts
Advanced statistical analysis workflows:
- Comprehensive descriptive statistics
- Correlation and covariance analysis
- Outlier detection using IQR method
- Z-score normalization and analysis
- Percentile distribution calculations
- Multi-variable comparative analysis
- Performance categorization and reporting
