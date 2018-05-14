import '../App.css';
import React from 'react';
import Game from './Game.js';
import backgroundImage from'../designs/difficult123.png';

class Menu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 'menu',
            category: 0,
            difficulty: 0
        }

        this.navigate = this.navigate.bind(this);
    }

    navigate(category, difficulty) {
        this.setState({
            page: 'game',
            category: category,
            difficulty: difficulty
        });
    }

    render() {
        if (this.state.page === 'menu') {
            return (
                <div className='menu-container'>
                    <div className='easy-button-picture' onClick={() => {this.navigate(199, 1)}}></div>
                    <div className='medium-button-picture' onClick={() => {this.navigate(199, 2)}}></div>
                    <div className='hard-button-picture' onClick={() => {this.navigate(199, 3)}}></div>

                    <div className='easy-button-figure' onClick={() => {this.navigate(183, 1)}}></div>
                    <div className='medium-button-figure' onClick={() => {this.navigate(183, 2)}}></div>
                    <div className='hard-button-figure' onClick={() => {this.navigate(183, 3)}}></div>
                </div>
            );
        }
        else if (this.state.page === 'game')
            return <Game category={this.state.category} difficulty={this.state.difficulty} />;
        else
            return <p>Error 404: Not Found</p>;
    }
}


export default Menu;
