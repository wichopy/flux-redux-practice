import { createStore, combineReducers } from 'redux';
export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';

export const UPDATE_STATUS = 'UPDATE_STATUS';
export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';

const defaultState = {
    messages: [{
        date: new Date('2017-04-10 13:11:55'),
        postedBy: 'Stan',
        content: 'I am the Stanest Stan'
    }, {
        date: new Date('2017-04-10 13:12:00'),
        postedBy: 'Bob',
        content: 'I hate Stan'
    }, {
        date: new Date('2017-04-10 13:12:05'),
        postedBy: 'Mike',
        content: 'Stan stinks'
    }, {
        date: new Date('2017-04-10 13:12:10'),
        postedBy: 'Stan',
        content: 'Leave me alone :('
    }],
    userStatus: ONLINE
}

// const reducer = (state = defaultState, { type, value }) => {
//     switch (type) {
//         case UPDATE_STATUS:
//             return {...state, userStatus: value };
//             break;
//     }
//     return state;
// }

const userStatusReducer = (state = defaultState.userStatus, { type, value }) => {
    switch (type) {
        case UPDATE_STATUS:
            return value;
            break;
    }
    return state;
}

const messagesReducer = (state = defaultState.messages, { type, value, postedBy, date }) => {
    switch (type) {
        case CREATE_NEW_MESSAGE:
            const newState = [{ date, postedBy, content: value }, ...state]
            return newState;
    }
    return state
}

const combinedReducer = combineReducers({
    userStatus: userStatusReducer,
    messages: messagesReducer
})

const store = createStore(combinedReducer);

document.forms.newMessage.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = e.target.newMessage.value;
    const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).userName : "Jim";
    store.dispatch(newMessageAction(value, username))
})

const render = () => {
    const { messages, userStatus } = store.getState();
    document.getElementById('messages').innerHTML = messages
        .sort((a, b) => b.date - a.date)
        .map(message => (`
          <div>
            ${message.postedBy} : ${message.content}
          </div>
        `)).join("");
    document.forms.newMessage.fields.disabled = (userStatus === OFFLINE);
    document.forms.newMessage.newMessage.value = "";
}

const statusUpdateAction = (value) => {
    return {
        type: UPDATE_STATUS,
        value
    }
}

const newMessageAction = (content, postedBy) => {
    const date = new Date()
    return {
        type: CREATE_NEW_MESSAGE,
        value: content,
        postedBy,
        date
    }
}

document.forms.selectStatus.status.addEventListener('change', (e) => {
    store.dispatch(statusUpdateAction(e.target.value));
});

render();

store.subscribe(render);