down:
	docker rm postgres-analytics-service

up:
	docker run --name postgres-analytics-service -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -e POSTGRES_DB=analytics-service-db postgres:14
