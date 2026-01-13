import React from 'react';
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material';
import {
  LocalShipping,
  Security,
  Restaurant,
  Diversity3,
  ThumbUp
} from '@mui/icons-material';
import NatureIcon from '@mui/icons-material/Nature';

const About = () => {
  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: 'Fast Delivery',
      description: 'Same-day delivery in selected areas. Frozen at the perfect temperature.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Quality Guaranteed',
      description: 'All products are USDA approved and come with quality assurance.'
    },
    {
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      title: 'Chef-Approved',
      description: 'Our recipes are developed by professional chefs for maximum flavor.'
    },
    {
      icon: <NatureIcon sx={{ fontSize: 40 }} />,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging and responsible sourcing practices.'
    },
    {
      icon: <Diversity3 sx={{ fontSize: 40 }} />,
      title: 'Community Focused',
      description: 'Supporting local farmers and communities since 2015.'
    },
    {
      icon: <ThumbUp sx={{ fontSize: 40 }} />,
      title: 'Customer First',
      description: '24/7 customer support and 100% satisfaction guarantee.'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former executive chef with 15+ years in the food industry.',
      color: '#2196F3',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      bio: 'Supply chain expert specializing in cold chain logistics.',
      color: '#4CAF50',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Development',
      bio: 'Nutritionist and food scientist passionate about healthy eating.',
      color: '#FF9800',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'David Wilson',
      role: 'Customer Experience',
      bio: 'Dedicated to ensuring every customer has the best experience.',
      color: '#9C27B0',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Jessica Brown',
      role: 'Head of Marketing',
      bio: 'Digital marketing expert with focus on food industry trends.',
      color: '#E91E63',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      name: 'Robert Garcia',
      role: 'Quality Control Director',
      bio: 'Ensures all products meet highest quality and safety standards.',
      color: '#3F51B5',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

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
            About Frozo
          </Typography>
          <Typography variant="h4" sx={{
            fontWeight: 500,
            mb: 3,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}>
            Revolutionizing Frozen Food Since 2015
          </Typography>
          <Typography variant="h6" sx={{
            mb: 4,
            maxWidth: 800,
            mx: 'auto',
            opacity: 0.9,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }
          }}>
            We believe frozen food should be fresh, delicious, and convenient without compromising on quality or nutrition.
          </Typography>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Box sx={{
        width: '100%',
        py: { xs: 6, md: 8 },
        bgcolor: '#f8fafc'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{
            mb: { xs: 4, md: 6 },
            textAlign: 'left'
          }}>
            <Typography variant="h2" sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: '#1a237e',
              mb: 2
            }}>
              Our Story
            </Typography>
            <Typography variant="body1" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              mb: 3,
              color: 'text.secondary'
            }}>
              Founded in 2015 by former executive chef Sarah Johnson, Frozo began with a simple mission:
              to make high-quality frozen food accessible to everyone. Frustrated by the lack of nutritious
              and delicious options in the frozen aisle, Sarah partnered with local farmers and food
              scientists to create a line of premium frozen products that don't compromise on taste or quality.
            </Typography>
            <Typography variant="body1" sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'text.secondary'
            }}>
              Today, we serve over 100,000 customers nationwide with our range of vegetables, fruits,
              ready meals, and snacks. Our commitment to sustainability, quality, and customer satisfaction
              has made us a trusted name in frozen foods.
            </Typography>
          </Box>

          {/* Mission & Vision */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
                border: '1px solid rgba(33, 150, 243, 0.1)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#2196F3',
                    mb: 2
                  }}>
                    Our Mission
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    To provide convenient, nutritious, and delicious frozen food options that make healthy
                    eating accessible to busy families and individuals without compromising on quality or taste.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.1)'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h4" sx={{
                    fontWeight: 700,
                    color: '#4CAF50',
                    mb: 2
                  }}>
                    Our Vision
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    To revolutionize the frozen food industry by setting new standards for quality,
                    sustainability, and customer experience while making nutritious eating effortless for everyone.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Features */}
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: '#1a237e',
              mb: 4,
              textAlign: 'left'
            }}>
              Why Choose Frozo?
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}>
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box sx={{
                        display: 'inline-flex',
                        p: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        color: 'primary.main'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box>
            <Typography variant="h3" sx={{
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: '#1a237e',
              mb: 4,
              textAlign: 'left'
            }}>
              Meet Our Team
            </Typography>
            <Grid container spacing={3}>
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Team Member Image */}
                    <Box sx={{
                      height: 200,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.color.replace('#', '')}&color=fff&size=200&bold=true`;
                        }}
                      />
                      {/* Gradient Overlay */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: `linear-gradient(to top, ${member.color}DD, transparent)`,
                        opacity: 0.7
                      }} />
                    </Box>
                    
                    <CardContent sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      position: 'relative',
                      mt: -4
                    }}>
                      {/* Avatar/Initial Circle */}
                      <Box sx={{
                        position: 'absolute',
                        top: -32,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        border: '4px solid white',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        <img
                          src={member.imageUrl}
                          alt={member.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name.charAt(0))}&background=${member.color.replace('#', '')}&color=fff&size=64&bold=true`;
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          mb: 1,
                          color: '#1a237e'
                        }}>
                          {member.name}
                        </Typography>
                        
                        <Chip
                          label={member.role}
                          size="small"
                          sx={{
                            mb: 2,
                            bgcolor: `${member.color}20`,
                            color: member.color,
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            px: 1,
                            height: 26
                          }}
                        />
                        
                        <Typography variant="body2" color="text.secondary" sx={{
                          lineHeight: 1.6,
                          fontSize: '0.9rem'
                        }}>
                          {member.bio}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{
        width: '100%',
        textAlign: 'center',
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{
            fontWeight: 700,
            mb: 4,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            Our Impact in Numbers
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                100K+
              </Typography>
              <Typography variant="h6">
                Happy Customers
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                500+
              </Typography>
              <Typography variant="h6">
                Products
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                50+
              </Typography>
              <Typography variant="h6">
                Local Farms
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
                8 Years
              </Typography>
              <Typography variant="h6">
                of Excellence
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;