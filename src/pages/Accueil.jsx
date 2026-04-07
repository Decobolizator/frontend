import { useEffect, React } from "react"
import instance from "../services/HttpClient"

function Accueil() {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get("/test")  // endpoint test
        console.log(response.data)  // reponse API dans console
      } catch (error) {
        console.error("Erreur API :", error) //erreur dans console
      }
    }

    fetchData()
  }, [])

    return (
        <>
            <h1>Page d'accueil et tuto</h1>
        </>
    )
}

export default Accueil