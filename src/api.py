import albert
import hashlib
import base64
from flask import Flask, escape, jsonify, request, render_template

app = Flask(__name__)

documents = {}


@app.route("/")
def serve_app():
    return render_template('index.html')


@app.route("/documents", methods=['POST'])
def add_context():
    text = request.data

    m = hashlib.sha256(text)
    id = base64.urlsafe_b64encode(m.digest()[:10])
    documents[id] = text

    return id


@app.route("/documents/<string:id>/answer")
def answer(id):
    _id = bytes(id, 'utf-8')
    if _id not in documents.keys():
        return "No document for that ID", 404

    question = request.args.get("question")
    if not question:
        return "question parameter required"
    pretrained_model = request.args.get("model")
    if not pretrained_model:
        pretrained_model = 'albert-large-v2'

    document = documents[_id].decode('utf-8')

    model, tokenizer = albert.load_model(pretrained_model)
    answer = albert.get_answer(model, tokenizer, document, question)
    if not answer:
        return jsonify({
            'answer': "ALBERT was unable to answer the question",
            'scores': None,
            'probabilities': None,
        })

    result = albert.score_tokens(model, tokenizer, document, question)
    scores = albert.span_scores(*result)
    probabilities = albert.span_probabilities(*result)

    return jsonify({
        'answer': answer,
        'scores': scores,
        'probabilities': probabilities,
    })
