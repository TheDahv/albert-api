# ALBERT API for Question Answering

An exploration in using Google's
[ALBERT](https://ai.googleblog.com/2019/12/albert-lite-bert-for-self-supervised.html)
method for training NLP models to build a question answering service.

The goal is to build an API that -- given some document text and a question --
can predict how well an algorithm can answer that question from a document.

This project leverages [Huggingface's
Transformers](https://huggingface.co/transformers/model_doc/albert.html)
implementation of the ALBERT model.

## Pre-Requisites

This project uses Docker to handle Python environments, networking, and the
like. Please ensure you have it [installed](https://docs.docker.com/install/) on
your machine.

## Setup

The project Makefile handles fetching dependencies, building Docker images, and
running the project.

Some helpful commands:

- `make run`: runs the Albert API service
- `make run-repl`: opens a Python REPL in the container with all the library
  dependencies installed and available
- `make run-sh`: opens a shell in the container with all the library
  dependencies installed and available
- `make build`: builds the Docker image
- `make transformers`: checks out the Huggingface transformers project
