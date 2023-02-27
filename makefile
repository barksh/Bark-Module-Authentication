main: start-offline

start-offline:
	@echo "[INFO] Starting Offline Server"
	@NODE_ENV=development \
	AUTHENTICATION_MONGO_DB=$(DB) \
	SECRET_KEY=$(SECRET) \
	serverless offline
