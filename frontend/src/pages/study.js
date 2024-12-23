import { useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'
import FlashcardV1 from '../components/flashcards'

const Study = () => {
    const {state, dispatch} = useAppContext()

    const flashcard_types = [FlashcardV1]

    var all_words = []

    function build_html() {
        if (state != null) {
            console.log("fgu", state)
            const word_i = Math.floor(Math.random() * state.all_words.length);
            console.log("fgut", word_i)

            const word = state.all_words[word_i]

            const flashcard_i = Math.floor(Math.random() * state.flashcard_types.length);
            console.log("fguai", flashcard_i)

            const flashcard = state.flashcard_types[flashcard_i]

            return flashcard(word, state.alternate)
        }
    }

    

    console.log("gr1v", state)

    const api_call = "/api"
    if(state == null) {
        fetch(api_call, {method: "GET"})
            .then(response => {
                console.log("fetching")
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error("Word not found");
                }
            }) 
            .then(words => {
                all_words = words
                console.log("ssf")
            })
            .then(_ => {
                dispatch({type:"LOAD", payload: {all_words: all_words, flashcard_types: flashcard_types, alternate: false}})
            })
    }

    return (
        <div id = "study-page">a {build_html()} </div>
    )
    
        /*
        */
    
}


export default Study