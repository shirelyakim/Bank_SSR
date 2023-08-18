async function initChart(){
  let positive = 0
  let negative = 0
  const users = (await axios.get(`http://localhost:5000/api/users`)).data;
  for(const user of users){
    if(user.balance > 0 ){
      positive++
    }else{
      negative++
    }
  }

  var data = {
    labels: ['Positive Balance', 'Negative Balance'],
    datasets: [{
        data: [positive, negative], // You can change these values based on your actual data
        backgroundColor: [
            'rgba(54, 162, 235, 0.7)', // Blue for positive balance
            'rgba(255, 99, 132, 0.7)'  // Red for negative balance
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
    }]
  };
  var options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
          display: true,
          text: 'Accounts State'
      }
  };

  // Create the positive and negative balance pie chart
  var ctx = document.getElementById('balancePieChart').getContext('2d');
  var balancePieChart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: options
  });
}

async function initBar() {
  const transactions = (await axios.get(`http://localhost:5000/api/transactions`)).data;
  const aggregatedData = {};
  
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(sevenDaysAgo);
    currentDate.setDate(currentDate.getDate() + i);

    const dateString = currentDate.toISOString().substring(0, 10);
    aggregatedData[dateString] = 0
  }

  for (const transaction of transactions) {
      const dateString = transaction.date.substring(0, 10);
    if (new Date(dateString) >= sevenDaysAgo){
      aggregatedData[dateString] += 1;
    }
  }
  const chartLabels = Object.keys(aggregatedData);
  const chartData = Object.values(aggregatedData);

  const ctx = document.getElementById('documentCountChart').getContext('2d');
  const documentCountChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: chartLabels,
          datasets: [{
              label: 'Transactions Count',
              data: chartData,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          title: {
              display: true,
              text: 'Transactions Count Per Day'
          }
      }
  });
}

window.onload = function() {
  initChart();
  initBar();
};