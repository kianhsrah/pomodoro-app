document.addEventListener("DOMContentLoaded", function() {
    const settingsForm = document.getElementById('settingsForm');

    const fetchSettings = () => {
        fetch('/settings')
            .then(response => response.json())
            .then(settings => {
                document.getElementById('pomodoroDuration').value = settings.pomodoroDuration;
                document.getElementById('breakDuration').value = settings.breakDuration;
                document.getElementById('soundNotifications').checked = settings.notificationPreferences.sound;
                document.getElementById('visualNotifications').checked = settings.notificationPreferences.visual;
            })
            .catch(error => {
                console.error('Error loading settings:', error.message, error.stack);
                alert('Error loading settings. Please check the console for more details.');
            });
    };

    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(settingsForm);
        const pomodoroDuration = formData.get('pomodoroDuration');
        const breakDuration = formData.get('breakDuration');
        const soundNotifications = formData.get('notificationPreferences.sound') === 'on';
        const visualNotifications = formData.get('notificationPreferences.visual') === 'on';

        fetch('/settings', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                pomodoroDuration,
                breakDuration,
                notificationPreferences: { sound: soundNotifications, visual: visualNotifications }
            })
        }).then(() => {
            alert('Settings saved successfully.');
            fetchSettings(); // Refresh settings to reflect any changes
        }).catch(error => {
            console.error('Error saving settings:', error.message, error.stack);
            alert('Error saving settings. Please check the console for more details.');
        });
    });

    fetchSettings(); // Fetch settings on page load
});