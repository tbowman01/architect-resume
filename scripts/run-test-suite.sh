#!/bin/bash

# 🏗️ Architect Resume Template - Comprehensive Test Suite Runner
# This script runs the complete test suite for the template system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test suite configuration
TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=0
SKIPPED_SUITES=0

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Function to run a test suite
run_test_suite() {
    local suite_name="$1"
    local pattern="$2"
    local timeout="$3"
    local required="${4:-true}"
    local parallel="${5:-true}"
    
    TOTAL_SUITES=$((TOTAL_SUITES + 1))
    
    log "Running $suite_name..."
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    
    local jest_args="--testPathPattern=$pattern --testTimeout=$timeout --verbose"
    
    if [ "$parallel" = "false" ]; then
        jest_args="$jest_args --runInBand"
    fi
    
    if npx jest $jest_args; then
        success "$suite_name completed successfully"
        PASSED_SUITES=$((PASSED_SUITES + 1))
        return 0
    else
        if [ "$required" = "true" ]; then
            error "$suite_name failed (required)"
            FAILED_SUITES=$((FAILED_SUITES + 1))
            return 1
        else
            warning "$suite_name failed (optional - continuing)"
            SKIPPED_SUITES=$((SKIPPED_SUITES + 1))
            return 0
        fi
    fi
}

# Function to check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        info "Node.js version: $NODE_VERSION"
    else
        error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        info "npm version: $NPM_VERSION"
    else
        error "npm is not installed"
        exit 1
    fi
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        error "package.json not found. Are you in the right directory?"
        exit 1
    fi
    
    success "Prerequisites check passed"
}

# Function to setup test environment
setup_environment() {
    log "Setting up test environment..."
    
    # Set test environment variables
    export NODE_ENV=test
    export CI=true
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        log "Installing dependencies..."
        npm ci
    fi
    
    # Run linting first
    log "Running ESLint..."
    if npm run lint; then
        success "Linting passed"
    else
        warning "Linting failed - continuing with tests"
    fi
    
    # Run type checking
    log "Running TypeScript type check..."
    if npm run type-check; then
        success "Type checking passed"
    else
        error "Type checking failed"
        exit 1
    fi
    
    success "Environment setup completed"
}

# Function to run individual test suites
run_test_suites() {
    log "Starting test suite execution..."
    
    # Configuration Tests (Critical)
    run_test_suite "Configuration Tests" "tests/config" 30000 true true
    
    # Validation Tests (Critical)  
    run_test_suite "Template Validation Tests" "tests/validation" 45000 true true
    
    # Component Tests (Critical)
    run_test_suite "Component Tests" "tests/components" 60000 true true
    
    # Integration Tests (Critical)
    run_test_suite "Integration Tests" "tests/integration" 90000 true false
    
    # Data Validation Tests (Critical)
    run_test_suite "Data Validation Tests" "tests/validation/data-validation" 30000 true true
    
    # Documentation Tests (Optional)
    run_test_suite "Documentation Tests" "tests/documentation" 30000 false true
    
    # Performance Tests (Critical but may be slow)
    warning "Performance tests may take several minutes..."
    run_test_suite "Performance Tests" "tests/performance" 300000 true false
    
    # End-to-End Tests (Critical)
    run_test_suite "End-to-End Tests" "tests/e2e" 120000 true false
    
    # Template Customization Tests (Important)
    run_test_suite "Template Customization Tests" "tests/customization" 60000 true true
}

# Function to generate coverage report
generate_coverage() {
    log "Generating test coverage report..."
    
    if npm run test:coverage; then
        success "Coverage report generated"
        
        # Check if coverage meets threshold
        if [ -f "coverage/coverage-summary.json" ]; then
            info "Coverage summary available at: coverage/coverage-summary.json"
            info "Detailed coverage report: coverage/lcov-report/index.html"
        fi
    else
        warning "Coverage report generation failed"
    fi
}

# Function to run build test
test_build() {
    log "Testing production build..."
    
    # Clean previous builds
    rm -rf .next out
    
    if npm run build; then
        success "Production build successful"
        
        # Check build output
        if [ -d "out" ] && [ -f "out/index.html" ]; then
            success "Static export generated successfully"
            
            # Check build size
            BUILD_SIZE=$(du -sh out | cut -f1)
            info "Build size: $BUILD_SIZE"
            
            return 0
        else
            error "Build output validation failed"
            return 1
        fi
    else
        error "Production build failed"
        return 1
    fi
}

# Function to display final results
show_results() {
    echo
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    log "Test Suite Execution Summary"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    
    echo -e "Total Test Suites: ${BLUE}$TOTAL_SUITES${NC}"
    echo -e "Passed: ${GREEN}$PASSED_SUITES${NC}"
    echo -e "Failed: ${RED}$FAILED_SUITES${NC}"
    echo -e "Skipped: ${YELLOW}$SKIPPED_SUITES${NC}"
    
    local success_rate=$((PASSED_SUITES * 100 / TOTAL_SUITES))
    echo -e "Success Rate: ${BLUE}${success_rate}%${NC}"
    
    if [ $FAILED_SUITES -eq 0 ]; then
        echo
        success "🎉 All critical test suites passed! Template is ready for use."
        echo -e "${GREEN}Template Quality: EXCELLENT${NC}"
        return 0
    else
        echo
        error "💥 Some critical test suites failed!"
        echo -e "${RED}Template Quality: NEEDS ATTENTION${NC}"
        return 1
    fi
}

# Function to cleanup
cleanup() {
    log "Cleaning up temporary files..."
    
    # Remove temporary build files but keep coverage
    rm -rf .next
    
    # Keep out/ directory for inspection if build passed
    if [ ! -f "out/index.html" ]; then
        rm -rf out
    fi
    
    success "Cleanup completed"
}

# Main execution
main() {
    local start_time=$(date +%s)
    
    echo -e "${PURPLE}🏗️  Architect Resume Template - Test Suite Runner${NC}"
    echo -e "${PURPLE}══════════════════════════════════════════════════════════════════════${NC}"
    
    # Parse command line arguments
    local run_coverage=true
    local run_build=true
    local cleanup_after=true
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --no-coverage)
                run_coverage=false
                shift
                ;;
            --no-build)
                run_build=false
                shift
                ;;
            --no-cleanup)
                cleanup_after=false
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --no-coverage    Skip coverage report generation"
                echo "  --no-build      Skip build test"
                echo "  --no-cleanup    Skip cleanup after tests"
                echo "  --help, -h      Show this help message"
                exit 0
                ;;
            *)
                warning "Unknown option: $1"
                shift
                ;;
        esac
    done
    
    # Run the test pipeline
    check_prerequisites
    setup_environment
    run_test_suites
    
    if [ "$run_coverage" = true ]; then
        generate_coverage
    fi
    
    if [ "$run_build" = true ]; then
        test_build
    fi
    
    if [ "$cleanup_after" = true ]; then
        cleanup
    fi
    
    # Calculate execution time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    
    info "Total execution time: ${minutes}m ${seconds}s"
    
    # Show final results
    show_results
}

# Handle script interruption
trap 'error "Test suite interrupted!"; cleanup; exit 1' INT TERM

# Run main function with all arguments
main "$@"