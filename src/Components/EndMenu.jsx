import { useEffect } from 'react'
import PropTypes from 'prop-types'
import './EndMenu.css'

export default function EndMenu(props){
    useEffect(() => {
        const highScore = JSON.parse(localStorage.getItem('best')) || 0
        if (props.gameState.score > highScore) {
            localStorage.setItem('best', JSON.stringify(props.gameState.score))
        }
    }, [props.gameState.score])

    const endText = props.gameState.win ? 'You WON!!' : 'Game Over'

    return (
        <section className='end-menu'>
            <h2 className='end-title'>{endText}</h2>
            <p>Final score: {props.gameState.score}</p>
            <p>Best score: {props.gameState.best}</p>
            <button 
                className='menu-btn' 
                onClick={() => props.resetGame()}
            >Play again?</button>
        </section>
    )
}

EndMenu.propTypes = {
    gameState: PropTypes.object,
    resetGame: PropTypes.func
}