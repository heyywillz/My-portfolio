const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("nav");

// Navigation toggle functionality
navToggle.addEventListener("click", () => {
  nav.classList.toggle("active");

  navToggle.innerHTML = nav.classList.contains("active")
    ? '<i class="fa fa-times"></i>'
    : '<i class="fa fa-bars"></i>';
});

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
      full_name: formData.get('full_name') || contactForm.querySelector('input[placeholder="Full Name"]').value,
      email: formData.get('email') || contactForm.querySelector('input[placeholder="Email Address"]').value,
      subject: formData.get('subject') || contactForm.querySelector('input[placeholder="Subject"]').value,
      message: formData.get('message') || contactForm.querySelector('textarea[placeholder="Your Message"]').value
    };
    
    // Basic validation
    if (!data.full_name || !data.email || !data.message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    try {
      // Update button state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showNotification(result.message, 'success');
        contactForm.reset();
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Load projects from database
async function loadProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/featured`);
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
      displayProjects(result.data);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Display projects in the DOM
function displayProjects(projects) {
  const projectsContainer = document.querySelector('.projects-container');
  if (!projectsContainer) return;
  
  projectsContainer.innerHTML = '';
  
  projects.forEach(project => {
    const technologies = JSON.parse(project.technologies || '[]');
    
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    projectCard.innerHTML = `
      <div class="project-text">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${technologies.map(tech => `<span>${tech}</span>`).join('')}
        </div>
        <div class="project-btn">
          <a href="${project.github_url || '#'}" ${project.github_url ? 'target="_blank"' : ''}>
            ${project.github_url ? 'GitHub Repo' : 'Coming Soon'}
          </a>
          <a href="${project.live_demo_url || '#'}" ${project.live_demo_url ? 'target="_blank"' : ''}>
            ${project.live_demo_url ? 'Live Demo' : 'Coming Soon'}
          </a>
        </div>
      </div>
      <div class="project-image">
        <img src="${project.image_url || 'assets/placeholder.jpg'}" alt="${project.title}" />
      </div>
    `;
    
    projectsContainer.appendChild(projectCard);
  });
}

// Load testimonials from database
async function loadTestimonials() {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials/featured`);
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
      displayTestimonials(result.data);
    }
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
}

// Display testimonials in the DOM
function displayTestimonials(testimonials) {
  const testimonialsContainer = document.querySelector('.testimonial-cards');
  if (!testimonialsContainer) return;
  
  testimonialsContainer.innerHTML = '';
  
  // Group testimonials into pairs for the layout
  for (let i = 0; i < testimonials.length; i += 2) {
    const testimonialCard = document.createElement('div');
    testimonialCard.className = 'testimonial-card';
    
    let cardHTML = '';
    
    // First testimonial
    if (testimonials[i]) {
      const testimonial = testimonials[i];
      cardHTML += `
        <div class="card">
          <div class="card-title">
            <h3>${testimonial.client_name}</h3>
            <i class="fa fa-quote-right" aria-hidden="true"></i>
          </div>
          <span>${testimonial.client_position}${testimonial.client_company ? ` at ${testimonial.client_company}` : ''}</span>
          <p>${testimonial.testimonial_text}</p>
        </div>
      `;
    }
    
    // Second testimonial
    if (testimonials[i + 1]) {
      const testimonial = testimonials[i + 1];
      cardHTML += `
        <div class="card">
          <div class="card-title">
            <h3>${testimonial.client_name}</h3>
            <i class="fa fa-quote-right" aria-hidden="true"></i>
          </div>
          <span>${testimonial.client_position}${testimonial.client_company ? ` at ${testimonial.client_company}` : ''}</span>
          <p>${testimonial.testimonial_text}</p>
        </div>
      `;
    }
    
    testimonialCard.innerHTML = cardHTML;
    testimonialsContainer.appendChild(testimonialCard);
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notif => notif.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;
  
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Close functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadTestimonials();
});
