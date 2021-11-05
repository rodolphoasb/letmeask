import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { database } from "../services/firebase"

interface valueType {
  id: string
  content: string
  author: {
    avatar: string
    name: string
  }
  ishighlighted: boolean
  isAnswered: Boolean
}

export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<valueType[]>([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}/questions`)

    onValue(ref(database, `rooms/${roomId}`), (snapshot) => {
      const roomName = snapshot.val().title
      setTitle(roomName)
    })

    onValue(roomRef, (snapshot) => {
      if (snapshot.val() !== null) {
        const data: [string, valueType][] = Object.entries(snapshot.val())

        const parsedQuestions = data.map(([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            ishighlighted: value.ishighlighted,
            isAnswered: value.isAnswered,
          }
        })

        setQuestions(parsedQuestions)
      }
    })
  }, [roomId])

  return { questions, title }
}
