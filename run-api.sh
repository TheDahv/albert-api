#!/bin/bash
HOST=${HOST:-localhost:5000}

usage() {
  cat << EOF
Usage:

  load <filename>
    Loads a document and returns its ID

  ask <id> <question>
    Asks a question to see if ALBERT can answer it
    from the contents of the document identified by 'id'
EOF
}

ARG=$1
case "$ARG" in
  load)
    curl "$HOST/documents" \
      -XPOST \
      -H "Content-Type: application/text" \
      -d "@$2"
    ;;

  ask)
    id="$2"
    if [ -z "$id" ]
    then
      usage
      exit 1
    fi

    # Bash urlencoding: https://stackoverflow.com/a/10660730
    question="${@:3}"
    if [ -z "$question" ]
    then
      usage
      exit 1
    fi

    strlen=${#question}
    encoded=""
    #pos c o
    for (( pos=0 ; pos<strlen ; pos++ )); do
       c=${question:$pos:1}
       case "$c" in
          [-_.~a-zA-Z0-9] ) o="${c}" ;;
          * )               printf -v o '%%%02x' "'$c"
       esac
       encoded+="${o}"
    done

    curl "$HOST/documents/$id/answer?question=$encoded"
    ;;

  *)
    usage
esac
