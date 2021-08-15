const socket = io.connect();

// FORMULARIO
socket.emit('askData', messages);

const addMessage = (e) => {
    console.log('LLAMANDO A ADD MESSAGE');
    let info = {
      title: document.querySelector('#title').value,
      price: document.querySelector('#price').value,
      thumbnail: document.querySelector('#thumbnail').value,
    };
  
    socket.emit('new-message', info);
    return false;
  }
  
const render = data => {
    let html = data
      .map(function (elem, index) {
        //   console.log(elem)
        return `
          <tr class="tr">
            <th class="tr__th">${elem.message.title}</th>
            <td class="tr__td">${elem.message.price}</td>
            <td class="tr__td">${elem.message.thumbnail}</td>
          </tr>
          `;
      })
      .join(' ');
  
    document.querySelector('#messages').innerHTML = html;
  }
  
  socket.on('messages', data => {
    console.log('RECIBI PRODUCTO', data);
    render(data);
  });

//-----------------------------------------------

//COMENTARIOS
socket.emit('askComment', comments);

const sendData = (e) => {
    console.log('LLAMANDO A SEND DATA');
    let info = {
      email: document.querySelector('#email').value,
      comment: document.querySelector('#comment').value,
      time: moment().format('MMMM Do YYYY, h:mm:ss a'),
    };
  
    socket.emit('new-comment', info);
    return false;
  }
  
const renderComment = data => {
    let html = data
      .map(function (elem, index) {
        //   console.log(elem)
        return `
            <p class="comment"><b class="comment-blue">${elem.comment.email} <span class="comment-hour">[${elem.comment.time}]</span>:</b> ${elem.comment.comment}</p>
          `;
      })
      .join(' ');
  
    document.querySelector('#comments').innerHTML = html;
  }
  
  socket.on('comments', data => {
    console.log('RECIBI COMENTARIO',data);
    renderComment(data);
  });