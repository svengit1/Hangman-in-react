import React from 'react'
import axios from 'axios'
import CreateQuoteMask from './CreateQuoteMask'
import {useNavigate} from 'react-router-dom'
const baseUrl = "https://type.fit/api/quotes"
import "../style"


export default function Game(){
    const [post, setPost] = React.useState()
    const [randomIndex, setRandomIndex] = React.useState(randomIntFromInterval(0, 1642))
    const [maskedQuote, setMaskedQuote] = React.useState("")
    const [currLetter, setCurrLetter] = React.useState("")
    const [guessedLetters, setGuessedLetters] = React.useState("")
    const [errors, setErrors] = React.useState(0)
    const navigate = useNavigate();

    
    if (post && !maskedQuote){
        console.log("this is called")
        setMaskedQuote(CreateQuoteMask(post[randomIndex].text, ""))
    } else{

        React.useEffect(() => {
            axios.get(baseUrl).then((response) => {
                setPost(response.data)
            })
        }, [])
    }
    if (post){
        console.log(post[randomIndex].text)
    }
    
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function changeCurrLetter(e){
        console.log("new letter", e.target.value)
        setCurrLetter(e.target.value)
    }

    function guessSelectedLetter(){
        
        if (!post[randomIndex].text.includes(currLetter)){
            setErrors((prevValue) => {
                return prevValue + 1
            })
        }
        setGuessedLetters((prevValue) => {
            var newGuessedLetters = prevValue + currLetter
            setCurrLetter("")
            setMaskedQuote(CreateQuoteMask(post[randomIndex].text, newGuessedLetters))
            return newGuessedLetters
        })
    }

    function checkWon(currMaskedQuote){
        if (!currMaskedQuote.includes("_")){
            return true
        } else{
            return false
        }
    }

    function detectEnterKeyPress(e){
        if (e.key === 'Enter') {
          guessSelectedLetter()
        }
      }

    function restartGame(){
        setErrors(0)
        setRandomIndex(randomIntFromInterval(0, 1642))
        setMaskedQuote("")
        setGuessedLetters("")
        setCurrLetter("")
    }

    const navigateToSocreboard = () => {
       axios.post("https://my-json-server.typicode.com/stanko-ingemark/hang_the_wise_man_frontend_task/highscores", 
        {
            "quoteId": randomIndex.toString(),
            "length": post[randomIndex].text.length,
            "uniqueCharacters": 8,
            "userName": localStorage.getItem("name"),
            "errors": errors
        }).then(res => console.log("response", res))

        localStorage.setItem("gameData", JSON.stringify({"duration": 1000, "errors": errors, "id": 1, 
            "length": post[randomIndex].text.length, "quoteId": randomIndex, "uniqueCharacters": 55, "userName": localStorage.getItem("name")}))
        navigate("/scoreboard")
    } 
    return(
        <div class="game">
            <h1>Play hangman!</h1>
            <br></br>
            <br></br>
            <div class="col-lg-4">
                <div class="input-group mb-3">
                    <input class="form-control" placeholder="Type a letter" aria-label="type a letter" aria-describedby="button-addon2" value={currLetter} type="text" onChange={changeCurrLetter} onKeyDown={detectEnterKeyPress} maxLength={1}></input>
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={guessSelectedLetter}>Select letter</button>
                </div> 
            </div>
            <p> Used letters: {guessedLetters} </p>
            <p>Errors: {errors}</p>
            <div className="box">
                <pre class="quote" name="quote">{maskedQuote}</pre>
            </div>
            
            <button type="button" class="btn btn-outline-secondary" onClick={restartGame}>New quote</button>
            {checkWon(maskedQuote) && <button type="button" class="btn btn-outline-secondary" onClick={navigateToSocreboard}>Go to scoreboard</button>}
        </div>
    )
}