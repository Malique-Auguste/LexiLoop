import { createContext, useReducer } from 'react'

export const AppContext = createContext()

export function contextReducer(state, action) {
    switch (action.type) {
        case "LOAD":
            console.log("context load")
            return {
                "state": action.payload
            }
        case "RESET":
            console.log("context reset")
            return {
                "state": null
            }
        default:
            return state
    }
}

export const AppContextProvider = ({children}) => {

    const [state, dispatch] = useReducer(contextReducer, {
        "state": null
    })

    return (
        <AppContext.Provider value={{ ...state, dispatch}}>
            { children }
        </AppContext.Provider>
    )
}