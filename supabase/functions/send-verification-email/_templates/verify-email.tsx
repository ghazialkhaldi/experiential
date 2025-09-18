import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface VerifyEmailProps {
  verificationUrl: string
  userName: string
}

export const VerifyEmail = ({
  verificationUrl,
  userName,
}: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Please verify your email address to complete your Experiential account setup</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logo}>Experiential</Text>
        </Section>
        
        <Heading style={h1}>Welcome to Experiential! 🎉</Heading>
        
        <Text style={text}>
          Hi {userName},
        </Text>
        
        <Text style={text}>
          Thank you for signing up for Experiential! We're excited to help you discover amazing volunteer opportunities and internships.
        </Text>
        
        <Text style={text}>
          To complete your account setup, please verify your email address by clicking the button below:
        </Text>
        
        <Section style={buttonSection}>
          <Button href={verificationUrl} style={button}>
            Verify Email Address
          </Button>
        </Section>
        
        <Text style={text}>
          Or copy and paste this link into your browser:
        </Text>
        
        <Text style={linkText}>
          {verificationUrl}
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footerText}>
          If you didn't create an account with Experiential, you can safely ignore this email.
        </Text>
        
        <Text style={footerText}>
          Need help? Contact us at support@experiential.care
        </Text>
      </Container>
    </Body>
  </Html>
)

export default VerifyEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoSection = {
  padding: '32px 20px',
  textAlign: 'center' as const,
}

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#2563eb',
  margin: '0',
}

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 20px 20px',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 20px',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const linkText = {
  color: '#6366f1',
  fontSize: '14px',
  margin: '16px 20px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '42px 20px 26px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 20px',
}