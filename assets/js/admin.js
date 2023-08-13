async function validateUsername(element){
  const username = element.value;
  valid = false
  try {
      user = await axios.get(`http://localhost:5000/api/users?userName=${username}`);
  } catch{
    valid = true
  }

  if (valid){
      element.setCustomValidity("")
      element.reportValidity()
  }else{
    element.setCustomValidity("Current username is not allowed!")
    element.reportValidity()    
  }
}

async function createUser(event){
  event.preventDefault();
  const form = document.getElementById("createUserForm");
  let isAdmin = form.isAdmin.checked;
  const username = form.username.value;
  const password = form.password.value;
  const birthDate = form.birthDate.value;

  try {
      const response = await axios.post("http://localhost:5000/api/users", {
      userName: username,
      password: password,
      isAdmin: isAdmin,
      birthDate: birthDate,
      });

      const responseData = response.data;
      window.location = "http://localhost:5000/admin";
  } catch (error) {
      console.error(error);
  }
}

function validateDate(element){
  const currentDate = new Date(); // Get the current date

  const birthDate = new Date(element.value);

  if (birthDate >= currentDate) { // Compare birthdate with current date
    element.setCustomValidity("Birthdate must be smaller than current date");
    element.reportValidity();
  } else {
    element.setCustomValidity("");
    element.reportValidity();
  }
  console.log("test")
}