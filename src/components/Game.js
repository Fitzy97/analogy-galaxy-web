import '../App.css';
import React from 'react';
import backgroundImage from '../designs/game_and_pause.png';
import PauseMenuImage from '../designs/pause_menu.png';
import Background from '../designs/pause_menu_background.png';
import InfoIcon from '../img/info-icon.png';
import api from '../utils/api';
import PropTypes from 'prop-types';
import Menu from './Menu.js';
import Results from './Results.js';

import WrongAudio1 from '../audio/NiceTry_message.mp3';
import WrongAudio2 from '../audio/TryAgain_message.mp3';
import CorrectAudio1 from '../audio/Awesome_message.mp3';
import CorrectAudio2 from '../audio/GoodWork_message.mp3';
import CorrectAudio3 from '../audio/Lesson_format_CorrectSound1.mp3';
import CorrectAudio4 from '../audio/Lesson_format_CorrectSound2.mp3';
import CorrectAudio5 from '../audio/Lesson_format_CorrectSound3.mp3';

var ie = (function(){
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}());


class Game extends React.Component {

    classes = ['answer-image', 'hide'];
    classesCorrect = ['correct-image', 'hide'];
    classesIncorrect = ['incorrect-image', 'hide'];
    classesPause = ['pause-container', 'hide'];
    classesMute = ['mute-image', 'hide'];
    classesUnmute = ['unmute-image', 'show'];
    classesHint = ['hint-text', 'hide'];
    classesPlay = ['play-button', 'show'];
    classesPause1 = ['pause-button1', 'hide'];
    


    constructor(props) {
        super(props);

        this.state = {
            page: 'game',
            questionImageSrc: '',
            questionImageWidth: 0,
            questionImageHeight: 0, 
            ansAreaW: 0, 
            ansAreaH: 0, 
            ansAreaX: 0, 
            ansAreaY: 0, 
            ansW: 0, 
            ansH: 0, 
            ansX: 0, 
            ansY: 0,
            questionAudio: '',
            sound: true,
            audio: new Audio,
            wrongAudio: [
                WrongAudio1,
                WrongAudio2
            ],
            correctAudio: [
                CorrectAudio1,
                CorrectAudio2,
                CorrectAudio3,
                CorrectAudio4,
                CorrectAudio5
            ],
            numberCorrect: 0,
            questionNumber: 0,
            score: 0,
            response: '',
            used: [],
            nextIndex: 0,
            questionText: '',
            explanation: '',
            attempt: 0
        }

        this.handleCorrect = this.handleCorrect.bind(this);
        this.handleIncorrect = this.handleIncorrect.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this);
        this.setQuestion = this.setQuestion.bind(this);
        this.restart = this.restart.bind(this);
        this.findRandomIndex = this.findRandomIndex.bind(this);
        this.setAnswerArea = this.setAnswerArea.bind(this);
        this.setAnswerAreaProportions = this.setAnswerAreaProportions.bind(this);
        this.playSound = this.playSound.bind(this);
        this.mute = this.mute.bind(this);
        this.play = this.play.bind(this);
        this.pause1 = this.pause1.bind(this);
        this.showHint = this.showHint.bind(this);
        this.navigate = this.navigate.bind(this);
    }

    componentDidMount() {
        api.getQuestionData(this.props.category)
            .then((res) => {
                this.setState({
                        response: res
                    },
                    function() {
                        this.setQuestion();
                    }
                )
            });

        window.addEventListener('resize', this.setAnswerArea, true);
    }

    findRandomIndex(response, category, difficulty) {
        var randomIndex = Math.floor(Math.random() * 173);

        if (this.state.used.indexOf(randomIndex) > -1)
            randomIndex = this.findRandomIndex(response, category, difficulty);
        else if (category === 183) {
            if (difficulty === 1) {
                if (response[randomIndex].max_grade !== 0 && response[randomIndex].max_grade !== 1)
                    randomIndex = this.findRandomIndex(response, category, difficulty);
            }
            else if (difficulty === 2) {
                if (response[randomIndex].max_grade !== 2 && response[randomIndex].max_grade !== 3)
                    randomIndex = this.findRandomIndex(response, category, difficulty);
            }
            else if (difficulty === 3) {
                if (response[randomIndex].max_grade < 4 || response[randomIndex].max_grade > 6)
                    randomIndex = this.findRandomIndex(response, category, difficulty);
            }
        }
        else if (category === 199) {
            if (response[randomIndex].max_grade !== (difficulty-1))
                randomIndex = this.findRandomIndex(response, category, difficulty);
        }
        return randomIndex;
    }

    setQuestion() {
        var object = this.state.response[this.state.nextIndex];
        this.state.used.push(this.state.nextIndex);

        var hasAudio = '';
        if (object.audio.length > 0)
            hasAudio = 'https://63fde95f2ab77a6f1739-1c81251d98ab87d5cc83c544d3350168.ssl.cf2.rackcdn.com/audio/' + object.audio;

        var imageHeight = object.image.height;
        var imageWidth = object.image.width;
        
        if (object.image.height > 400) {
            imageHeight = 400;
            imageWidth = object.image.width * (400/object.image.height);
        }

        var multiplier = imageWidth / 470;
        if (imageWidth < 470)
            multiplier = 1;

        var randomIndex = this.findRandomIndex(this.state.response, this.props.category, this.props.difficulty);
    
        this.setState({
                nextIndex: randomIndex,
                questionImageSrc: 'https://63fde95f2ab77a6f1739-1c81251d98ab87d5cc83c544d3350168.ssl.cf2.rackcdn.com/' + object.image.image,
                questionImageWidth: imageWidth,
                questionImageHeight: imageHeight,
                ansAreaW: object.answerArea[0].ansAreaW * multiplier,
                ansAreaH: object.answerArea[0].ansAreaH * multiplier,
                ansAreaX: object.answerArea[0].ansAreaX * multiplier,
                ansAreaY: object.answerArea[0].ansAreaY * multiplier,
                ansW: object.answerArea[0].ansW * multiplier,
                ansH: object.answerArea[0].ansH * multiplier,
                ansX: object.answerArea[0].ansX * multiplier,
                ansY: object.answerArea[0].ansY * multiplier,
                questionAudio: hasAudio,
                questionText: object.question,
                explanation: object.explanation,
                attempt: 0
            },
            function() {
                this.setAnswerArea();
            }
        );
    }



    setAnswerArea() {

        //The biggest width we want to go for images
        var maxWidth = this.state.response[this.state.nextIndex].image.width;
        var maxHeight = this.state.response[this.state.nextIndex].image.height;


        var prop = 1;
        var imgW = this.state.questionImageWidth
        var imgH = this.state.questionImageHeight;

        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var answerArea = [];
        answerArea['aw'] = this.state.ansAreaW;
        answerArea['ah'] = this.state.ansAreaH;
        answerArea['ax'] = this.state.ansAreaX;
        answerArea['ay'] = this.state.ansAreaY;
        answerArea['w'] = this.state.ansW;
        answerArea['h'] = this.state.ansH;
        answerArea['x'] = this.state.ansX;
        answerArea['y'] = this.state.ansY;


        
        if (h !== (imgH+50) && (h-50) < maxHeight) {
            prop = (h-50) / imgH;
            imgW = imgW * prop;
            imgH = h-50;
        }
        if (w !== (imgW+50) && (w-50) < maxWidth) {
            prop = (w-50) / imgW;
            imgH = imgH * prop;
            imgW = w-50;
        }

        answerArea = this.setAnswerAreaProportions(answerArea, prop);


        this.setState({
            questionImageWidth: imgW,
            questionImageHeight: imgH,
            ansAreaW: answerArea['aw'],
            ansAreaH: answerArea['ah'],
            ansAreaX: answerArea['ax'],
            ansAreaY: answerArea['ay'],
            ansW: answerArea['w'],
            ansH: answerArea['h'],
            ansX: answerArea['x'],
            ansY: answerArea['y']
        })        
    };

    setAnswerAreaProportions(answerArea, prop) {
        answerArea['aw'] = answerArea['aw'] * prop;
        answerArea['ah'] = answerArea['ah'] * prop;
        answerArea['ax'] = answerArea['ax'] * prop;
        answerArea['ay'] = answerArea['ay'] * prop;
        answerArea['w'] = answerArea['w'] * prop;
        answerArea['h'] = answerArea['h'] * prop;
        answerArea['x'] = answerArea['x'] * prop;
        answerArea['y'] = answerArea['y'] * prop;
        return answerArea;
    };

    playSound(c) {
        if (this.state.sound) {
            var pos = 0;
            if (c) {
                pos = Math.floor(Math.random() * 5);
                this.state.audio.src = this.state.correctAudio[pos];
                ie && this.state.audio.play();
            }
            else {
                pos = Math.floor(Math.random() * 2);
                this.state.audio.src = this.state.wrongAudio[pos];
                ie && this.state.audio.play();
            }
        }
    }

    handleCorrect() {
        this.playSound(true);
        this.setState({
                score: this.state.score + 100,
                questionNumber: this.state.questionNumber + 1,
                numberCorrect: this.state.numberCorrect + 1
            },
            function() {
                this.classesCorrect.pop();
                this.classesCorrect.push('show');
                this.classes.pop();
                this.classes.push('show');
                if (this.state.questionNumber < 10) {
                    var randomIndex = this.findRandomIndex();
                    this.setState({
                            nextIndex: randomIndex
                        },
                        function() {
                            this.setQuestion();
                        }
                    )
                }
                else {
                    this.setState({
                        page: 'results'
                    })
                }
                    
                var me = this;
                setTimeout(function() {
                    me.classesCorrect.pop();
                    me.classesCorrect.push('hide');
                    me.classes.pop();
                    me.classes.push('hide');
                    me.forceUpdate();
                }, 3000);
            }
        );
    }

    handleIncorrect() {
        this.playSound(false);

        var a = this.state.numberCorrect;
        if (this.state.attempt === 0)
            a -= 1;

        this.setState({
                score: this.state.score - 25,
                numberCorrect: a,
                attempt: this.state.attempt + 1
            },
            function() {
                this.classes.pop();
                this.classes.push('show');

                this.classesIncorrect.pop();
                this.classesIncorrect.push('show');

                this.forceUpdate();

                var me = this;
                setTimeout(function() {
                    me.classesIncorrect.pop();
                    me.classesIncorrect.push('hide');
                    me.classes.pop();
                    me.classes.push('hide');

                    me.forceUpdate();
                }, 3000);
            }
        );
    }

    pause() {
        this.classesPause.pop();
        this.classesPause.push('show');
        this.forceUpdate();
    }

    resume() {
        this.classesPause.pop();
        this.classesPause.push('hide');
        this.forceUpdate();
    }

    restart() {
        this.setState({
                questionNumber: 0,
                score: 0,
                attempt: 0,
                numberCorrect: 0
            },
            function() {
                this.setQuestion();
        })
        this.resume();
    }

    mute() {
        this.setState({
            sound: !this.state.sound
        },
        function() {
            if (this.state.sound) {
                this.classesMute.pop();
                this.classesMute.push('hide');

                this.classesUnmute.pop();
                this.classesUnmute.push('show');
            }
            else {
                this.classesUnmute.pop();
                this.classesUnmute.push('hide');

                this.classesMute.pop();
                this.classesMute.push('show');
            }
            this.forceUpdate();
        })
    }

    play() {
        this.state.audio.src = this.state.questionAudio;
        ie && this.state.audio.play();
        this.classesPlay.pop();
        this.classesPlay.push('hide');
        this.classesPause1.pop();
        this.classesPause1.push('show');

        if (!this.state.sound) 
            this.mute();

        this.forceUpdate();
    }

    pause1() {
        this.state.audio.pause();
        this.classesPause1.pop();
        this.classesPause1.push('hide');
        this.classesPlay.pop();
        this.classesPlay.push('show');
        this.forceUpdate();
    }

    showHint() {
        if (this.classesHint.pop() === 'hide')
            this.classesHint.push('show');
        else
            this.classesHint.push('hide');
        this.forceUpdate();
    }

    navigate() {
        this.setState({
            page: 'menu'
        });
    }

    render() {
        if (this.state.page === 'game') {
            return (
                <div className='game-container'>

                    <div className='pause-button' onClick={this.pause}></div>

                    <h2>{this.state.questionNumber + 1}/10</h2>

                    <MuteButton
                        mute={this.mute}
                        classesMute={this.classesMute}
                        classesUnmute={this.classesUnmute}
                    />
                

                    <div className='question' >

                        <QuestionText
                            questionText={this.state.questionText}
                        />

                        <ReadButton 
                            hasAudio={this.state.questionAudio}
                            play={this.play} 
                            pause1={this.pause1} 
                            classesPlay={this.classesPlay} 
                            classesPause1={this.classesPause1} 
                        />

                        <AnswerImage
                            classes={this.classes}
                            classesCorrect={this.classesCorrect}
                            classesIncorrect={this.classesIncorrect}
                        />

                        <QuestionImage
                            questionImageWidth={this.state.questionImageWidth}
                            questionImageHeight={this.state.questionImageHeight}
                            questionImageSrc={this.state.questionImageSrc}
                            ansW={this.state.ansW}
                            ansH={this.state.ansH}
                            ansX={this.state.ansX}
                            ansY={this.state.ansY}
                            ansAreaH={this.state.ansAreaH}
                            ansAreaW={this.state.ansAreaW}
                            ansAreaX={this.state.ansAreaX}
                            ansAreaY={this.state.ansAreaY}
                            handleCorrect={this.handleCorrect}
                            handleIncorrect={this.handleIncorrect}
                        />

                        <Hint
                            showHint={this.showHint}
                            classesHint={this.classesHint}
                            explanation={this.state.explanation}
                        />

                    </div>

                    <PauseMenu
                        classesPause={this.classesPause}
                        resume={this.resume}
                        navigate={this.navigate}
                        restart={this.restart}
                    />

                </div>
            );
        }
        else if (this.state.page === 'menu')
            return <Menu />;
        else if (this.state.page === 'results')
            return <Results 
                        category={this.props.category} 
                        difficulty={this.props.difficulty} 
                        numberCorrect={this.state.numberCorrect} 
                        score={this.state.score} 
                    />;
        else
            return <p>Error 404: Not Found</p>;
    }
}

Game.propTypes = {
    category: PropTypes.number.isRequired,
    difficulty: PropTypes.number.isRequired
}

class MuteButton extends React.Component {
    render() {
        return (
            <div className='mute-button' onClick={this.props.mute}>
                <div className={this.props.classesMute.join(' ')}></div>
                <div className={this.props.classesUnmute.join(' ')}></div>
            </div>
        );
    }
}

class QuestionImage extends React.Component {
    render() {
        return (
            <div className='question-image' style={{width: this.props.questionImageWidth, height: this.props.questionImageHeight}}>
                <img src={this.props.questionImageSrc} height={this.props.questionImageHeight} width={this.props.questionImageWidth} alt=''/>
                <div className='correct' style={{width: this.props.ansW, height:this.props.ansH, left: this.props.ansX, top: this.props.ansY}} onClick={this.props.handleCorrect}></div>
                 <div className='wrong' style={{width: this.props.ansAreaW, height: this.props.ansAreaH, left: this.props.ansAreaX, top: this.props.ansAreaY}} onClick={this.props.handleIncorrect}></div>
            </div>
        );
    }
}

class PauseMenu extends React.Component {
    render() {
        return (
            <div className={this.props.classesPause.join(' ')}>
                <img className="pause-background" src={Background} alt="" />
                <img className="pause-menu" src={PauseMenuImage} alt="" />
                <div className="exit-button" onClick={this.props.resume}></div>
                <div className="leave-game-button" onClick={this.props.navigate}></div>
                <div className="restart-game-button" onClick={this.props.restart}></div>
            </div>
        );
    }
}

class Hint extends React.Component {
    render() {
        return (
            <div className='hint'>
                <img className='icon' src={InfoIcon} alt='' width="20" height="20" onClick={this.props.showHint} />
                <p className={this.props.classesHint.join(' ')}>{this.props.explanation}</p>
            </div>
        );
    }
}

class AnswerImage extends React.Component {
    render() {
        return (
            <div className={this.props.classes.join(' ')}>
                <div className={this.props.classesCorrect.join(' ')}></div>
                <div className={this.props.classesIncorrect.join(' ')}></div>
            </div>
        );
    }
}

class QuestionText extends React.Component {
    render() {
        return (
            <div className='question-text'>
                <p>{this.props.questionText}</p>
            </div>
        );
    }
}

class ReadButton extends React.Component {
    render() {
        if (this.props.hasAudio.length > 0) { 
            return (
                <div className='read-button'>
                    <div className={this.props.classesPlay.join(' ')} onClick={this.props.play}></div>
                    <div className={this.props.classesPause1.join(' ')} onClick={this.props.pause1}></div>
                </div>
            );
        }
        else
            return <p></p>;
    }
}


export default Game;
