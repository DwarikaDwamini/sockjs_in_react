import React from "react";
import SockJsClient from "react-stomp";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import "../chatContainer.css";
import chatIcon from '../images/chatbot.svg';
import personIcon from '../images/person.svg'


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
        this.clientRef.sendMessage("/app/user", JSON.stringify({username: username}));
        this.clientRef._subscribe("/topic/"+username);
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
            this.setState(prevState => ({
                messagesReceived: [...prevState.messagesReceived, msg],
            }));
    }


    render() {
        const messagesReceived = this.state.messagesReceived;
        const username = this.state.username;
        return (
            <div className="container chatContainer">
              <div className="row">
                  <div className="col-md-4"></div>
                <div className="mesgs col-sm-12 col-md-5 col-lg-5 justify-content-end">
                    <div className="msg_history">
                        {messagesReceived  && messagesReceived.map((eachincoming) =>
                            eachincoming.username !== undefined
                            ?
                                eachincoming.username !== username &&
                                <div className="user_join">
                                    <p>{eachincoming.username} joined </p>
                                </div>
                            :
                                (eachincoming.user !== username && eachincoming.content === undefined &&
                                    <div className="incoming">
                                        <div className="incoming_msg_img">
                                            <img src={chatIcon} alt="chat" />
                                        </div>
                                        <div className="incoming_msg">
                                            <div className="incoming_msg_content">
                                                <p>{eachincoming.message}</p>
                                                <span  className="time_date">{eachincoming.user} | {moment().format('LT')}</span>
                                            </div>
                                        </div>
                                    </div>)
                                ||

                                (eachincoming.user === username &&
                                    <div className="outgoing">
                                        <div className="outgoing_msg_img">
                                            <img src={personIcon} alt="user" />
                                        </div>
                                        <div className="outgoing_msg">
                                            <div className="outgoing_msg_content">
                                                <p>{eachincoming.message}</p>
                                                <span className="time_date">{eachincoming.user} | {moment().format('LT')}</span>
                                            </div>
                                        </div>
                                    </div>)
                                ||
                                (eachincoming.content !== undefined &&
                                <div className="user_join">
                                    <p>{eachincoming.content} </p>
                                </div>)
                            )}

                    </div>

                    { this.state.clientConnected && !this.state.sentUser &&
                        <form className="type_msg" onSubmit={this.sendUser}>
                            <div className="input_msg_write">
                                <input type="text" className="write_msg" ref={(el) => this.userId = el}
                                       placeholder="Type your Name"/>
                            </div>
                        </form>
                    }
                    { this.state.sentUser &&
                        <form className="type_msg" onSubmit={this.sendMessage}>
                            <div className="input_msg_write">
                                <input type="text" className="write_msg" ref={(el) => this.inputText = el}
                                       placeholder="Type a message"/>
                            </div>
                        </form>
                    }
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
