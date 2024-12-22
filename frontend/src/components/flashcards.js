import WordPartialDefinition from '../components/word_definition'


const FlashcardV1 = (word_model, alternate) => {
    const {spelling, meanings_list} = word_model

    if(!alternate) {
        return (
            <div id = "flashcard">
                <h2>Define {spelling}</h2>
                <span id = "instruction"></span>
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