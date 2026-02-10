document.addEventListener('DOMContentLoaded', function () {
    // Handle Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                message: document.getElementById('contactMessage').value
            };

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const result = await response.json();

                if (result.success) {
                    alert('Message sent successfully!');
                    this.reset();
                } else {
                    alert('Failed to send message: ' + result.error);
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred: ' + err.message);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    }

    // Handle Check Registration Submission
    const checkRegForm = document.getElementById('checkRegForm');
    if (checkRegForm) {
        checkRegForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const btn = this.querySelector('button');
            const resultBox = document.getElementById('checkResult');

            btn.textContent = 'Searching...';
            btn.disabled = true;
            resultBox.style.display = 'none';
            resultBox.innerHTML = '';

            const query = document.getElementById('regQuery').value;

            try {
                const response = await fetch('/api/check-registration', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    throw new Error(`Server returned status: ${response.status}`);
                }

                const result = await response.json();

                if (result.success) {
                    resultBox.style.display = 'block';

                    if (result.registrations.length === 0) {
                        resultBox.innerHTML = '<p>No registrations found for this email/ID.</p>';
                    } else {
                        let html = '<h3>Found Registrations:</h3>';
                        result.registrations.forEach(reg => {
                            const dateStr = reg.date ? new Date(reg.date).toLocaleDateString() : 'N/A';
                            html += `
                <div class="event-item">
                  <strong>Event:</strong> ${reg.event} <br>
                  <strong>Program:</strong> ${reg.programType} <br>
                  <small>Order ID: ${reg.orderId || 'N/A'}</small><br>
                  <small>Status: ${reg.status} | Date: ${dateStr}</small>
                </div>
              `;
                        });
                        resultBox.innerHTML = html;
                    }
                } else {
                    alert('Error searching: ' + (result.error || 'Unknown error'));
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred: ' + err.message);
            } finally {
                btn.textContent = 'Check Status';
                btn.disabled = false;
            }
        });
    }
});
