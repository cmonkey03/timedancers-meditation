#!/bin/bash

# TimeDancers Meditation App - E2E Test Runner
# This script builds the app and runs all E2E test suites

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if detox is available
if ! command -v detox &> /dev/null; then
    print_error "Detox CLI not found. Please install it globally:"
    echo "npm install -g detox-cli"
    exit 1
fi

# Parse command line arguments
SKIP_BUILD=false
VERBOSE=false
SUITE=""
SKIP_UNIT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --suite)
            SUITE="$2"
            shift 2
            ;;
        --skip-unit)
            SKIP_UNIT=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-build    Skip the build step (use existing build)"
            echo "  --skip-unit     Skip unit tests (run only E2E tests)"
            echo "  --verbose       Run tests with verbose output"
            echo "  --suite SUITE   Run only specific suite (onboarding|meditation|settings)"
            echo "  --help          Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                          # Build and run all tests"
            echo "  $0 --skip-build             # Run all tests without building"
            echo "  $0 --suite meditation       # Run only meditation tests"
            echo "  $0 --verbose --suite settings # Run settings tests with verbose output"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Start the test process
print_header "TimeDancers Meditation Test Runner"

# Build the app if not skipping
if [ "$SKIP_BUILD" = false ]; then
    print_status "Building app for testing..."
    if npm run detox:build; then
        print_success "App build completed successfully"
    else
        print_error "App build failed"
        exit 1
    fi
else
    print_warning "Skipping build step as requested"
fi

# Run unit tests first (unless skipping or running specific E2E suite)
if [ "$SKIP_UNIT" = false ] && [ -z "$SUITE" ]; then
    print_header "Running Unit Tests"
    print_status "Executing unit test suite..."
    
    if npm test; then
        print_success "Unit tests passed ✅"
        UNIT_TESTS_PASSED=true
    else
        print_error "Unit tests failed ❌"
        UNIT_TESTS_PASSED=false
    fi
    
    # Add a delay before E2E tests
    print_status "Waiting 2 seconds before E2E tests..."
    sleep 2
else
    if [ "$SKIP_UNIT" = true ]; then
        print_warning "Skipping unit tests as requested"
    else
        print_warning "Skipping unit tests (running specific E2E suite)"
    fi
    UNIT_TESTS_PASSED=true  # Don't count as failure if skipped
fi

# Prepare detox command options
DETOX_OPTS="-c ios.debug"
if [ "$VERBOSE" = true ]; then
    DETOX_OPTS="$DETOX_OPTS --loglevel verbose"
fi

# Function to run a specific test suite
run_test_suite() {
    local suite_name=$1
    local test_file=$2
    
    print_header "Running $suite_name Tests"
    print_status "Test file: $test_file"
    
    if detox test $DETOX_OPTS "$test_file"; then
        print_success "$suite_name tests passed ✅"
        return 0
    else
        print_error "$suite_name tests failed ❌"
        return 1
    fi
}

# Track test results
TOTAL_SUITES=0
PASSED_SUITES=0
FAILED_SUITES=()

# Run specific suite or all suites
if [ -n "$SUITE" ]; then
    case $SUITE in
        onboarding)
            TOTAL_SUITES=1
            if run_test_suite "Onboarding" "e2e/onboarding.e2e.ts"; then
                PASSED_SUITES=1
            else
                FAILED_SUITES+=("Onboarding")
            fi
            ;;
        meditation)
            TOTAL_SUITES=1
            if run_test_suite "Meditation" "e2e/meditation.e2e.ts"; then
                PASSED_SUITES=1
            else
                FAILED_SUITES+=("Meditation")
            fi
            ;;
        settings)
            TOTAL_SUITES=1
            if run_test_suite "Settings" "e2e/settings.e2e.ts"; then
                PASSED_SUITES=1
            else
                FAILED_SUITES+=("Settings")
            fi
            ;;
        *)
            print_error "Unknown test suite: $SUITE"
            echo "Available suites: onboarding, meditation, settings"
            exit 1
            ;;
    esac
else
    # Run all test suites
    print_status "Running all E2E test suites..."
    
    # Test suites to run (using arrays instead of associative arrays for compatibility)
    SUITE_NAMES=("Onboarding" "Meditation" "Settings")
    SUITE_FILES=("e2e/onboarding.e2e.ts" "e2e/meditation.e2e.ts" "e2e/settings.e2e.ts")
    
    TOTAL_SUITES=${#SUITE_NAMES[@]}
    
    for i in "${!SUITE_NAMES[@]}"; do
        suite_name="${SUITE_NAMES[$i]}"
        test_file="${SUITE_FILES[$i]}"
        
        if run_test_suite "$suite_name" "$test_file"; then
            ((PASSED_SUITES++))
        else
            FAILED_SUITES+=("$suite_name")
        fi
        
        # Add a small delay between test suites
        if [ $TOTAL_SUITES -gt 1 ] && [ $i -lt $((TOTAL_SUITES - 1)) ]; then
            print_status "Waiting 2 seconds before next test suite..."
            sleep 2
        fi
    done
fi

# Print final results
print_header "Test Results Summary"

# Calculate overall success
OVERALL_SUCCESS=true
if [ "$UNIT_TESTS_PASSED" = false ]; then
    OVERALL_SUCCESS=false
fi
if [ $PASSED_SUITES -ne $TOTAL_SUITES ]; then
    OVERALL_SUCCESS=false
fi

# Show unit test results if they were run
if [ "$SKIP_UNIT" = false ] && [ -z "$SUITE" ]; then
    if [ "$UNIT_TESTS_PASSED" = true ]; then
        echo -e "${GREEN}✅ Unit Tests: PASSED${NC}"
    else
        echo -e "${RED}❌ Unit Tests: FAILED${NC}"
    fi
fi

# Show E2E test results
if [ $TOTAL_SUITES -gt 0 ]; then
    if [ $PASSED_SUITES -eq $TOTAL_SUITES ]; then
        echo -e "${GREEN}✅ E2E Tests: All $TOTAL_SUITES suite(s) passed${NC}"
    else
        FAILED_COUNT=${#FAILED_SUITES[@]}
        echo -e "${RED}❌ E2E Tests: $FAILED_COUNT out of $TOTAL_SUITES suite(s) failed${NC}"
        
        if [ ${#FAILED_SUITES[@]} -gt 0 ]; then
            echo -e "${RED}Failed E2E suites:${NC}"
            for suite in "${FAILED_SUITES[@]}"; do
                echo -e "  ${RED}❌ $suite${NC}"
            done
        fi
    fi
fi

if [ "$OVERALL_SUCCESS" = true ]; then
    print_success "All tests passed! 🎉"
    echo -e "${GREEN}✅ Test run completed successfully${NC}"
    exit 0
else
    print_error "Some tests failed"
    
    echo -e "\n${YELLOW}💡 Tips for debugging:${NC}"
    echo "  • Check test artifacts in e2e/artifacts/ for E2E failures"
    echo "  • Run with --verbose flag for detailed logs"
    echo "  • Run individual suites with --suite <name>"
    echo "  • Use --skip-unit to run only E2E tests"
    echo "  • Reset iOS simulator if E2E tests behave unexpectedly"
    
    exit 1
fi
