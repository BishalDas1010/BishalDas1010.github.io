// Canvas Background Animation
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle properties
    const particlesArray = [];
    const numberOfParticles = 120;
    const colors = ['#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'];
    
    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: 180
    };
    
    // Get mouse position
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Create particle
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.3;
            this.originalSize = this.size;
        }
        
        // Update particle position
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary check
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }
            
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                
                this.speedX -= Math.cos(angle) * force * 0.6;
                this.speedY -= Math.sin(angle) * force * 0.6;
                
                // Scale particle size based on proximity to mouse
                this.size = this.originalSize * (1 + (mouse.radius - distance) / mouse.radius);
            } else {
                if (this.size > this.originalSize) {
                    this.size -= 0.1;
                }
                
                if (this.size < this.originalSize) {
                    this.size = this.originalSize;
                }
            }
            
            // Gradually normalize speed
            this.speedX *= 0.99;
            this.speedY *= 0.99;
        }
        
        // Draw particle
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Connect particles with lines
    function connectParticles() {
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - distance/120;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(76, 175, 80, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    // Initialize and start animation
    init();
    animate();
    
    // Resize canvas on window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particlesArray.length = 0;
        init();
    });
    
    // Custom cursor effect
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(function() {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 80);
        });
        
        // Change cursor size on hover interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursorFollower.style.width = '50px';
                cursorFollower.style.height = '50px';
                cursorFollower.style.borderColor = '#4CAF50';
            });
            
            element.addEventListener('mouseleave', function() {
                cursor.style.width = '15px';
                cursor.style.height = '15px';
                cursorFollower.style.width = '40px';
                cursorFollower.style.height = '40px';
                cursorFollower.style.borderColor = '#4CAF50';
            });
        });
    }
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-toggle') && !e.target.closest('.nav-links') && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile navigation if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Form submission
    // const contactForm = document.querySelector('.contact-form');
    
    // if (contactForm) {
    //     contactForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
            
    //         // Get form data
    //         const formData = new FormData(contactForm);
    //         const formObject = Object.fromEntries(formData);
            
    //         // Form validation
    //         let isValid = true;
    //         const inputs = contactForm.querySelectorAll('.form-control');
            
    //         inputs.forEach(input => {
    //             if (input.hasAttribute('required') && !input.value.trim()) {
    //                 isValid = false;
    //                 input.style.borderColor = 'red';
    //             } else {
    //                 input.style.borderColor = '';
    //             }
    //         });
            
    //         if (isValid) {
    //             // Here you would typically send the form data to a server
    //             alert('Message sent successfully!');
    //             contactForm.reset();
    //         } else {
    //             alert('Please fill in all required fields.');
    //         }
    //     });
    // }



// Form submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents default form submission
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Form validation
        let isValid = true;
        const inputs = contactForm.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // Show loading message
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Send data to Google Script using fetch
            fetch(contactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show success message
                alert('Message sent successfully!');
                contactForm.reset();
            })
            .catch(error => {
                // Show error message
                alert('There was an error sending your message. Please try again.');
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        } else {
            alert('Please fill in all required fields.');
        }
    });
}
    




    
    // Animate on scroll effect
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.project-card, .about-img, .about-content, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial styles for animation
    document.querySelectorAll('.project-card, .about-img, .about-content, .contact-form').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run once on load and then on scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title .highlight');
    
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let charIndex = 0;
        
        function typeEffect() {
            if (charIndex < text.length) {
                heroTitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeEffect, 150);
            }
        }
        
        // Start the typing effect after a short delay
        setTimeout(typeEffect, 500);
    }
});






// Form submission
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Form validation
        let isValid = true;
        const inputs = contactForm.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // Show loading message
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Send data to Google Script
            fetch(contactForm.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show custom success notification
                document.getElementById('notification-message').textContent = 'Message sent successfully!';
                document.getElementById('custom-notification').style.display = 'flex';
                contactForm.reset();
            })
            .catch(error => {
                // Show custom error notification
                document.getElementById('notification-message').textContent = 'There was an error sending your message. Please try again.';
                document.getElementById('custom-notification').style.display = 'flex';
                console.error('Error:', error);
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        } else {
            // Show custom validation notification
            document.getElementById('notification-message').textContent = 'Please fill in all required fields.';
            document.getElementById('custom-notification').style.display = 'flex';
        }
    });
    
    // Setup notification close button
    document.getElementById('notification-close').addEventListener('click', function() {
        document.getElementById('custom-notification').style.display = 'none';
    });
}