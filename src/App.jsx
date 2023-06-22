import { useState, useEffect } from 'react'
import StartMenu from './Components/StartMenu'
import EndMenu from './Components/EndMenu'
import Question from './Components/Question'
import './App.css'

function App() {
    const [gameState, setGameState] = useState({
        scoreTable: {
            easy: 100,
            medium: 300,
            hard: 500,
        },
        menu: true,
        end: false,
        win: false,
        category: '',
        questions: [],
        questionIndex: 0,
        best: 0,
        score: 0,
        skip: 1,
        hint: 1,
    })

    const [categories, setCategories] = useState([])

    useEffect(() => {
        const highScore = JSON.parse(localStorage.getItem('best')) || 0
        if (highScore > 0) {
            setGameState(prev => ({...prev, best: highScore}))
        }
        
        const getCategories = async () => {
            try {
                const response = await fetch('https://opentdb.com/api_category.php')
                const data = await response.json()
                setCategories(data.trivia_categories)
            } catch (e) {
                console.error(e)
            }
        }
        getCategories()
    }, [])

    async function startGame(category) {
        const questions = []
        const categoryParam = category ? `category=${category}` : ''
        const baseUrl = `https://opentdb.com/api.php?&amount=5&type=multiple`
        try {
            for (let difficulty of ['easy', 'medium', 'hard']) {
                const response = await fetch(`${baseUrl}&${categoryParam}&difficulty=${difficulty}`)
                const data = await response.json()
                if (data.response_code !== 0) throw new Error(data)
                questions.push(...data.results)
            }
            setGameState(prevState => {
                return {
                    ...prevState,
                    questions,
                    category,
                    menu: false,
                }
            })
        } catch(e) {
            console.error(e)
        }
        
    }

    function resetGame() {
        setGameState(prev => ({
            ...prev, 
            menu: true,
            end: false,
            win: false,
            questions: [],
            questionIndex: 0,
            score: 0,
            skip: 1,
            hint: 1,
        }))
    }

    function endGame() {
        setGameState(prev => ({...prev, end: true}))
    }

    function updateScore(level) {
        const baseScore = gameState.scoreTable[level]
        const bonus = (gameState.skip + gameState.hint) * baseScore / 4
        setGameState(prev => ({
            ...prev, 
            score: prev.score + baseScore + bonus,
            best: Math.max(prev.best, prev.score + baseScore + bonus)
        }))
    }

    function checkAnswer(isCorrect) {
        if (isCorrect) {
            updateScore(gameState.questions[gameState.questionIndex].difficulty)
            if (gameState.questionIndex !== gameState.questions.length - 1) {
                setGameState(prev => ({...prev, questionIndex: prev.questionIndex + 1}))
                return
            }
            setGameState(prev => ({...prev, win: true}))
        }
        endGame()
    }

    function skipQuestion() {
        if (gameState.skip > 0 && gameState.questionIndex < gameState.questions.length - 1) {
            setGameState(prev => ({
                ...prev, 
                skip: prev.skip - 1, 
                questionIndex: prev.questionIndex + 1
            }))
        }
    }

    function giveHint() {
        if (gameState.hint > 0 && gameState.questionIndex < gameState.questions.length - 1) {
            setGameState(prev => ({
                ...prev, 
                hint: prev.hint - 1, 
                questions: prev.questions.map((question, index) => {
                    if (index !== gameState.questionIndex) {
                        return question
                    } else {
                        const random = Math.random() * question.incorrect_answers.length >> 0
                        const newIncorrect = question.incorrect_answers[random]
                        console.log(random, question.incorrect_answers, newIncorrect)
                        return {
                            ...question,
                            incorrect_answers: [newIncorrect]
                        }
                    }
                })
            }))
        }
    }

    return (
        <main>
            {gameState.menu ?
                <StartMenu startGame={startGame} categories={categories} gameState={gameState}/> :
                gameState.end ? 
                    <EndMenu gameState={gameState} resetGame={resetGame}/> :
                    <div className='game-container'>
                        <h2>Question #{gameState.questionIndex + 1} ({gameState.questions[gameState.questionIndex].difficulty})</h2>
                        <h4>Current Score: {gameState.score}</h4>
                        <Question 
                            questionObj={gameState.questions[gameState.questionIndex]}
                            checkAnswer={checkAnswer}
                        />
                        <div className='options-container'>
                            <button onClick={giveHint} className={`option-btn ${gameState.hint === 0 && 'disabled'}`}>{gameState.hint} hint left</button>
                            <button onClick={skipQuestion} className={`option-btn ${gameState.skip === 0 && 'disabled'}`}>{gameState.skip} skip left</button>
                        </div>
                    </div>
            }
        </main>
    )
}

export default App
