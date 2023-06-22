import { useRef } from 'react'
import PropTypes from 'prop-types'
import './StartMenu.css'

export default function StartMenu(props){
    const optionsRef = useRef(null)

    const options = props.categories.map(category => (
        <option key={category.id} value={category.id}>{category.name}</option>
    ))

    return (
        <section className='start-menu'>
            <div className='header'>
                <img width='64' height='64' src='https://img.icons8.com/external-flaticons-flat-flat-icons/64/external-quiz-team-building-flaticons-flat-flat-icons.png'/>
                <h2 className='title'>The Quiz Show</h2>
                <p className='attribute'><a  href='https://icons8.com/icon/kmqexIGAK3DI/quiz'>Quiz</a> icon by <a href='https://icons8.com'>Icons8</a></p>
            </div>
            <div className='rules'>
                <p>Rules:</p>
                <p>- There will be a total of 15 questions. Five easy, five medium, and five hard.</p>
                <p>- Easy questions are worth {props.gameState.scoreTable.easy} points, 
                    medium {props.gameState.scoreTable.medium}, 
                    and hard {props.gameState.scoreTable.hard}.</p>
                <p>- You can skip {props.gameState.skip} question and you get {props.gameState.hint} hint. Final question is not skippable.</p>
                <p>- You earn 25% bonus points for each unused skip and hint on each question.</p>
                <p>- The game will end when you get a wrong answer.</p>
            </div>
            <p>Which category would you like to play?</p>
            <select className='category' name='category' ref={optionsRef}>
                <option value=''>Play All Categories</option>
                {options}
            </select>
            <button 
                className='menu-btn' 
                onClick={() => props.startGame(optionsRef.current.value)}
            >Start Game</button>
        </section>
    )
}

StartMenu.propTypes = {
    categories: PropTypes.array,
    startGame: PropTypes.func,
    gameState: PropTypes.object,
}