import { useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'
import FlashcardV1 from '../components/flashcards'

const flashcard_types = [FlashcardV1]


const Study = () => {
    const {state, dispatch} = useAppContext()

    function reset() {
        document.getElementById("search-bar").reset()
        dispatch({type: "RESET"})
    }

    function build_html() {
        console.log("fgu", (state != null) && state.next, state)

        if ((state != null)) {
            console.log("building")

            var word_i = state.current_word_i
            var flashcard_i = state.flashcard_i
            if (state.next) {
                const word_i = Math.floor(Math.random() * state.all_words.length);
                const flashcard_i = Math.floor(Math.random() * flashcard_types.length);

                //stops flashcard from reloading on reload of page
                dispatch({type:"LOAD", payload: {all_words: state.all_words, current_word_i: word_i, flashcard_i: flashcard_i, next:false, alternate: state.alternate}})
            }

            const word = state.all_words[word_i]
            const flashcard_maker = flashcard_types[flashcard_i]
            return flashcard_maker(word, state.alternate)


            
        }
    }

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
            .then(all_words => {
                console.log("ssf")
                dispatch({type:"LOAD", payload: {all_words: all_words, current_word_i: 0, flashcard_i: 0, next:true, alternate: false}})
            })
    }

    else {
        return (
            <div id = "study-page">a {build_html()} </div>
        )
    }
    
        /*
        */
    
}


export default Study