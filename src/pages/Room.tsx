import { FormEvent, useState } from "react"
import { useParams } from "react-router"

import { push, ref } from "firebase/database"

import logoImg from "../assets/images/logo.svg"
import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { useAuth } from "../hooks/useAuth"
import "../styles/room.scss"
import { database } from "../services/firebase"
import { Question } from "../components/Question"
import { useRoom } from "../hooks/useRoom"

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const [newQuestion, setNewQuestion] = useState("")

  const roomId = params.id

  const { questions, title } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    if (newQuestion.trim() === "") {
      return
    }

    if (!user) {
      throw new Error("You must be logged in")
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      ishighlighted: false,
      isAnswered: false,
    }

    await push(ref(database, `rooms/${roomId}/questions`), question)

    setNewQuestion("")
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
            placeholder="O que você quer perguntar?"
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {questions.map((question) => (
          <Question
            key={question.id}
            content={question.content}
            author={question.author}
          />
        ))}
      </main>
    </div>
  )
}
