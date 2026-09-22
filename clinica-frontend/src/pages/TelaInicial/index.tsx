import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

export default function TelaInicial() {
    const email = localStorage.getItem("email")
    const tokenAcesso = localStorage.getItem("tokenAcesso")
    const tokenRefresh = localStorage.getItem("tokenRefresh")
    const navigate = useNavigate()

    useEffect(()=>{
        if(!tokenAcesso && !tokenRefresh) navigate('/')
    }, [])

    const handleLogout = async () => {
        try {
            const idUsuario = localStorage.getItem("idUsuario")
            const response = await axios.put<any>(
                `http://localhost:3000/logout/${idUsuario}`
            )
            if (response.data.length === 0) {
                toast.error(
                    "Usuário não encontrado. ",
                    {
                        autoClose: 3000,
                        hideProgressBar: true
                    }
                )
                return
            }
            localStorage.clear()
            toast.success("Logout realizado com sucesso!", {
                autoClose: 2000
            })
            setTimeout(() => {
                navigate("/")
            }, 2000)
        } catch {
            toast.error(
                "Erro ao deslogar. ",
                {
                    autoClose: 3000,
                    hideProgressBar: true
                }
            )
        }
    }
    return (
        <div className="flex justify-center pt-10 w-full min-h-screen bg-gray-100">
            <div className="flex-col text-center space-y-4 items-center justify-center">
                <h1 className="text-blue-950 font-medium text-2xl">Tela Inicial</h1>
                <p className="text-blue-950 ">{email}</p>
                <p className="text-blue-950 break-all">{tokenAcesso}</p>
                <p className="text-blue-950 break-all">{tokenRefresh}</p>
                <button onClick={handleLogout} className="px-10 py-2 rounded-2xl cursor-pointer bg-blue-950 text-white font-bold">Logout</button>
            </div> 

        </div>
    )
}