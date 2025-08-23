/**
 * Test Pipeline Configuration
 * This file configures the automated testing pipeline for CI/CD
 */

const testPipelineConfig = {
  // Test suites to run in order
  testSuites: [
    {
      name: 'Configuration Tests',
      pattern: 'tests/config/**/*.test.{js,ts}',
      timeout: 30000,
      parallel: true,
      required: true
    },
    {
      name: 'Validation Tests',
      pattern: 'tests/validation/**/*.test.{js,ts}',
      timeout: 45000,
      parallel: true,
      required: true
    },
    {
      name: 'Component Unit Tests',
      pattern: 'tests/components/**/*.test.{js,ts,tsx}',
      timeout: 60000,
      parallel: true,
      required: true
    },
    {
      name: 'Integration Tests',
      pattern: 'tests/integration/**/*.test.{js,ts,tsx}',
      timeout: 90000,
      parallel: false, // May have dependencies
      required: true
    },
    {
      name: 'Documentation Tests',
      pattern: 'tests/documentation/**/*.test.{js,ts}',
      timeout: 30000,
      parallel: true,
      required: false // Optional but recommended
    },
    {
      name: 'Performance Tests',
      pattern: 'tests/performance/**/*.test.{js,ts,tsx}',
      timeout: 300000, // 5 minutes for build tests
      parallel: false,
      required: true
    },
    {
      name: 'End-to-End Tests',
      pattern: 'tests/e2e/**/*.test.{js,ts}',
      timeout: 120000,
      parallel: false,
      required: true
    }
  ],

  // Coverage requirements
  coverage: {
    statements: 80,
    branches: 75,
    functions: 80,
    lines: 80,
    exclude: [
      'tests/**/*',
      'node_modules/**/*',
      '.next/**/*',
      'out/**/*',
      'coverage/**/*'
    ]
  },

  // Environment setup
  environment: {
    NODE_ENV: 'test',
    CI: 'true'
  },

  // Pre-test setup commands
  setup: [
    'npm install',
    'npm run lint',
    'npm run type-check'
  ],

  // Post-test cleanup
  cleanup: [
    'rm -rf .next',
    'rm -rf out',
    'rm -rf coverage/.tmp'
  ],

  // Reporting configuration
  reporting: {
    formats: ['json', 'lcov', 'text', 'html'],
    directory: 'coverage',
    reporters: ['default', 'json-summary']
  },

  // Performance benchmarks
  benchmarks: {
    buildTime: 180000, // 3 minutes max
    testSuiteTime: 600000, // 10 minutes max total
    memoryUsage: 1024 * 1024 * 512 // 512MB max
  },

  // Retry configuration
  retry: {
    times: 2,
    onlyFailures: true
  }
}

// GitHub Actions workflow configuration
const githubWorkflow = {
  name: 'Template Test Suite',
  on: {
    push: {
      branches: ['main', 'develop', 'feature/*']
    },
    pull_request: {
      branches: ['main', 'develop']
    }
  },
  jobs: {
    test: {
      'runs-on': 'ubuntu-latest',
      strategy: {
        matrix: {
          'node-version': ['18.x', '20.x', '22.x']
        }
      },
      steps: [
        {
          name: 'Checkout code',
          uses: 'actions/checkout@v4'
        },
        {
          name: 'Setup Node.js',
          uses: 'actions/setup-node@v4',
          with: {
            'node-version': '${{ matrix.node-version }}',
            'cache': 'npm'
          }
        },
        {
          name: 'Install dependencies',
          run: 'npm ci'
        },
        {
          name: 'Run linting',
          run: 'npm run lint'
        },
        {
          name: 'Run type checking',
          run: 'npm run type-check'
        },
        {
          name: 'Run test suite',
          run: 'npm run test:coverage'
        },
        {
          name: 'Run build test',
          run: 'npm run build'
        },
        {
          name: 'Upload coverage reports',
          uses: 'codecov/codecov-action@v3',
          with: {
            file: './coverage/lcov.info'
          }
        }
      ]
    }
  }
}

// Jest configuration for pipeline
const jestPipelineConfig = {
  preset: 'next/jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/out/'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/types/**/*',
    '!app/**/__tests__/**/*'
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  },
  maxWorkers: '50%',
  testTimeout: 60000
}

// Local development test script
const developmentTestScript = `#!/bin/bash

# Template Test Suite - Development Runner
echo "🏗️ Running Template Test Suite..."

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Function to run test suite with proper error handling
run_test_suite() {
  local suite_name="$1"
  local pattern="$2"
  local timeout="$3"
  
  echo -e "\\n${BLUE}Running $suite_name...${NC}"
  
  if npx jest --testPathPattern="$pattern" --testTimeout="$timeout" --verbose; then
    echo -e "${GREEN}✅ $suite_name passed${NC}"
    return 0
  else
    echo -e "${RED}❌ $suite_name failed${NC}"
    return 1
  fi
}

# Pre-test setup
echo -e "${YELLOW}Setting up test environment...${NC}"
npm run lint:fix
npm run type-check

# Initialize counters
total_suites=0
passed_suites=0

# Run each test suite
while IFS= read -r line; do
  if [[ $line =~ name:.*\'(.*)\' ]]; then
    suite_name="\${BASH_REMATCH[1]}"
  elif [[ $line =~ pattern:.*\'(.*)\' ]]; then
    pattern="\${BASH_REMATCH[1]}"
  elif [[ $line =~ timeout:.*([0-9]+) ]]; then
    timeout="\${BASH_REMATCH[1]}"
    
    # Run the test suite
    total_suites=$((total_suites + 1))
    if run_test_suite "$suite_name" "$pattern" "$timeout"; then
      passed_suites=$((passed_suites + 1))
    fi
  fi
done << 'EOF'
name: 'Configuration Tests', pattern: 'tests/config', timeout: 30000
name: 'Validation Tests', pattern: 'tests/validation', timeout: 45000
name: 'Component Tests', pattern: 'tests/components', timeout: 60000
name: 'Integration Tests', pattern: 'tests/integration', timeout: 90000
name: 'Documentation Tests', pattern: 'tests/documentation', timeout: 30000
name: 'Performance Tests', pattern: 'tests/performance', timeout: 300000
name: 'E2E Tests', pattern: 'tests/e2e', timeout: 120000
EOF

# Final report
echo -e "\\n${BLUE}Test Suite Summary:${NC}"
echo -e "Total suites: $total_suites"
echo -e "Passed: ${GREEN}$passed_suites${NC}"
echo -e "Failed: ${RED}$((total_suites - passed_suites))${NC}"

if [ $passed_suites -eq $total_suites ]; then
  echo -e "\\n${GREEN}🎉 All test suites passed!${NC}"
  exit 0
else
  echo -e "\\n${RED}💥 Some test suites failed!${NC}"
  exit 1
fi
`

module.exports = {
  testPipelineConfig,
  githubWorkflow,
  jestPipelineConfig,
  developmentTestScript
}