async function login(event){
    event.preventDefault(); 
    const form = document.getElementById("login-form");

    const username = form.username.value;
    const password = form.password.value;

    const errorLabel = document.getElementById("error");
    try {
        const response = await axios.post("/login", {
        username: username,
        password: password,
        });

        const responseData = response.data;
        if(responseData === "OK"){
            window.location.href = "/"; 
        }else{
            errorLabel.textContent = "Wrong username or password";
        }
    } catch (error) {
        console.error(error);
        errorLabel.textContent = "Wrong username or password";
    }
}