import React from "react";
import ReactDom from "react-dom";
import SockJsClient from "react-stomp";
import UsernameGenerator from "username-generator";
import Fetch from "json-fetch";
import {TalkBox} from "react-talk";
import {Button} from "@material-ui/core";
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import "../chatContainer.css";


const randomstring = require("randomstring");


const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: 0,
        marginTop: 3,
    },
    iconSmall: {
        fontSize: 20,
    },
});

class SampleComponent extends React.Component {
    constructor(props) {
        super(props);
        // randomUserId is used to emulate a unique user id for this demo usage
        this.randomUserName = UsernameGenerator.generateUsername("-");
        this.randomUserId = randomstring.generate();

        this.sendUser = this.sendUser.bind(this);
        this.sendMessage = this.sendMessage.bind(this);


        this.state = {
            clientConnected: false,
            messages: [],
            messagesReceived: [],
            incomingMsgs: [],
            outgoingMsgs: [],
            sentUser: false,
            username: "",
            userList: [],
            messageList: [],
            welcomemsg: "",

        };

    }

    onConnect(){
        this.setState({clientConnected: true});

        /*var url = stompClient.ws._transport.url;
        url = url.replace(
            "ws://localhost:8080/spring-security-mvc-socket/secured/room/",  "");
        url = url.replace("/websocket", "");
        url = url.replace(/^[0-9]+\//, "");
        console.log("Your current session is: " + url);
        sessionId = url;*/


    }

    sendUser(e){
        e.preventDefault();
        const username = this.userId.value.trim();
        const outgoingmsgs = this.state.outgoingMsgs;
        outgoingmsgs.push(username)
        this.setState({outgoingMsgs: outgoingmsgs, sentUser: true, username: username});
        this.setState(prevState => ({
            userList: [...prevState.userList, username]
        }));
        //this.clientRef.sendMessage("/app/register", JSON.stringify({user: username, type: 'JOIN'}));
        //this.clientRef.sendMessage("/secured/chat", JSON.stringify({sender: username, type: 'JOIN'}));
       // this.userName.value = "";
       // this.clientRef.sendMessage("/user/"+ username +"/queue/position-updates", JSON.stringify({user: username, type: 'JOIN'}));

        this.clientRef.sendMessage("/app/user", JSON.stringify({username: username}));

        this.clientRef._subscribe("/topic/"+username)


    }

    sendMessage(e){
        e.preventDefault();
        const msg = this.inputText.value.trim();
        const username = this.state.username;
        if(msg) {
            this.clientRef.sendMessage("/app/message", JSON.stringify({message: msg, user: username}));
            this.inputText.value = '';
        }
    }

    onMessageReceive = (msg, topic) => {
        const username = this.state.username;
            this.setState(prevState => ({
                messagesReceived: [...prevState.messagesReceived, msg]
            }));
    }


    render() {
        const { classes } = this.props;
        const messagesReceived = this.state.messagesReceived;
        const username = this.state.username;
        const userList = this.state.userList;
        const date = new Date();

        return (
            <div className="container chatContainer">
              <div className="row">
                <div className="mesgs col-8">
                    <div className="msg_history">
                        {messagesReceived  && messagesReceived.map((eachincoming) =>
                            eachincoming.username !== undefined
                            ?
                                eachincoming.username !== username &&
                                <div className="user_join">
                                    <p>{eachincoming.username} joined </p>
                                </div>

                            :
                                eachincoming.user !== username && eachincoming.content === undefined &&
                                    <div className="incoming_msg">
                                        <div className="incoming_msg_img">
                                            <img src="https://ptetutorials.com/images/user-profile.png" alt="user" />
                                        </div>
                                        <div className="received_msg">
                                            <div className="received_withd_msg">
                                                <p>{eachincoming.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                ||

                                eachincoming.user === username &&
                                    <div className="outgoing_msg">
                                        <div className="sent_msg">
                                            <p>{eachincoming.message}</p>
                                        </div>
                                    </div>
                                ||
                                eachincoming.content !== undefined &&
                                <div className="user_join">
                                    <p>{eachincoming.content} </p>
                                </div>
                            )}

                    </div>

                    { this.state.clientConnected && !this.state.sentUser &&
                        <div className="type_msg">
                            <div className="input_msg_write">
                                <input type="text" className="write_msg" ref={(el) => this.userId = el}
                                       placeholder="Type your Name"/>
                                <button className="msg_send_btn" type="button" onClick={(e) => {
                                    this.sendUser(e)
                                }}>
                                    <Icon className={classes.rightIcon}>send</Icon>
                                </button>
                            </div>
                        </div>
                    }
                    { this.state.sentUser &&
                        <form className="type_msg">
                            <div className="input_msg_write">
                                <input type="text" className="write_msg" ref={(el) => this.inputText = el}
                                       placeholder="Type a message"/>
                                <button className="msg_send_btn" type="button" onClick={(e) => {
                                    this.sendMessage(e)
                                }}>
                                    <Icon className={classes.rightIcon}>send</Icon>
                                </button>
                            </div>
                        </form>
                    }
                </div>
                <div className="col-2">
                <ul>
                {userList && userList.map((username) => <li>{username}</li>)}

                </ul>
                </div>
                </div>
                <SockJsClient url="https://chatapplication01.herokuapp.com/chat" topics={["/topic/all", "/topic/user", "/topic/message"]}
                              onMessage={ this.onMessageReceive } ref={ (client) => { this.clientRef = client }}
                              onConnect={ () => { this.onConnect() } }
                              onDisconnect={ () => { this.setState({ clientConnected: false }) } }
                              debug={ true }
                />
            </div>
        );
    }
}

SampleComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};



export default withStyles(styles)(SampleComponent);
