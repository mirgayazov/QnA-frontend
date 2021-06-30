import './App.css';
import React, { useState } from 'react';
const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
const PROJECTID = 'trans-315811';
const SERVICE = new Translate({ PROJECTID });
SERVICE.key = 'AIzaSyB7d1S7QIn7L01wMzwxWi7PhS5Z3FroXb0'
const RU = 'ru'
const EN = 'en'
const USER = 'user';
const BOT = 'bot';

const Control = (props) => {
  return (
    <div className='control'>
      <input id='msg' placeholder='введите сообщение' />
      <button onClick={props.sendMsg}>отправить</button>
    </div>
  )
}

const Message = (props) => {
  let align = null
  props.author === BOT ? align = 'left' : align = 'right'
  return (
    <div className={'Message ' + align} >
      {props.text}
    </div >
  )
}

const Chat = () => {
  let [messages, setMessages] = useState([{
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: BOT,
  },
  {
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: BOT,
  }
  ,
  {
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: BOT,
  }
  ,
  {
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: BOT,
  }
  ,
  {
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: BOT,
  }
  ,
  {
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: USER,
  }
  ,
  {
    id: 1,
    text: 'Здравствуйте, я могу ответить на ваши вопросы!',
    author: BOT,
  }
])

  let translate = (text, language) => {
    return SERVICE.translate(text, language);
  }

  let saveMsg = msg => {
    setMessages([...messages, msg]);
  }

  let newMsg = (input, author) => {
    switch (author) {
      case BOT:
        return { id: messages.length + 1, text: input, author };
      case USER:
        return { id: messages.length + 1, text: input.value, author };
      default:
        break;
    }
  };

  let clearInput = (input) => {
    input.value = '';
  }

  let findAnswer = question => {
    translate(question, EN)
      .then(result => {
        axios.get(`http://127.0.0.1:5000/?question=${result[0]}`)
          .then(response => {
            translate(response.data, RU)
              .then(result => {
                let ans = newMsg(result[0], BOT);
                saveMsg(ans);
              })
          })
          .catch(error => {
            console.log(error);
          })
      })
  }

  let sendMsg = () => {
    let input = document.getElementById('msg');
    let msg = newMsg(input, USER);
    saveMsg(msg);
    findAnswer(msg.text);
    clearInput(input);
  }

  return (
    <div className='content'>
      <div className="App">
        {messages.map(msg => <Message text={msg.text} author={msg.author} />)}
        <Control sendMsg={sendMsg} />
      </div>
    </div>
  );
}

export default Chat;
