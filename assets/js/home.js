async function validateUsername(element){
    const username = element.value;
    try {
        user = await axios.get(`http://localhost:5000/api/users?userName=${username}`);
        element.setCustomValidity("")
        element.reportValidity()
    } catch{
        element.setCustomValidity("Username doesn't exists!")
        element.reportValidity()
    }
    const form = document.getElementById("createTransaction");
    const current_user = form.username.value;
    if (username === current_user){
        element.setCustomValidity("Current username is not allowed!")
        element.reportValidity()
    }
}

function validateAmount(element){
    const amount = element.value;
    if (amount<=0){
        element.setCustomValidity("Amount must be bigger then 0!")
        element.reportValidity()
    }else{
        element.setCustomValidity("")
        element.reportValidity()
    }
}

async function newTransaction(event){
    event.preventDefault(); 
    const form = document.getElementById("createTransaction");

    const src = form.src.value;
    const dst_username = form.dst.value;
    const user = await axios.get(`http://localhost:5000/api/users?userName=${dst_username}`);
    const dst = user.data[0]._id
    const amount = form.amount.value;
    try {
        const response = await axios.post("http://localhost:5000/api/transactions", {
        sourceUserID: src,
        destenationUserID: dst,
        amount: amount,
        });

        const responseData = response.data;
        window.location = "http://localhost:5000/";
    } catch (error) {
        console.error(error);
    }
}

function filter() {
    const fromDateInput = document.getElementById("fromDate");
    const toDateInput = document.getElementById("toDate");

    if (fromDateInput.value==="") {
      fromDateInput.setCustomValidity("Must insert");
      fromDateInput.reportValidity();
      return false;
    } else {
      fromDateInput.setCustomValidity("");
      fromDateInput.reportValidity();
    }
  
    if (toDateInput.value==="") {
      toDateInput.setCustomValidity("Must insert");
      toDateInput.reportValidity();
      return false;
    } else {
      toDateInput.setCustomValidity("");
      toDateInput.reportValidity();
    }
    const fromDate = new Date(fromDateInput.value)
    const toDate = new Date(toDateInput.value)
    if (fromDate >= toDate){
        toDateInput.setCustomValidity("To date must be bigger");
        toDateInput.reportValidity();
        return false;
    }
    else{
        toDateInput.setCustomValidity("");
        toDateInput.reportValidity();
    }
    console.log(toDate)
    console.log(fromDate)
  }