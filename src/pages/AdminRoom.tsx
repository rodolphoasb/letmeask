import { useParams } from "react-router"

import logoImg from "../assets/images/logo.svg"
import { RoomCode } from "../components/RoomCode"
import { useAuth } from "../hooks/useAuth"
import "../styles/room.scss"

import { Question } from "../components/Question"
import { useRoom } from "../hooks/useRoom"
import { Button } from "../components/Button"

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const { user } = useAuth()
  const params = useParams<RoomParams>()

  const roomId = params.id

  const { questions, title } = useRoom(roomId)

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>

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
