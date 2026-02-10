// Gallery Logic

const galleryData = {
    spardha: [
        { src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop', caption: 'Football Tournament' },
        { src: 'https://images.unsplash.com/photo-1553633914-935b1d1dbda0?q=80&w=600&auto=format&fit=crop', caption: 'Cricket Match' },
        { src: 'https://images.unsplash.com/photo-1547347298-057545934664?q=80&w=600&auto=format&fit=crop', caption: 'Volleyball Finals' }
    ],
    trividya: [
        { src: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=600&auto=format&fit=crop', caption: 'Dance Performance' },
        { src: 'https://images.unsplash.com/photo-1499364615650-ec387c13b77e?q=80&w=600&auto=format&fit=crop', caption: 'Art Exhibition' },
        { src: 'https://images.unsplash.com/photo-1459749411177-287ce3288784?q=80&w=600&auto=format&fit=crop', caption: 'Music Night' }
    ],
    techfest: [
        { src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop', caption: 'Robotics Competition' },
        { src: 'https://images.unsplash.com/photo-1504384308090-c54be3852d92?q=80&w=600&auto=format&fit=crop', caption: 'Hackathon' },
        { src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop', caption: 'Science Model' }
    ]
};

let currentCategory = '';
let currentIndex = 0;

function openLightbox(category) {
    if (!galleryData[category]) return;

    currentCategory = category;
    currentIndex = 0;

    updateLightbox();
    document.getElementById('galleryLightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('galleryLightbox').classList.remove('active');
}

function updateLightbox() {
    const item = galleryData[currentCategory][currentIndex];
    document.getElementById('lightboxImg').src = item.src;
    document.getElementById('lightboxCaption').textContent = item.caption;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % galleryData[currentCategory].length;
    updateLightbox();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + galleryData[currentCategory].length) % galleryData[currentCategory].length;
    updateLightbox();
}

// Event Listeners for Buttons
document.addEventListener('DOMContentLoaded', () => {
    // Add click listeners to 'View Photos' buttons
    const buttons = document.querySelectorAll('.tilesWrap button');

    // Spardha
    buttons[0].addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox('spardha');
    });

    // Trividya
    buttons[1].addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox('trividya');
    });

    // Techfest
    buttons[2].addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox('techfest');
    });

    // Lightbox Controls
    document.querySelector('.close-btn').addEventListener('click', closeLightbox);
    document.querySelector('.next-btn').addEventListener('click', nextImage);
    document.querySelector('.prev-btn').addEventListener('click', prevImage);

    // Close on background click
    document.getElementById('galleryLightbox').addEventListener('click', (e) => {
        if (e.target.id === 'galleryLightbox') {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('galleryLightbox').classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
});
