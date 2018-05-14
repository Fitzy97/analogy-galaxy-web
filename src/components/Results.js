import '../App.css';
import React from 'react';
import backgroundImage from '../designs/results.png';
import PropTypes from 'prop-types';
import Game from './Game.js';
import Menu from './Menu.js';

class Results extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 'results'
        }

        this.handleRestart = this.handleRestart.bind(this);
        this.handleExit = this.handleExit.bind(this);
    }

    handleRestart() {
        this.setState({
            page: 'game'
        });
    }

    handleExit() {
        this.setState({
            page: 'menu'
        });
    }
    render() {
        if (this.state.page === 'results') {
            return (
                <div className='results-container'>
                    <div className='score'><h1>{this.props.score}</h1></div>
                    <div className='numberCorrect'><h2>{this.props.numberCorrect}/10 correct</h2></div>
                    <div className='redo-button' onClick={this.handleRestart}></div>
                    <div className='exit-button' onClick={this.handleExit}></div>
                </div>
            );
        }
        else if (this.state.page === 'game') {
            return <Game category={this.props.category} difficulty={this.props.difficulty} />;
        }
        else if (this.state.page === 'menu') {
            return <Menu />;
        }
        else
            return <p>Error 404: Not Found</p>;
    }
}

Results.propTypes = {
    category: PropTypes.number.isRequired,
    difficulty: PropTypes.number.isRequired,
    numberCorrect: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired
}

export default Results;
