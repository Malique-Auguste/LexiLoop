import { createContext, useReducer } from 'react'

export const SearchContext = createContext()

export function searchReducer(state, action) {
    switch (action.type) {
        case "LOAD_SEARCH_RESULT":
            return {
                "state": action.payload
            }
        case "RESET":
            return {
                "state": null
            }
        default:
            return state
    }
}

export const SearchContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(searchReducer, {
        "state": null
    })

    return (
        <SearchContext.Provider value={{ ...state, dispatch}}>
            { children }
        </SearchContext.Provider>
    )
}