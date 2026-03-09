// Countdown Timer - 
(function () {
    // EVENT DATE - 
    var eventDate = new Date('February 20, 2026 09:00:00').getTime();

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    if (!daysEl) return; // Not on homepage

    function updateCountdown() {
        var now = new Date().getTime();
        var distance = eventDate - now;

        if (distance < 0) {
            // Event has started
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            var label = document.querySelector('.countdown-label');
            if (label) label.textContent = ' EVENT IS LIVE!';
            return;
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = days < 10 ? '0' + days : days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
})();
