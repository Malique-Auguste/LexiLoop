import { useAppContext } from '../hooks/useAppContext'

import WordPartialDefinition from '../components/word_definition'


const FlashcardV1 = (word_model, alternate) => {
    const {state, dispatch} = useAppContext()
    const {spelling, meanings_list} = word_model

    function change_alternate() {
        console.log("alternate changed")
        dispatch({type:"LOAD", payload: {all_words: state.all_words, flashcard_types: state.flashcard_types, alternate: !state.alternate}})
    }

    if(!alternate) {
        return (
            <div id = "flashcard">
                <h2>Define {spelling}</h2>
                <button id = "next" onMouseDown={change_alternate}>Next</button>
            </div>
        ) 
    }
    else {
        return (
            <div id = "flashcard">
                <h2>Define {spelling}</h2>
                <span id = "definitions">
                    {
                        meanings_list.map(word_partial_definition_data => {
                            return WordPartialDefinition(word_partial_definition_data)
                        })
                    }
                </span>
                <button>Correct</button>
                <button>Wrong</button>
            </div>
        )
    }
}

export default FlashcardV1