@echo off
REM TimeDancers Meditation App - E2E Test Runner (Windows)
REM This script builds the app and runs all E2E test suites

setlocal enabledelayedexpansion

REM Default values
set SKIP_BUILD=false
set VERBOSE=false
set SUITE=
set SKIP_UNIT=false

REM Parse command line arguments
:parse_args
if "%~1"=="" goto end_parse
if "%~1"=="--skip-build" (
    set SKIP_BUILD=true
    shift
    goto parse_args
)
if "%~1"=="--verbose" (
    set VERBOSE=true
    shift
    goto parse_args
)
if "%~1"=="--suite" (
    set SUITE=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--skip-unit" (
    set SKIP_UNIT=true
    shift
    goto parse_args
)
if "%~1"=="--help" (
    echo Usage: %0 [OPTIONS]
    echo.
    echo Options:
    echo   --skip-build    Skip the build step (use existing build^)
    echo   --skip-unit     Skip unit tests (run only E2E tests^)
    echo   --verbose       Run tests with verbose output
    echo   --suite SUITE   Run only specific suite (onboarding^|meditation^|settings^)
    echo   --help          Show this help message
    echo.
    echo Examples:
    echo   %0                          # Build and run all tests
    echo   %0 --skip-build             # Run all tests without building
    echo   %0 --suite meditation       # Run only meditation tests
    echo   %0 --verbose --suite settings # Run settings tests with verbose output
    exit /b 0
)
echo Unknown option: %~1
echo Use --help for usage information
exit /b 1

:end_parse

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root directory.
    exit /b 1
)

REM Check if detox is available
where detox >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Detox CLI not found. Please install it globally:
    echo npm install -g detox-cli
    exit /b 1
)

echo.
echo ================================
echo  TimeDancers Meditation Test Runner
echo ================================
echo.

REM Build the app if not skipping
if "%SKIP_BUILD%"=="false" (
    echo [INFO] Building app for testing...
    call npm run detox:build
    if errorlevel 1 (
        echo [ERROR] App build failed
        exit /b 1
    )
    echo [SUCCESS] App build completed successfully
) else (
    echo [WARNING] Skipping build step as requested
)

REM Run unit tests first (unless skipping or running specific E2E suite)
if "%SKIP_UNIT%"=="false" (
    if "%SUITE%"=="" (
        echo.
        echo ================================
        echo  Running Unit Tests
        echo ================================
        echo.
        echo [INFO] Executing unit test suite...
        
        call npm test
        if errorlevel 1 (
            echo [ERROR] Unit tests failed ❌
            set UNIT_TESTS_PASSED=false
        ) else (
            echo [SUCCESS] Unit tests passed ✅
            set UNIT_TESTS_PASSED=true
        )
        
        echo [INFO] Waiting 2 seconds before E2E tests...
        timeout /t 2 /nobreak >nul
    ) else (
        echo [WARNING] Skipping unit tests (running specific E2E suite^)
        set UNIT_TESTS_PASSED=true
    )
) else (
    echo [WARNING] Skipping unit tests as requested
    set UNIT_TESTS_PASSED=true
)

REM Prepare detox command options
set DETOX_OPTS=-c ios.debug
if "%VERBOSE%"=="true" (
    set DETOX_OPTS=!DETOX_OPTS! --loglevel verbose
)

REM Initialize counters
set TOTAL_SUITES=0
set PASSED_SUITES=0
set FAILED_SUITES=

REM Run specific suite or all suites
if not "%SUITE%"=="" (
    set TOTAL_SUITES=1
    if "%SUITE%"=="onboarding" (
        call :run_test_suite "Onboarding" "e2e/onboarding.e2e.ts"
    ) else if "%SUITE%"=="meditation" (
        call :run_test_suite "Meditation" "e2e/meditation.e2e.ts"
    ) else if "%SUITE%"=="settings" (
        call :run_test_suite "Settings" "e2e/settings.e2e.ts"
    ) else (
        echo [ERROR] Unknown test suite: %SUITE%
        echo Available suites: onboarding, meditation, settings
        exit /b 1
    )
) else (
    echo [INFO] Running all E2E test suites...
    set TOTAL_SUITES=3
    
    call :run_test_suite "Onboarding" "e2e/onboarding.e2e.ts"
    timeout /t 2 /nobreak >nul
    
    call :run_test_suite "Meditation" "e2e/meditation.e2e.ts"
    timeout /t 2 /nobreak >nul
    
    call :run_test_suite "Settings" "e2e/settings.e2e.ts"
)

REM Print final results
echo.
echo ================================
echo  Test Results Summary
echo ================================
echo.

if %PASSED_SUITES%==%TOTAL_SUITES% (
    echo [SUCCESS] All %TOTAL_SUITES% test suite(s^) passed! 🎉
    echo Test run completed successfully
    exit /b 0
) else (
    set /a FAILED_COUNT=%TOTAL_SUITES%-%PASSED_SUITES%
    echo [ERROR] !FAILED_COUNT! out of %TOTAL_SUITES% test suite(s^) failed
    
    if not "%FAILED_SUITES%"=="" (
        echo Failed suites: %FAILED_SUITES%
    )
    
    echo.
    echo Tips for debugging:
    echo   • Check test artifacts in e2e/artifacts/
    echo   • Run with --verbose flag for detailed logs
    echo   • Run individual suites with --suite ^<name^>
    echo   • Reset iOS simulator if tests behave unexpectedly
    
    exit /b 1
)

:run_test_suite
set suite_name=%~1
set test_file=%~2

echo.
echo ================================
echo  Running %suite_name% Tests
echo ================================
echo.
echo [INFO] Test file: %test_file%

detox test %DETOX_OPTS% "%test_file%"
if errorlevel 1 (
    echo [ERROR] %suite_name% tests failed ❌
    set FAILED_SUITES=!FAILED_SUITES! %suite_name%
) else (
    echo [SUCCESS] %suite_name% tests passed ✅
    set /a PASSED_SUITES+=1
)
goto :eof
