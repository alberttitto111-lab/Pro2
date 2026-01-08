import React, { useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  InputAdornment,
  Paper
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Send,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import API from '../services/api'; // Make sure this import exists

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(''); // Changed from 'error' to 'formError'

  const contactInfo = [
    {
      icon: <Phone sx={{ fontSize: 30 }} />,
      title: 'Phone',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: '#2196F3'
    },
    {
      icon: <Email sx={{ fontSize: 30 }} />,
      title: 'Email',
      details: ['support@frozo.com', 'sales@frozo.com'],
      color: '#4CAF50'
    },
    {
      icon: <LocationOn sx={{ fontSize: 30 }} />,
      title: 'Address',
      details: ['733 Suffolk Ave', 'Brentwood, NY 11717', 'United States'],
      color: '#FF9800'
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 30 }} />,
      title: 'Business Hours',
      details: ['Mon-Fri: 8am-8pm EST', 'Sat: 9am-6pm EST', 'Sun: 10am-4pm EST'],
      color: '#9C27B0'
    }
  ];

  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', color: '#1877F2' },
    { icon: <Twitter />, label: 'Twitter', color: '#1DA1F2' },
    { icon: <Instagram />, label: 'Instagram', color: '#E4405F' },
    { icon: <LinkedIn />, label: 'LinkedIn', color: '#0A66C2' }
  ];

  const faqs = [
    {
      question: 'What is your delivery policy?',
      answer: 'We offer same-day delivery in selected areas and next-day delivery nationwide. All products are delivered frozen at the perfect temperature.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking number via email. You can also track your order from your account dashboard.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day satisfaction guarantee. If you are not satisfied with any product, you can return it for a full refund or exchange.'
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer special pricing for bulk orders and wholesale customers. Contact our sales team for custom quotes.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    return newErrors;
  };

// Updated the handleSubmit function:
  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setSubmitting(true);
  setFormError('');

  try {
    console.log('📤 Sending message:', formData);
    
    const response = await API.post('/notifications', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim()
    });

    console.log('📥 Response received:', response.data);
    
    // Check if response is successful
    if (response.data && response.data.success === true) {
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});
      console.log('✅ Message sent successfully!');
    } else {
      // Handle case where success is false or not present
      const errorMsg = response.data?.error || response.data?.message || 'Failed to send message';
      setFormError(errorMsg);
      console.error('❌ Server returned error:', errorMsg);
    }
  } catch (err) {
    console.error('❌ Network/API error:', err);
    
    // More detailed error handling
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', err.response.data);
      console.error('Error response status:', err.response.status);
      console.error('Error response headers:', err.response.headers);
      
      setFormError(err.response.data?.error || err.response.data?.message || 'Server error occurred');
    } else if (err.request) {
      // The request was made but no response was received
      console.error('No response received:', err.request);
      setFormError('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', err.message);
      setFormError('Error: ' + err.message);
    }
  } finally {
    setSubmitting(false);
  }
};

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box sx={{
        width: '100%',
        textAlign: 'center',
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h1" sx={{
            fontWeight: 900,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Contact Us
          </Typography>
          <Typography variant="h4" sx={{
            fontWeight: 500,
            mb: 3,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}>
            We're Here to Help
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            maxWidth: 800,
            mx: 'auto',
            opacity: 0.9,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }
          }}>
            Have questions about our products or services? Get in touch with our friendly team.
          </Typography>
        </Container>
      </Box>

      {/* Contact Info & Form Section */}
      <Box sx={{
        width: '100%',
        py: { xs: 6, md: 8 },
        bgcolor: '#f8fafc'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Contact Info Cards */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography variant="h2" sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: '#1a237e',
              mb: 4,
              textAlign: 'left'
            }}>
              Get in Touch
            </Typography>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: `1px solid ${info.color}20`,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: `${info.color}15`,
                        color: info.color
                      }}>
                        {info.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: info.color }}>
                        {info.title}
                      </Typography>
                      {info.details.map((detail, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {detail}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Contact Form & Map */}
          <Grid container spacing={4}>
            {/* Contact Form */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#1a237e',
                    mb: 3
                  }}>
                    Send us a Message
                  </Typography>
                  
                  {/* Form Error Alert */}
                  {formError && (
                    <Alert
                      severity="error"
                      sx={{ mb: 3, borderRadius: 2 }}
                      onClose={() => setFormError('')}
                    >
                      {formError}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          disabled={submitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          disabled={submitting}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          disabled={submitting}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          multiline
                          rows={4}
                          disabled={submitting}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          disabled={submitting}
                          startIcon={submitting ? null : <Send />}
                          sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            borderRadius: 2
                          }}
                        >
                          {submitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Map & Social */}
            <Grid item xs={12} md={6}>
              {/* Map Placeholder */}
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mb: 3,
                overflow: 'hidden'
              }}>
                <Box sx={{
                  height: 300,
                  bgcolor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666'
                }}>
                  <Typography variant="h6">
                    Interactive Map Location
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Visit Our Headquarters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    733 Suffolk Ave, Brentwood, NY 11717, United States
                  </Typography>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card sx={{
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Connect With Us
                  </Typography>
                  <Grid container spacing={2}>
                    {socialLinks.map((social, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={social.icon}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: social.color,
                            color: social.color,
                            '&:hover': {
                              borderColor: social.color,
                              bgcolor: `${social.color}10`
                            }
                          }}
                        >
                          {social.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* FAQ Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: '#1a237e',
              mb: 4,
              textAlign: 'left'
            }}>
              Frequently Asked Questions
            </Typography>
            <Grid container spacing={3}>
              {faqs.map((faq, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{
                    p: 3,
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      color: '#2196F3'
                    }}>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{
        width: '100%',
        textAlign: 'center',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            Stay Updated
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            opacity: 0.9,
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}>
            Subscribe to our newsletter for exclusive offers, new products, and healthy recipes.
          </Typography>
          <Box component="form" sx={{
            maxWidth: 500,
            mx: 'auto',
            display: 'flex',
            gap: 2
          }}>
            <TextField
              fullWidth
              placeholder="Your email address"
              variant="outlined"
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                minWidth: 140
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          icon={<CheckCircle fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
          Your message has been sent successfully! We'll get back to you within 24 hours.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;