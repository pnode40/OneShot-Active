@echo off
echo Running OneShot MVP System Verification
echo ======================================
cd oneshot-mvp
echo.
echo Running lint check...
call npm run lint
echo.
echo Running health check...
call npm run health
echo.
echo Running simplicity check...
call npm run simplicity
echo.
echo System verification complete!
cd .. 