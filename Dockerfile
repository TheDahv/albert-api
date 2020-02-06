FROM python:3.8.1

WORKDIR /usr/app

COPY ./transformers ./transformers
RUN cd ./transformers && pip install .

COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r ./requirements.txt

# Development: only build the deps. The code is mounted to the container at
# run-time so it can be edited on the host and changes made available inside the
# running container.
#
# You are required to run the container with source code in a Docker volume
# mounted to "./src":
# docker run -v $(pwd)/src:/usr/app/src --rm -it $IMAGE
ENV FLASK_ENV "development"
ENV FLASK_APP "src/api.py"
CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0" ]

# "Production" build steps:
# TODO do this the Right Way
#COPY ./src ./src
#ENV FLASK_APP "src/api.py"
#CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0" ]
