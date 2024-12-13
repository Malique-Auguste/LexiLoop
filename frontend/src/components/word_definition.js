const WordPartialDefinition = (word_data) => {
    const {part_of_speech, definitions} = word_data
    console.log("defs", definitions)

    var i = 0

    var list_object = (
        <li className="WordPartialDefinition">
            <span className="PartOfSpeech">{part_of_speech}</span>
            <ul className="Definitions">
                {
                    definitions.map((definition) => {
                        i += 1
                        return (<li className="Definition" key = {i} >{definition}</li>)
                    })
                }
            </ul>
        </li>
    )

    return list_object
}

export default WordPartialDefinition