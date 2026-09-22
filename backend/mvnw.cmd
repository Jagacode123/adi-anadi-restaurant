@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET ___MVNW_OUTCMD__=
@powershell -noprofile -executionpolicy bypass -file "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\MavenWrapperDownloader.ps1" %* 2>NUL
@IF "%ERRORLEVEL%"=="0" goto init
@ECHO Could not run PowerShell wrapper. Falling back to mvn if available.
mvn %*
goto end
:init
@SET MAVEN_PROJECTBASEDIR=%~dp0
:end
