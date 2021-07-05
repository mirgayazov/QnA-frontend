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
      <button onClick={props.sendMsg}><img src="https://img.icons8.com/material-outlined/24/000000/upload-mail.png" /></button>
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
  let [language, setLanguage] = useState('')
  let greeting = {
    id: 1,
    textRU: 'Здравствуйте, я могу ответить на ваши вопросы!',
    textEN: 'Hello, I can answer your questions!',
    author: BOT,
  }
  let [messages, setMessages] = useState([])

  let translate = (text, language) => {
    return SERVICE.translate(text, language);
  }

  let saveMsg = msg => {
    messages.push(msg)
    setMessages([...messages]);
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
    if (language === RU) {
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
    } else {
      axios.get(`http://127.0.0.1:5000/?question=${question}`)
        .then(response => {
          let ans = newMsg(response.data, BOT);
          saveMsg(ans);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  let sendMsg = () => {
    let input = document.getElementById('msg');
    let msg = newMsg(input, USER);
    saveMsg(msg);
    findAnswer(msg.text);
    clearInput(input);
  }

  return (
    <div className='content' style={{ overflow: 'hidden' }}>
      {language === RU ?
        <><div className="App" style={{ overflowY: 'scroll' }}>
          <Message text={language === EN ? greeting.textEN : greeting.textRU} author={greeting.author} />
          {messages.map(msg => <Message text={msg.text} author={msg.author} />)}
        </div>
          <Control sendMsg={sendMsg} />
        </>
        : <></>
      }

      {language === EN ?
        <><div className="App" style={{ overflowY: 'scroll' }}>
          <Message text={language === EN ? greeting.textEN : greeting.textRU} author={greeting.author} />
          {messages.map(msg => <Message text={msg.text} author={msg.author} />)}
        </div>
          <Control sendMsg={sendMsg} />
        </>
        : <></>
      }

      {language === '' ?
        <div className='langSelectDiv'>
          <p>Choose language | Выберите язык</p>
          <button className='langSelectBtn' onClick={() => setLanguage(EN)}>EN</button>
          <button className='langSelectBtn' onClick={() => setLanguage(RU)}>RU</button>
        </div> : <></>
      }


      {/* <Control sendMsg={sendMsg} /> */}
    </div>
  );
}

export default Chat;
