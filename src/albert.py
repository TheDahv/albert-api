# To evaluate this file in a REPL:
# exec(open("./src/albert.py").read())

from transformers import AlbertTokenizer, AlbertForQuestionAnswering
import torch


def load_model(pretrained_model):
    # Other models to try: albert-large-v2, albert-xlarge-v2
    # https://huggingface.co/transformers/pretrained_models.html
    tokenizer = AlbertTokenizer.from_pretrained(
        pretrained_model, do_lower_case=True)
    model = AlbertForQuestionAnswering.from_pretrained(
        pretrained_model, cache_dir="/usr/cache")
    return model, tokenizer


def get_answer(model, tokenizer, context, question):
    input_dict = tokenizer.encode_plus(question, context, return_tensors='pt')
    start_scores, end_scores = score_tokens(
        model, tokenizer, context, question)

    all_tokens = tokenizer.convert_ids_to_tokens(
        input_dict['input_ids'].squeeze(0))
    res = all_tokens[torch.argmax(start_scores): torch.argmax(end_scores)+1]

    return ' '.join(all_tokens[torch.argmax(start_scores):
                               torch.argmax(end_scores)+1])


def score_tokens(model, tokenizer, context, question):
    input_dict = tokenizer.encode_plus(question, context, return_tensors='pt')
    return model(**input_dict)


def span_scores(start_scores, end_scores):
    return (
        torch.index_select(start_scores.squeeze(0), 0,
                           torch.argmax(start_scores)).item(),
        torch.index_select(end_scores.squeeze(0), 0,
                           torch.argmax(end_scores)).item(),
    )


def span_probabilities(start_scores, end_scores):
    start_probabilities = torch.nn.functional.softmax(
        start_scores, dim=1).squeeze(0)
    end_probabilities = torch.nn.functional.softmax(
        end_scores, dim=1).squeeze(0)

    return (
        torch.index_select(
            start_probabilities,
            0,
            torch.argmax(start_probabilities)
        ).item(),
        torch.index_select(
            end_probabilities,
            0,
            torch.argmax(end_probabilities)
        ).item()
    )
