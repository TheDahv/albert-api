# To evaluate this file in a REPL:
# exec(open("./src/albert.py").read())

from transformers import AlbertTokenizer, AlbertForQuestionAnswering
import torch


def load_model():
    # Other models to try: albert-large-v2, albert-xlarge-v2
    # https://huggingface.co/transformers/pretrained_models.html
    pretrained = 'albert-base-v2'
    tokenizer = AlbertTokenizer.from_pretrained(
        pretrained, do_lower_case=True)
    model = AlbertForQuestionAnswering.from_pretrained(
        pretrained, cache_dir="/usr/src/cache")
    return model, tokenizer


def get_answer(context, question):
    model, tokenizer = load_model()
    input_dict = tokenizer.encode_plus(question, context, return_tensors='pt')
    start_scores, end_scores = model(**input_dict)

    all_tokens = tokenizer.convert_ids_to_tokens(input_dict['input_ids'][0])
    res = all_tokens[torch.argmax(start_scores): torch.argmax(end_scores)+1]

    return ' '.join(all_tokens[torch.argmax(start_scores):
                               torch.argmax(end_scores)+1])
