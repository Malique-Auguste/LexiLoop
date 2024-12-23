import { useContext } from "react"
import { AppContext } from "../context/context"


export function useAppContext() {
    const context = useContext(AppContext)

    if (!context) {
        throw new Error("useAppContext can only be used from within app context")
    }

    return context
}