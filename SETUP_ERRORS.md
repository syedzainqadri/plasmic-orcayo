# Plasmic Development Setup: Common Errors and Solutions

This document lists the errors encountered during the Plasmic development setup process and their solutions for future reference.

## 1. Makefile Error: Can't Write to Generated Parser File

**Error Message:**
```
Can't write to file "src/wab/gen/modelPegParser.js".
make: *** [src/wab/gen/modelPegParser.js] Error 1
```

**Cause:** The directory for generated parser files (`platform/wab/src/wab/gen`) didn't exist, or the file was missing/protected.

**Solution:**
```bash
# Create the directory for generated files
mkdir -p platform/wab/src/wab/gen
```

## 2. Makefile Error: Missing Copilot Internal Makefile

**Error Message:**
```
make[1]: *** No targets specified and no makefile found.  Stop.
make: *** [src/wab/shared/copilot/internal/.] Error 2
```

**Cause:** The copilot internal directory doesn't contain a Makefile or the directory structure is incomplete.

**Solution:** This error is non-critical and doesn't prevent the main application from running. The core functionality continues to work without the copilot internal components.

## 3. Backend Server Port Not Immediately Available

**Issue:** Port 3004 (backend server) not immediately accessible after running `yarn dev`

**Cause:** The backend server may take longer to initialize than frontend services.

**Solution:** Wait a few more seconds after starting `yarn dev` for the backend to fully boot up.

## 4. PostgreSQL Connection Issues

**Potential Issue:** Connection errors if database/user doesn't exist

**Solution:** Ensure PostgreSQL is running and create the required database and user:
```bash
createdb -h localhost wab
# Add the 'wab' user if needed
```

## 5. Dependency Resolution Warnings

**Issue:** Multiple peer dependency warnings during installation

**Cause:** Version mismatches between required and installed packages

**Solution:** These are typically non-critical warnings that don't affect functionality. Most warnings relate to React version requirements and UI library dependencies.

## 6. Circular Dependencies Warning

**Issue:** Circular dependency warnings during build process

**Solution:** These are informational warnings and don't prevent the build from completing successfully.

## 7. Module Level Directives

**Issue:** Warnings about 'use client' directives being ignored when bundled

**Solution:** These are informational warnings and don't affect functionality of the built application.

## General Troubleshooting Tips

1. **If servers don't start properly:** Kill existing processes and restart:
   ```bash
   pkill -f plasmic  # or kill specific process IDs
   yarn dev
   ```

2. **If you encounter permission errors:** Ensure you have write permissions to the project directory.

3. **Memory issues:** The Plasmic project is very large and requires significant memory (8GB+ recommended). If experiencing issues, consider building components separately.

4. **File watching issues:** If file changes aren't detected, use the `CHOKIDAR_USEPOLLING=true` environment variable.