COMPOSE = docker compose -f infrastructure/docker-compose.yml

.PHONY: install lint typecheck format-check check build serve down clean

install:
	$(COMPOSE) run --rm install

lint:
	$(COMPOSE) run --rm lint

typecheck:
	$(COMPOSE) run --rm typecheck

format-check:
	$(COMPOSE) run --rm format-check

check: lint typecheck format-check

build:
	$(COMPOSE) run --rm build
	$(COMPOSE) build serve

serve: build
	$(COMPOSE) up serve

down:
	$(COMPOSE) down

clean:
	$(COMPOSE) down --rmi all --volumes --remove-orphans
