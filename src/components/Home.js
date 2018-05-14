import React, { Component } from 'react';
import '../App.css';
import Menu from './Menu.js';
import backgroundImage from '../designs/main.png';

class Home extends Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.setContainerHeight = this.setContainerHeight.bind(this);
        this.state = {
            containerWidth: 0,
            containerHeight: 0,
            page: 'home'
        }

        this.navigate = this.navigate.bind(this);
    }

    setContainerHeight(width) {
        return (width/1.33);
    }

    handleChange() {
        this.setState({
            containerWidth: 0,
            containerHeight: this.setContainerHeight(this.state.containerWidth)
        });
        return <div>{this.state.containerHeight}</div>;
    }

    navigate() {
        this.setState({
            page: 'menu'
        });
    }

    render() {
        if (this.state.page === 'home') {
            return (
                <div className="home-container">
                    
                    <div className="start-button" onClick={this.navigate}></div>
                </div>
            );  
        }
        else if (this.state.page === 'menu')
            return <Menu />;
        else
            return <p>Error 404: Not Found</p>;
    }
}

export default Home;
