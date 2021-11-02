import { useHistory } from "react-router-dom"
import { ref, child, get } from "firebase/database"
import { useAuth } from "../hooks/useAuth"

import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"

import { Button } from "../components/Button"

import "../styles/auth.scss"
import { FormEvent, useState } from "react"
import { database } from "../services/firebase"

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  let [roomCode, setRoomCode] = useState("")

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    history.push("/rooms/new")
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === "") {
      return
    }

    const roomRef = await ref(database)

    const roomRefExist = await get(child(roomRef, `rooms/${roomCode}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return true
        } else {
          return false
        }
      })
      .catch((error) => {
        console.error(error)
      })

    if (!roomRefExist) {
      alert("Room do not exist")
      return
    }

    history.push(`/rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Illustration that shows questions and answers"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask logo" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Google logo" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Digite o código da sala"
              onChange={(e) => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">Entrar na sala </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
