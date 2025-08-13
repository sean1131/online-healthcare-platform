// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3BzzTtffo9hxv_zNeU8D9-MJB0PgIuAs",
  authDomain: "team5app-20eb7.firebaseapp.com",
  projectId: "team5app-20eb7",
  storageBucket: "team5app-20eb7.appspot.com",
  messagingSenderId: "946605117578",
  appId: "1:946605117578:web:6f0f5cd91c689ca1f05d73"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Auth state observer
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    document.getElementById('loginNavBtn').style.display = 'none';
    document.getElementById('accountNavBtn').style.display = 'flex';
  } else {
    document.getElementById('loginNavBtn').style.display = 'inline-block';
    document.getElementById('accountNavBtn').style.display = 'none';
  }
});

// Header hide/show on scroll
let lastScrollTop = 0;
const header = document.querySelector('.sticky-nav');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 200) {
    header.classList.add('nav-hidden');
  } else {
    header.classList.remove('nav-hidden');
  }
  
  lastScrollTop = scrollTop;
});

// Hero Slider functionality
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Add click events to dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

// Auto-advance slides
setInterval(nextSlide, 5000);

// Set minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

// Form submission
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Please login to book a consultation');
    window.location.href = 'login.html';
    return;
  }
  
  const formData = {
    userId: user.uid,
    userEmail: user.email,
    location: document.getElementById('location').value,
    specialty: document.getElementById('specialty').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    description: document.getElementById('description').value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: 'pending'
  };
  
  try {
    // Save to Firestore
    await db.collection('consultations').add(formData);
    
    // Show confirmation modal
    const locationText = document.getElementById('location').options[document.getElementById('location').selectedIndex].text;
    const specialtyText = document.getElementById('specialty').options[document.getElementById('specialty').selectedIndex].text;
    
    document.getElementById('bookingDetails').innerHTML = `
      <strong>Location:</strong> ${locationText}<br>
      <strong>Specialty:</strong> ${specialtyText}<br>
      <strong>Date:</strong> ${formData.date}<br>
      <strong>Time:</strong> ${formData.time}
    `;
    
    document.getElementById('confirmationModal').style.display = 'block';
    
    // Reset form
    document.getElementById('bookingForm').reset();
    
  } catch (error) {
    console.error('Error saving booking:', error);
    alert('Error booking consultation. Please try again.');
  }
});

// Close modal function
function closeModal() {
  document.getElementById('confirmationModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('confirmationModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}