
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';


const ThemeContext = createContext();

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};


const SkillCard = ({ skill, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
  
          const timer = setTimeout(() => {
            setProgress(skill.level);
          }, 100);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [skill.level]);

  return (
    <div ref={cardRef} className={`skill-card ${isVisible ? 'visible' : ''}`}>
      <div className="skill-header">
        <span className="skill-icon">{skill.icon}</span>
        <h3>{skill.name}</h3>
      </div>
      <div className="skill-bar-container">
        <div 
          className="skill-bar" 
          style={{ width: `${progress}%`, backgroundColor: skill.color }}
        >
          <span className="skill-percentage">{progress}%</span>
        </div>
      </div>
      <p className="skill-experience">{skill.experience}</p>
    </div>
  );
};

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

  
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);


  const handleOutsideClick = (e) => {
    if (modalRef.current === e.target) onClose();
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={handleOutsideClick}>
      <div className="modal-content">
        <button 
          ref={closeButtonRef}
          className="modal-close" 
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        <h2>{project.title}</h2>
        <div className="modal-tech-stack">
          {project.technologies.map((tech, i) => (
            <span key={i} className="tech-badge">{tech}</span>
          ))}
        </div>
        <p className="modal-description">{project.fullDescription}</p>
        <div className="modal-links">
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
            🔗 Live Demo
          </a>
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-link">
            📂 GitHub Repo
          </a>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`project-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="project-image" style={{ backgroundColor: project.color }}>
        <span className="project-icon">{project.icon}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.shortDescription}</p>
      <div className="project-tech">
        {project.technologies.slice(0, 3).map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
      <button className="details-btn" onClick={() => onViewDetails(project)}>
        View Details →
      </button>
    </div>
  );
};

const ContactForm = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!nameRef.current.value.trim()) newErrors.name = 'Name is required';
    if (!emailRef.current.value.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(emailRef.current.value)) newErrors.email = 'Email is invalid';
    if (!messageRef.current.value.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', {
        name: nameRef.current.value,
        email: emailRef.current.value,
        message: messageRef.current.value
      });
      setSubmitted(true);
      setErrors({});
      nameRef.current.value = '';
      emailRef.current.value = '';
      messageRef.current.value = '';
      nameRef.current.focus();
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setErrors(newErrors);
      if (newErrors.name) nameRef.current.focus();
      else if (newErrors.email) emailRef.current.focus();
      else if (newErrors.message) messageRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {submitted && <div className="success-message">✓ Message sent successfully! I'll get back to you soon.</div>}
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          placeholder="John Doe"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          placeholder="john@example.com"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea
          ref={messageRef}
          id="message"
          rows="5"
          placeholder="Tell me about your opportunity..."
          className={errors.message ? 'error' : ''}
        ></textarea>
        {errors.message && <span className="error-text">{errors.message}</span>}
      </div>
      <button type="submit" className="submit-btn">Send Message 📧</button>
    </form>
  );
};

// Main App Component
const App = () => {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const isInitialMount = useRef(true);

  // Professional Skills Data
  const skills = [
    { name: 'React.js', level: 90, icon: '⚛️', experience: '3+ years', color: '#61DAFB' },
    { name: 'Node.js', level: 85, icon: '🟢', experience: '3+ years', color: '#339933' },
    { name: 'Python', level: 80, icon: '🐍', experience: '4+ years', color: '#3776AB' },
    { name: 'TypeScript', level: 75, icon: '📘', experience: '2+ years', color: '#3178C6' },
    { name: 'MongoDB', level: 85, icon: '🍃', experience: '3+ years', color: '#47A248' },
    { name: 'AWS', level: 70, icon: '☁️', experience: '2+ years', color: '#FF9900' }
  ];

  // Projects Data
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      shortDescription: 'Full-stack e-commerce solution with real-time inventory.',
      fullDescription: 'A complete e-commerce platform featuring user authentication, product management, shopping cart, payment integration with Stripe, order tracking, and admin dashboard. Built with MERN stack and Redux for state management.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux', 'Stripe'],
      icon: '🛒',
      color: '#FF6B6B',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'AI Image Generator',
      shortDescription: 'Generate unique images using Stable Diffusion API.',
      fullDescription: 'Web application that generates custom images from text descriptions using Stable Diffusion API. Features include image history, download options, and style presets.',
      technologies: ['React', 'Python', 'FastAPI', 'TensorFlow', 'TailwindCSS'],
      icon: '🎨',
      color: '#4ECDC4',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'Task Management App',
      shortDescription: 'Collaborative task management with real-time updates.',
      fullDescription: 'A Trello-like task management application with drag-and-drop functionality, team collaboration, real-time updates using WebSockets, and detailed analytics.',
      technologies: ['React', 'Socket.io', 'PostgreSQL', 'Node.js', 'Docker'],
      icon: '✅',
      color: '#45B7D1',
      liveUrl: '#',
      githubUrl: '#'
    },
    {
      id: 4,
      title: 'Weather Dashboard',
      shortDescription: 'Real-time weather tracking with interactive maps.',
      fullDescription: 'Weather application showing current conditions, 7-day forecast, interactive radar maps, and severe weather alerts using OpenWeatherMap API.',
      technologies: ['React', 'Chart.js', 'Leaflet', 'REST APIs', 'CSS3'],
      icon: '🌤️',
      color: '#96CEB4',
      liveUrl: '#',
      githubUrl: '#'
    }
  ];

  // Work Experience
  const experiences = [
    {
      company: 'Tech Solutions Inc.',
      position: 'Junior Frontend Developer',
      period: '2025 ',
      description: 'Assisted frontend development for enterprise applications, mentoring junior developers, and implementing React best practices.'
    },
    // {
    //   company: 'Digital Innovations Ltd.',
    //   position: 'Full Stack Developer',
    //   period: '2020 - 2022',
    //   description: 'Developed and maintained multiple web applications, improved performance by 40%, and integrated third-party APIs.'
    // },
    // {
    //   company: 'StartUp Hub',
    //   position: 'Junior Developer',
    //   period: '2019 - 2020',
    //   description: 'Built responsive websites, fixed bugs, and collaborated with design team to implement UI/UX improvements.'
    // }
  ];

  // useEffect for theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem('portfolio-theme', theme);
      document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }
  }, [theme]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        {/* Racing-inspired header decoration */}
        <div className="racing-stripes"></div>
        
        <nav className="navbar">
          <div className="nav-brand">
            <span className="logo">🏍️</span>
            <span className="brand-text">Darsh's MotoGP Inspired Portfolio</span>
            <span className="logo">🏁</span>
          </div>
          <ul className="nav-links">
            <li><button onClick={() => scrollToSection('home')} className={activeSection === 'home' ? 'active' : ''}>Home</button></li>
            <li><button onClick={() => scrollToSection('skills')} className={activeSection === 'skills' ? 'active' : ''}>Skills</button></li>
            <li><button onClick={() => scrollToSection('projects')} className={activeSection === 'projects' ? 'active' : ''}>Projects</button></li>
            <li><button onClick={() => scrollToSection('experience')} className={activeSection === 'experience' ? 'active' : ''}>Experience</button></li>
            <li><button onClick={() => scrollToSection('contact')} className={activeSection === 'contact' ? 'active' : ''}>Contact</button></li>
          </ul>
          <ThemeToggle />
        </nav>

        <main>
          {/* Hero Section */}
          <section id="home" className="hero-section">
            <div className="hero-content">
              <div className="badge">Available for Work 🏁</div>
              <h1>
                <span className="greeting">Hi, I'm</span>
                <span className="name">Darsh Maru</span>
              </h1>
              <p className="hero-subtitle">Full-Stack Developer & Data Science Enthusiast</p>
              <p className="hero-description">
                I build exceptional digital experiences that combine performance with beautiful design.
                Specialized in React, Node.js, and cloud technologies. Let's create something amazing together.
              </p>
              <div className="hero-buttons">
                <button onClick={() => scrollToSection('projects')} className="btn-primary">
                  View My Work 🚀
                </button>
                <button onClick={() => scrollToSection('contact')} className="btn-secondary">
                  Hire Me 💼
                </button>
              </div>
              <div className="tech-stack">
                <span>Tech Stack:</span>
                <span>React</span>
                <span>Node.js</span>
                <span>Python</span>
                <span>MongoDB</span>
                <span>AWS</span>
                <span>Git & GitHub</span>
                
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="skills-section">
            <h2>Technical Skills</h2>
            <p className="section-subtitle">Technologies I work with</p>
            <div className="skills-grid">
              {skills.map((skill, index) => (
                <SkillCard key={index} skill={skill} index={index} />
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="projects-section">
            <h2>Featured Projects</h2>
            <p className="section-subtitle">Some of my best work</p>
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onViewDetails={setSelectedProject}
                />
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="experience-section">
            <h2>Work Experience</h2>
            <p className="section-subtitle">Professional journey</p>
            <div className="timeline">
              {experiences.map((exp, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h3>{exp.position}</h3>
                    <h4>{exp.company}</h4>
                    <p className="timeline-date">{exp.period}</p>
                    <p>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="contact-section">
            <h2>Get In Touch</h2>
            <p className="section-subtitle">Let's discuss your next project</p>
            <div className="contact-container">
              <div className="contact-info">
                <div className="info-card">
                  <span className="info-icon">📧</span>
                  <h3>Email</h3>
                  <p>darshmaru@gmail.com</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">📱</span>
                  <h3>Phone</h3>
                  <p>8452893033</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">📍</span>
                  <h3>Location</h3>
                  <p>Sion, Mumbai</p>
                </div>
                <div className="info-card">
                  <span className="info-icon">💻</span>
                  <h3>Available for</h3>
                  <p>Full-time, Freelance</p>
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Darsh Maru</h4>
              <p>Full-Stack Developer creating amazing web experiences.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <button onClick={() => scrollToSection('home')}>Home</button>
              <button onClick={() => scrollToSection('projects')}>Projects</button>
              <button onClick={() => scrollToSection('contact')}>Contact</button>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <button onClick={() => window.open('#', '_blank')}>GitHub</button>
                <button onClick={() => window.open('#', '_blank')}>LinkedIn</button>
                <button onClick={() => window.open('#', '_blank')}>Twitter</button>
              </div>
            </div>
          </div>
          <p className="copyright">© 2025 Darsh Maru. Built with React & MotoGP Spirit 🏁</p>
        </footer>

        {/* Project Modal */}
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
};

export default App;