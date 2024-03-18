document.addEventListener("DOMContentLoaded", function() {
  const startBtn = document.getElementById('startTimer');
  const pauseBtn = document.getElementById('pauseTimer');
  const stopBtn = document.getElementById('stopTimer');
  const timerDisplay = document.getElementById('timerDisplay');
  let countdown;
  let isPaused = false;
  let currentSessionType = 'pomodoro'; // 'pomodoro' or 'break'
  let currentDuration = 25; // Default duration, can be dynamically set based on user settings

  function fetchAndStartTimer(duration, type) {
    fetch('/timer/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ duration, type })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Timer started:', data);
      startTimer(duration);
    })
    .catch(error => {
      console.error('Error starting timer:', error.message, error.stack);
    });
  }

  startBtn.addEventListener('click', () => {
    if (!isPaused) {
      fetchAndStartTimer(currentDuration, currentSessionType);
    } else {
      isPaused = false;
    }
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    startBtn.disabled = true;
  });

  pauseBtn.addEventListener('click', () => {
    isPaused = true;
    clearInterval(countdown);
    pauseBtn.disabled = true;
    startBtn.disabled = false;
    console.log('Timer paused');
  });

  stopBtn.addEventListener('click', () => {
    clearInterval(countdown);
    fetch('/timer/stop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Assuming the backend can identify the active timer by the user session
    })
    .then(response => response.json())
    .then(data => {
      console.log('Timer stopped:', data);
      timerDisplay.textContent = currentSessionType === 'pomodoro' ? '25:00' : '05:00'; // Reset display based on session type
      currentSessionType = currentSessionType === 'pomodoro' ? 'break' : 'pomodoro';
      currentDuration = currentSessionType === 'pomodoro' ? 25 : 5; // Switch between pomodoro and break durations
    })
    .catch(error => {
      console.error('Error stopping timer:', error.message, error.stack);
    });
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    startBtn.disabled = false;
    console.log('Timer stopped');
  });

  function startTimer(duration) {
    let timer = duration * 60;
    countdown = setInterval(() => {
      if (!isPaused) {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.textContent = `${minutes}:${seconds}`;

        if (--timer < 0) {
          clearInterval(countdown);
          console.log('Timer session completed');
          // Automatically transition to break or next Pomodoro session
          if (currentSessionType === 'pomodoro') {
            currentSessionType = 'break';
            currentDuration = 5; // Break duration, can be dynamically set based on user settings
          } else {
            currentSessionType = 'pomodoro';
            currentDuration = 25; // Pomodoro duration, can be dynamically set based on user settings
          }
          fetchAndStartTimer(currentDuration, currentSessionType);
        }
      }
    }, 1000);
  }
});