main: start-offline

start-offline:
	@echo "[INFO] Starting Offline Server"
	@NODE_ENV=development \
	serverless offline
