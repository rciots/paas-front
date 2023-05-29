const socket = io(); // Connect to the Socket.IO server
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        console.log("login: " + loginForm.inputUsername.value);
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the email and password from the form
        const username = loginForm.inputUsername.value;
        const password = loginForm.inputPassword.value;

        // Emit a message to the server with the login form data
        socket.emit('login', { username, password });
    });
    socket.on('login-success', (data) => {
        console.log(data.message);
    });
    socket.on('loginMessage', (data) => {
        document.getElementById('logginMessage').innerHTML = data.message;
        console.log(data.message);
        console.log(socket.request.session);
    });
});
