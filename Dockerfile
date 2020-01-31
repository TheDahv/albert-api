FROM python:3.8.1

WORKDIR /usr/src/app

COPY ./transformers ./transformers
RUN cd ./transformers && pip install .

COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r ./requirements.txt

COPY ./src ./src

ENV FLASK_APP "src/api.py"
CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0" ]
