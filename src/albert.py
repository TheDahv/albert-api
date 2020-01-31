# To evaluate this file in a REPL:
# exec(open("./src/albert.py").read())

from transformers import AlbertTokenizer, AlbertForQuestionAnswering
import torch

# https://huggingface.co/transformers/pretrained_models.html
tokenizer = AlbertTokenizer.from_pretrained(
    'albert-large-v2', do_lower_case=True)
model = AlbertForQuestionAnswering.from_pretrained(
    'albert-base-v2', cache_dir="/usr/src/cache")


def get_answer(context, question):
    #input_dict = tokenizer.encode_plus(context, question, return_tensors='pt')
    input_dict = tokenizer.encode_plus(question, context, return_tensors='pt')
    start_scores, end_scores = model(**input_dict)

    all_tokens = tokenizer.convert_ids_to_tokens(input_dict['input_ids'][0])
    res = all_tokens[torch.argmax(start_scores): torch.argmax(end_scores)+1]

    print(
        ' '.join(all_tokens[torch.argmax(start_scores):
                            torch.argmax(end_scores)+1])
    )
