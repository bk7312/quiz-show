import PropTypes from 'prop-types'
import he from 'he'
import './Question.css'

export default function Question(props){
    const { 
        question, 
        incorrect_answers: incorrect, 
        correct_answer: answer, 
    } = props.questionObj
    const choices = [...incorrect, answer].sort()
    const buttonElements = choices.map(choice => (
        <button
            key={choice}
            id={choice} 
            className='choice'
            onClick={() => props.checkAnswer(choice === answer)}
        >
            {he.decode(choice)}
        </button>
    ))
    console.log(answer)
    return (
        <div className='question-container'>
            <p className='question'>{he.decode(question)}</p>
            <div className='choice-container'>{buttonElements}</div>
        </div>
    )

}

Question.propTypes = {
    questionObj: PropTypes.object,
    checkAnswer: PropTypes.func,
}