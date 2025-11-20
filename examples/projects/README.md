# Example Projects

This directory contains complete, standalone example projects demonstrating how to use iterflow in real-world applications.

## Available Projects

### 1. Starter Template
**Directory:** `starter-template/`
**Description:** A minimal starter project with TypeScript configuration and basic examples.
**Use case:** Quick start for new iterflow projects
**Technologies:** TypeScript, Node.js

### 2. Data Pipeline
**Directory:** `data-pipeline/`
**Description:** Complete ETL pipeline for processing large datasets
**Use case:** Data transformation, aggregation, and analysis
**Technologies:** TypeScript, Node.js, CSV/JSON processing

### 3. Web API with Express
**Directory:** `web-api-express/`
**Description:** RESTful API with iterflow for data processing
**Use case:** Building APIs with efficient data handling
**Technologies:** Express.js, TypeScript, Node.js

### 4. Real-time Dashboard
**Directory:** `realtime-dashboard/`
**Description:** Real-time data processing for dashboards
**Use case:** Stream processing and real-time analytics
**Technologies:** TypeScript, WebSockets, Browser

### 5. CLI Tool
**Directory:** `cli-tool/`
**Description:** Command-line tool for data analysis
**Use case:** Building CLI applications with iterflow
**Technologies:** TypeScript, Node.js, Commander.js

## Running Projects

Each project directory contains its own README with specific instructions. General steps:

```bash
# Navigate to project directory
cd examples/projects/starter-template

# Install dependencies
npm install

# Build the project
npm run build

# Run the project
npm start

# Run in development mode
npm run dev
```

## Creating Your Own Project

Use the starter template as a base:

```bash
# Copy the starter template
cp -r examples/projects/starter-template my-project
cd my-project

# Install dependencies
npm install

# Start coding!
```

## Project Structure

Each example project follows this structure:

```
project-name/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── src/
│   ├── index.ts         # Main entry point
│   └── ...              # Source files
├── README.md            # Project-specific documentation
└── .gitignore           # Git ignore rules
```

## Contributing Examples

Have a cool project using iterflow? We'd love to include it! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Support

- Check the main [README](../../README.md) for library documentation
- Visit [GitHub Discussions](https://github.com/gv-sh/iterflow/discussions) for help
- Report issues at [GitHub Issues](https://github.com/gv-sh/iterflow/issues)
