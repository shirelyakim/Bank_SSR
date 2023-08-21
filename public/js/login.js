async function login(event){
    event.preventDefault(); // Prevent the default form submission behavior
    const form = document.getElementById("login-form");// Get the login form element

    const username = form.username.value; // Get the value of the username input field
    const password = form.password.value; // Get the value of the password input field

    const errorLabel = document.getElementById("error"); // Get the error label element
    try {
        const response = await axios.post("http://localhost:5000/login", {
        username: username,
        password: password,
        });
        // Send a POST request to the server's login endpoint with username and password

        const responseData = response.data; // Get the data from the server's response
        if(responseData === "OK"){
            window.location.href = "/"; // Redirect to the homepage if login is successful
        }else{
            errorLabel.textContent = "Wrong username or password"; // Display an error message if login fails
        }
    } catch (error) {
        console.error(error); // Log the error to the console
        errorLabel.textContent = "Wrong username or password"; // Display an error message if an error occurs during the request
    }
}