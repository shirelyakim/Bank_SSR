async function validateUsername(element){
  const username = element.value;
  let user
  try {
      user = await axios.get(`http://localhost:5000/api/users?userName=${username}`);
  } catch{}
  if (!user){
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

function cleanModal(){
  const form = document.getElementById("createUserForm");
  document.getElementById("isAdmin").checked = false;
  document.getElementById("username").value = null;
  document.getElementById("password").value = null;
  document.getElementById("birthDate").value = null;
}

function validateDate(element){
  const currentDate = new Date(); // Get the current date

  const birthDate = new Date(element.value);

  if (birthDate >= currentDate) { // Compare birthdate with current date
    element.setCustomValidity("Birth date must be earlier than current date");
    element.reportValidity();
  } else {
    element.setCustomValidity("");
    element.reportValidity();
  }
}

async function editUserClick(user_id){
  const user = await axios.get(`http://localhost:5000/api/users/${user_id}`)
  const adminInput = document.getElementById("editIsAdmin");
  const disabledInput = document.getElementById("editDisabled");
  document.getElementById("editUserId").value = user_id;

  if (user.data.disabled){
    disabledInput.checked = true
  }else{
    disabledInput.checked = false
  }
  if (user.data.isAdmin){
    adminInput.checked = true
  }else{
    adminInput.checked = false
  }
}

async function editUser(event){
  event.preventDefault();
  const isAdmin = document.getElementById("editIsAdmin").checked;
  const disabled = document.getElementById("editDisabled").checked;
  const user_id = document.getElementById("editUserId").value

  try {
      const response = await axios.post(`http://localhost:5000/api/users/${user_id}`, {
      isAdmin: isAdmin,
      disabled: disabled,
      });

      const responseData = response.data;
      window.location = "http://localhost:5000/admin";
  } catch (error) {
      console.error(error);
  }
}
