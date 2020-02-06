IMAGE = huggingface-albert-api
CACHE_VOLUME = albert-model-cache

.PHONY : build cachevolume run run-repl run-sh transformers

cachevolume:
	@docker volume create $(CACHE_VOLUME)

transformers:
	if [ -z "$(ls -A transformers)" ]; \
	then \
		git submodule update --init transformers; \
	fi

build: transformers
	@docker build -t $(IMAGE) .

run: build
	@docker run \
		-v "$(PWD)/src":/usr/app/src \
		-v $(CACHE_VOLUME):/usr/cache \
		-p 5000:5000 \
		--rm \
		-it $(IMAGE)

run-repl: build
	@docker run \
		-v "$(PWD)/src":/usr/app/src \
		-v $(CACHE_VOLUME):/usr/cache \
		--rm \
		-it $(IMAGE) \
		python

run-sh: build
	@docker run \
		-v "$(PWD)/src/":/usr/app/src \
		-v $(CACHE_VOLUME):/usr/cache \
		--rm \
		-it $(IMAGE) \
		bash
