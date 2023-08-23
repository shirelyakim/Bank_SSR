async function validateUsername(element){
    const username = element.value; 
    try {
        user = await axios.get(`http://localhost:5000/api/users?userName=${username}`); // Fetch user data from the server.
        if (user.data[0].disabled){
            element.setCustomValidity("Username doesn't exists!") // Set a custom validation message if the username is disabled.
            element.reportValidity() // Report the validation message to the user.
        }else{
            element.setCustomValidity("") // Reset custom validation message
            element.reportValidity() // Report that the input is valid.
        }
    } catch{
        element.setCustomValidity("Username doesn't exists!")
        element.reportValidity()
    }
    const form = document.getElementById("createTransaction");
    const current_user = form.username.value; // Get the current user's username from the form.
    if (username === current_user){
        element.setCustomValidity("Current username is not allowed!")
        element.reportValidity()
    }
}

function validateAmount(element){
    const amount = element.value;
    if (amount<=0){
        element.setCustomValidity("Amount must be higher than 0!")
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

async function filter() {
    // Get the input elements
    const fromDateInput = document.getElementById("fromDate");
    const toDateInput = document.getElementById("toDate");
    // Check if from date is empty
    
    if (fromDateInput.value==="") {
      fromDateInput.setCustomValidity("Must insert");
      fromDateInput.reportValidity();
      return false;
    } else {
      fromDateInput.setCustomValidity("");
      fromDateInput.reportValidity();
    }

    // Check if to date is empty
    if (toDateInput.value==="") {
      toDateInput.setCustomValidity("Must insert");
      toDateInput.reportValidity();
      return false;
    } else {
      toDateInput.setCustomValidity("");
      toDateInput.reportValidity();
    }
     // Convert from and to dates to Date objects and set time to start and end of day
    let fromDate = new Date(fromDateInput.value)
    fromDate = fromDate.setHours(0,0,0,0)
    let toDate = new Date(toDateInput.value)
    toDate = toDate.setHours(23,59,59,59)

     // Check if from date is greater than to date
    if (fromDate > toDate){
        toDateInput.setCustomValidity("To date must be bigger");
        toDateInput.reportValidity();
        return false;
    }
    else{
        toDateInput.setCustomValidity("");
        toDateInput.reportValidity();
    }
    // Initialize arrays to store transactions
    let transactions = []
    let outTransactions
    let inTransactions
    const form = document.getElementById("createTransaction");
    const user_id = form.src.value;
    try{ outTransactions = (await axios.get(`http://localhost:5000/api/transactions?sourceUserID=${user_id}`)).data
    } catch {outTransactions = []}
    try{ inTransactions = (await axios.get(`http://localhost:5000/api/transactions?destenationUserID=${user_id}`)).data
    } catch {inTransactions = []}
    // Create a dictionary/ an object of users using their IDs as keys
    var users = {};
    let rawUsers = (await axios.get(`http://localhost:5000/api/users`)).data
    for (let i = 0; i < rawUsers.length; i++) {
        users[rawUsers[i]._id] = rawUsers[i] 
    }
    // Filter and format transactions based on date range
    for (let i = 0; i < outTransactions.length; i++) {
        let transactionDate = new Date(outTransactions[i].date)
        if(transactionDate <= toDate && transactionDate >= fromDate){
            transactions.push({"id": outTransactions[i]._id,"date": new Date(outTransactions[i].date),
             "amount": `-${outTransactions[i].amount}`, "username": users[`${outTransactions[i].destenationUserID}`].userName})
        }
    }
    for (let i = 0; i < inTransactions.length; i++) {
        let transactionDate = new Date(inTransactions[i].date)
        if(transactionDate <= toDate && transactionDate >= fromDate){
            transactions.push({"id": inTransactions[i]._id,"date": new Date(inTransactions[i].date),
             "amount": `+${inTransactions[i].amount}`, "username": users[`${inTransactions[i].sourceUserID}`].userName})
        }
    }
    // Sort transactions by date in descending order
    transactions = transactions.sort(function(a,b){return b.date - a.date;});
    // Update the transactions table in the HTML
    var transactionsTableBody = document.getElementById("transactionsTable");
    transactionsTableBody.innerHTML = "";
    for (var i = 0; i < transactions.length; i++) {
        var newRow = document.createElement("tr");
        
        var dateCell = document.createElement("td");
        dateCell.textContent = transactions[i].date.toLocaleDateString("en-GB");
        newRow.appendChild(dateCell);
        
        var usernameCell = document.createElement("td");
        usernameCell.textContent = transactions[i].username;
        newRow.appendChild(usernameCell);
        
        var amountCell = document.createElement("td");
        amountCell.textContent = transactions[i].amount + "₪";
        newRow.appendChild(amountCell);
        
        transactionsTableBody.appendChild(newRow);
    }
  }

function cleanModal(){
const form = document.getElementById("createUserForm");
document.getElementById("createSrc").checked = null;
document.getElementById("createDst").value = null;
document.getElementById("createAmount").value = null;
}