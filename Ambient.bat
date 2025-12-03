@echo off
REM Configurando ambiente temporário do Node

set NODE_HOME=C:\Users\deiner.souza\Documents\nodejs\node-v24.11.0-win-x64

REM Adiciona Node e npm ao PATH da sessão
set PATH=%NODE_HOME%;%NODE_HOME%\node_modules\npm\bin;%PATH%

echo Ambiente temporário configurado.
echo Node path: %NODE_HOME%

REM Mostra versões para conferir
"%NODE_HOME%\node.exe" -v
"%NODE_HOME%\npm.cmd" -v

echo.
echo Iniciando projeto...
cd C:\Users\deiner.souza\Documents\react_native\seu-projeto

REM Usa npm via path absoluto para evitar erros
"%NODE_HOME%\npm.cmd" start

pause
	