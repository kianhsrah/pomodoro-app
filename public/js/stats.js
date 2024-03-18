document.addEventListener("DOMContentLoaded", function() {
  const ctxPomodoro = document.getElementById('pomodoroSessionsChart').getContext('2d');
  const ctxAverage = document.getElementById('averageDurationChart').getContext('2d');

  fetch('/stats')
    .then(response => response.json())
    .then(data => {
      const pomodoroLabels = data.map(stat => stat._id);
      const pomodoroData = data.map(stat => stat.totalCount);

      const averageDurationData = data.map(stat => stat.averageDuration);

      new Chart(ctxPomodoro, {
        type: 'bar',
        data: {
          labels: pomodoroLabels,
          datasets: [{
            label: '# of Sessions',
            data: pomodoroData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      new Chart(ctxAverage, {
        type: 'bar',
        data: {
          labels: ['Average Duration'],
          datasets: [{
            label: 'Duration in Minutes',
            data: averageDurationData,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error loading statistics:', error.message, error.stack);
    });
});