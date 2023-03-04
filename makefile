main: start-offline

start-offline:
	@echo "[INFO] Starting Offline Server"
	@NODE_ENV=development \
	serverless offline

deploy:
	@echo "[INFO] Deploying serverless project"
	@NODE_ENV=production \
	serverless deploy
