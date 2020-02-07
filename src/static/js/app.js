const MODELS = {
  BASE_V1: 'albert-base-v1',
  LARGE_V1: 'albert-large-v1',
  XLARGE_V1: 'albert-xlarge-v1',
  XXLARGE_V1: 'albert-xxlarge-v1',
  BASE_V2: 'albert-base-v2',
  LARGE_V2: 'albert-large-v2',
  XLARGE_V2: 'albert-xlarge-v2',
  XXLARGE_V2: 'albert-xxlarge-v2',
};

const MAX_DOC_LENGTH = 1000;

function app () {
  const { h, Component, render } = preact;
  const { useState } = preactHooks;

  const FETCH_STATES = [
    'NOT_STARTED',
    'IN_FLIGHT',
    'DONE',
  ].reduce((memo, field) => Object.assign(memo, { [field]: field }));

  function App () {
    const [ document, setDocument ] = useState('');
    const [ question, setQuestion ] = useState('');
    const [ answer, setAnswer ] = useState('');
    const [ model, setModel ] = useState(MODELS.LARGE_V2);
    const [ fetchStatus, setFetchStatus ] = useState(FETCH_STATES.NOT_STARTED);

    const onDocumentChange = evt => setDocument(evt.target.value);
    const onQuestionChange = evt => setQuestion(evt.target.value);
    const onModelChange = evt => setModel(evt.target.value);

    const answerQuestion = async () => {
      setFetchStatus(FETCH_STATES.IN_FLIGHT);
      setAnswer('');
      const documentUpload = await fetch(
        '/documents',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/text' },
          body: document
        }
      );

      const id = await documentUpload.text();

      const answerResponse = await fetch(
        `/documents/${id}/answer` +
          `?question=${encodeURIComponent(question)}&model=${encodeURIComponent(model)}`,
      );
      setAnswer(await answerResponse.text());
      setFetchStatus(FETCH_STATES.DONE);
    };

    const btnDisabled = !(document && question) && document.length > MAX_DOC_LENGTH;

    return h(
      'div',
      null,
      [
        h('nav', { className: 'blue' }, [
          h('div', { className: 'nav-wrapper' }, [
            h('span', { className: 'brand-logo left' }, 'Ask ALBERT'),
            h('ul', { id: 'nav-mobile', className: 'right' }, [
              h('li', null, [
                h('a', { href: 'https://github.com/TheDahv/albert-api', target: '_blank' }, [
                  'See this on GitHub'
                ]),
              ]),
            ]),
          ]),
        ]),
        h('div', { className: 'container' }, [
          h('div', { className: 'row' }, [
            h('div', { className: 'col s12 m10 offset-m1' }, [
              h('div', { className: 'card light-blue lighten-5' }, [
                h('div', { className: 'card-content' }, [
                  h('span', { className: 'card-title valign-wrapper' }, [
                    h('i', { className: 'material-icons blue-text'}, 'info_outline'),
                    'What is Ask ALBERT?'
                  ]),
                  h('p', null, [
                    `Google's open-source A Lite BERT (ALBERT) is an
                    implementation of the BERT model for understanding
                    language. It is especially good at understanding a
                    document text, interpreting a question, and attempting
                    to answer the question from that text -- an exercise
                    popularized by the `,
                    h('a',
                      {
                        href: 'https://rajpurkar.github.io/SQuAD-explorer/',
                        target: '_blank',
                      },
                      'SQuAD reading comprehension dataset.'
                    ),
                  ]),
                  h('p', null, [
                    `This demo runs the `,
                    h('a',
                      {
                        href: 'https://huggingface.co/transformers/model_doc/albert.html',
                        target: '_blank',
                      },
                      'Huggingface Transformers implementation of ALBERT'
                    ),
                    ` to try to answer questions from a body of text you
                    give it.`
                  ]),
                  h('p', null, [
                    `Try entering common questions or searches and
                    pasting answer text (or featured snippet content) to
                    see if ALBERT can answer the question from your
                    document.`
                  ]),
                  h('p', null, `
                    Do note this is a probablistic model -- you may not
                    get the same answer every time. This model has also
                    not been fine-tuned or trained on anything other than
                    the pre-trained models from Huggingface.
                  `)
                  ]
                )
              ])
            ])
          ]),
          h('div', { className: 'input-field row' }, [
            h('input', {
              id: 'question',
              type: 'text',
              value: question,
              onInput: onQuestionChange,
            }),
            h('label', { htmlFor: 'question' }, 'Question'),
          ]),
          h('div', { className: 'input-field row' }, [
            h('textarea', {
              className: 'materialize-textarea',
              id: 'textarea',
              value: document,
              onInput: onDocumentChange,
            }),
            h('label',
              {
                htmlFor: 'document',
                className: document.length > MAX_DOC_LENGTH ? 'red-text' : '',
              }, `Document Text (${document.length}/${MAX_DOC_LENGTH})`),
          ]),
          h('div', { className: 'row' }, [
            h('div', { className: 'input-field col s12 m3' }, [
              h('select', { id: 'model', onChange: onModelChange },
                Object.
                  values(MODELS).
                  map(m => h('option', { value: m, selected: m === model }, m))
              ),
              h('label', { htmlFor: 'model' }, 'ALBERT Model'),
            ]),
            h('div', { className: 'input-field col s12 m9' }, [
              h('button', {
                  className: 'waves-effect waves-light btn blue',
                  disabled: btnDisabled,
                  onClick: answerQuestion,
                },
                'Answer'
              ),
            ])
          ]),
          fetchStatus === FETCH_STATES.IN_FLIGHT ?
            h('div', { className: 'progress' }, h('div', { className: 'indeterminate blue' })) :
            null,
          answer ?
            h('div', null, [
              h('p', { style: { fontWeight: 700 } }, 'ALBERT\'s Answer:'),
              h('p', null, answer)
            ]) :
            null,
          ]),
      ]);
  }

  const container = document.getElementById('app');
  render(h(App), container, container);
}

app();

// Initialize the select box
document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('select');
  const instances = M.FormSelect.init(elems, {});
});
