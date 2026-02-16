// Dynamically load events from the server API
async function loadEvents() {
    const programType = document.getElementById('container__programType').value;
    const eventSelect = document.getElementById('container__event');
    const priceDisplay = document.getElementById('price-display');

    // Reset event dropdown and price display
    eventSelect.innerHTML = '';
    if (priceDisplay) priceDisplay.style.display = 'none';

    if (!programType) {
        eventSelect.innerHTML = '<option value="">--Select Program first--</option>';
        return;
    }

    // Show loading state
    eventSelect.innerHTML = '<option value="">Loading events...</option>';

    try {
        const response = await fetch('/api/events/' + encodeURIComponent(programType));
        const data = await response.json();

        if (data.success && data.events) {
            eventSelect.innerHTML = '<option value="">--Select Event--</option>';

            for (const eventName in data.events) {
                if (data.events.hasOwnProperty(eventName)) {
                    const option = document.createElement('option');
                    option.value = eventName;
                    option.textContent = eventName + (data.events[eventName].price > 0 ? ' (₹' + data.events[eventName].price + ')' : ' (Free)');
                    eventSelect.appendChild(option);
                }
            }
        } else {
            eventSelect.innerHTML = '<option value="">No events available</option>';
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventSelect.innerHTML = '<option value="">Error loading events</option>';
    }
}

// Initialize on load
window.onload = async function () {
    // Check registration status
    try {
        var response = await fetch('/api/registration-status');
        var data = await response.json();
        var submitBtn = document.getElementById('submit-btn');
        var btnText = document.getElementById('btn-text');

        if (!data.open) {
            // Disable button and show closed message
            submitBtn.disabled = true;
            submitBtn.style.background = '#555';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.style.opacity = '0.7';
            btnText.textContent = '🚫 Registration Closed';

            // Add a banner notice
            var container = document.querySelector('.container');
            var banner = document.createElement('div');
            banner.id = 'reg-closed-banner';
            banner.style.cssText = 'background: linear-gradient(135deg, #d32f2f, #b71c1c); color: white; padding: 15px 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; font-weight: bold; font-size: 16px;';
            banner.innerHTML = '🚫 Registration is currently closed. Please contact the administration.';
            container.insertBefore(banner, container.querySelector('form'));
        }
    } catch (err) {
        console.error('Could not check registration status:', err);
    }
};

// Fetch and display price when event is selected
async function updateEventPrice() {
    const programType = document.getElementById('container__programType').value;
    const event = document.getElementById('container__event').value;
    const priceDisplay = document.getElementById('price-display');
    const priceAmount = document.getElementById('price-amount');
    const priceEvent = document.getElementById('price-event');
    const submitBtn = document.getElementById('btn-text');

    if (!programType || !event) {
        priceDisplay.style.display = 'none';
        submitBtn.textContent = 'Pay & Register';
        return;
    }

    try {
        // Fetch event details including price
        const response = await fetch(`/api/event/${programType}/${encodeURIComponent(event)}`);
        const result = await response.json();

        if (result.success && result.event) {
            const price = result.event.price;
            const description = result.event.description;

            // Show price display
            priceDisplay.style.display = 'block';
            priceAmount.textContent = `₹${price}`;
            priceEvent.textContent = `${event} - ${description}`;

            // Update button text
            submitBtn.textContent = `Pay ₹${price} & Register`;

            console.log(`✅ Price fetched: ₹${price} for ${event}`);
        } else {
            priceDisplay.style.display = 'none';
            submitBtn.textContent = 'Pay & Register';
        }
    } catch (error) {
        console.error('Error fetching price:', error);
        priceDisplay.style.display = 'none';
        submitBtn.textContent = 'Pay & Register';
    }
}

// Listen for event selection change
const eventContainer = document.getElementById('container__event');
if (eventContainer) {
    eventContainer.addEventListener('change', updateEventPrice);
}
const programTypeContainer = document.getElementById('container__programType');
if (programTypeContainer) {
    programTypeContainer.addEventListener('change', updateEventPrice);
}

// Handle Payment and Registration
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Stop default form submission

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Basic client-side validation check
        if (!data.fullName || !data.email || !data.phoneNumber) {
            alert("Please fill all required fields.");
            return;
        }

        // Phone number validation (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(data.phoneNumber)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        try {
            // CHECK: Is registration open?
            const statusResponse = await fetch('/api/registration-status');
            const statusData = await statusResponse.json();
            if (!statusData.open) {
                alert("🚫 Registration is currently closed. Please contact the administration.");
                return;
            }

            // SECURITY: Fetch Razorpay key from server (not hardcoded!)
            const configResponse = await fetch('/api/config/razorpay');
            const config = await configResponse.json();

            // 1. Create Order with event details for dynamic pricing
            const response = await fetch('/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    programType: data.programType,
                    event: data.event
                })
            });

            if (response.status === 403) {
                alert("🚫 Registration is currently closed. Please contact the administration.");
                return;
            }

            const order = await response.json();

            if (!order || !order.id) {
                alert("Error starting payment. Please try again.");
                return;
            }

            // Store the actual event amount for later use
            window.currentEventAmount = order.eventAmount || (order.amount / 100);

            console.log(`Event: ${data.event} - Amount: ₹${window.currentEventAmount}`);

            // 2. Open Razorpay with server-provided key
            const options = {
                "key": config.key, // ✅ SECURE: Fetched from server, not visible in source
                "amount": order.amount,
                "currency": "INR",
                "name": "TechFest 2k26",
                "description": "Registration Fee",
                "order_id": order.id,
                "handler": function (response) {
                    // 3. Payment Successful - Submit Registration
                    submitRegistration(data, response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
                },
                "prefill": {
                    "name": data.fullName + " " + data.lastName,
                    "email": data.email,
                    "contact": data.phoneNumber
                },
                "theme": {
                    "color": "#3399cc"
                }
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();

            rzp1.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });

        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong. Please check console.");
        }
    });
}

async function submitRegistration(userData, paymentId, orderId, signature) {
    const payload = {
        ...userData,
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        razorpay_signature: signature,
        amount: window.currentEventAmount || 10 // Use actual event amount
    };

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        if (result.success) {
            alert(result.message);
            window.location.href = '/index.html';
        } else {
            alert("Registration failed: " + result.message);
        }
    } catch (err) {
        console.error("Registration error:", err);
        alert("Payment successful but registration failed. Contact support with Payment ID: " + paymentId);
    }
}
