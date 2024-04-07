import { useState, useEffect } from "react"

export default function Pointer() {
    const [pointer, setPointer] = useState('█')

    // POINTER EFFECT
    useEffect(() => {
        const setTimeStamp = setInterval(() => {
            setPointer(prevPointer => (prevPointer === '█' ? '' : '█'))
        }, 1000)

        return () => clearInterval(setTimeStamp)
    }, [])

    return { pointer }
}