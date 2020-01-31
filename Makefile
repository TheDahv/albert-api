IMAGE = huggingface-albert-api
CACHE_VOLUME = albert-model-cache

.PHONY : build cachevolume run run-repl run-sh

cachevolume:
	@docker volume create $(CACHE_VOLUME)

tranformers:
	@git submodule update checkout

build: transformers
	@docker build -t $(IMAGE) .

run: build
	@docker run \
		-v $(CACHE_VOLUME):/usr/src/cache \
		--rm \
		-it $(IMAGE)

run-repl: build
	@docker run \
		-v $(CACHE_VOLUME):/usr/src/cache \
		--rm \
		-it $(IMAGE) \
		python

run-sh: build
	@docker run \
		-v $(CACHE_VOLUME):/usr/src/cache \
		--rm \
		-it $(IMAGE) \
		bash
