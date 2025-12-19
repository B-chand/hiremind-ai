const nodemailer = require('nodemailer');

/**
 * Email Service for HireMind AI
 * 
 * Handles all email communications including:
 * - Application acknowledgments
 * - Interview invitations
 * - Status updates
 * - Offer letters
 * - Rejection notifications
 * 
 * HACKATHON NOTE: Currently using mock email sending for demo purposes.
 * In production, configure with actual SMTP provider (Gmail, SendGrid, etc.)
 */

// Email transporter configuration
let transporter = null;

/**
 * Initialize email transporter
 * TODO: Configure with actual email provider in production
 */
function initializeTransporter() {
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    console.log('📧 Email service running in DEMO mode - no actual emails will be sent');
  }
}

/**
 * Send email using configured transporter or mock for demo
 * @param {Object} emailOptions - Email configuration
 * @param {string} emailOptions.to - Recipient email
 * @param {string} emailOptions.subject - Email subject
 * @param {string} emailOptions.html - HTML email content
 * @param {string} emailOptions.from - Sender email (optional)
 * @returns {Object} Email sending result
 */
async function sendEmail({ to, subject, html, from }) {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (transporter) {
      // Real email sending (production)
      const mailOptions = {
        from: from || process.env.EMAIL_USER || 'noreply@hiremind.ai',
        to,
        subject,
        html,
      };
      
      const result = await transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        to,
        subject,
        timestamp: new Date().toISOString(),
        provider: 'smtp'
      };
    } else {
      // Mock email sending (demo/development)
      console.log('📧 DEMO EMAIL SENT:');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   From: ${from || 'noreply@hiremind.ai'}`);
      console.log(`   Content Length: ${html.length} characters`);
      console.log('   Status: ✅ Successfully sent (DEMO MODE)');
      
      return {
        success: true,
        messageId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        to,
        subject,
        timestamp: new Date().toISOString(),
        provider: 'demo',
        note: 'Email sent in demo mode - no actual email delivered'
      };
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    return {
      success: false,
      error: error.message,
      to,
      subject,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Send application acknowledgment email
 * @param {Object} candidate - Candidate information
 * @param {Object} jobDetails - Job posting details
 * @returns {Object} Email sending result
 */
async function sendApplicationAcknowledgment(candidate, jobDetails = {}) {
  const subject = `Application Received - ${jobDetails.title || 'Software Developer Position'}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Thank you for your application!</h2>
      
      <p>Dear ${candidate.name},</p>
      
      <p>We have successfully received your application for the <strong>${jobDetails.title || 'Software Developer'}</strong> position. Thank you for your interest in joining our team!</p>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">Application Summary:</h3>
        <ul style="margin: 0;">
          <li><strong>Position:</strong> ${jobDetails.title || 'Software Developer'}</li>
          <li><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</li>
          <li><strong>Skills:</strong> ${candidate.skills?.join(', ') || 'Various technologies'}</li>
          <li><strong>Experience:</strong> ${candidate.experience || 'N/A'} years</li>
        </ul>
      </div>
      
      <p>Our hiring team will review your application and get back to you within <strong>3-5 business days</strong> with next steps.</p>
      
      <p>In the meantime, feel free to:</p>
      <ul>
        <li>Explore our company culture on our website</li>
        <li>Connect with us on LinkedIn</li>
        <li>Check out our latest projects and blog posts</li>
      </ul>
      
      <p>If you have any questions, please don't hesitate to reach out.</p>
      
      <p>Best regards,<br>
      <strong>The HireMind AI Hiring Team</strong></p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: candidate.email,
    subject,
    html
  });
}

/**
 * Send interview invitation email
 * @param {Object} candidate - Candidate information
 * @param {Object} interviewDetails - Interview scheduling details
 * @returns {Object} Email sending result
 */
async function sendInterviewInvitation(candidate, interviewDetails = {}) {
  const subject = `Interview Invitation - ${candidate.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">Congratulations! You've been selected for an interview</h2>
      
      <p>Dear ${candidate.name},</p>
      
      <p>We were impressed by your application and would like to invite you for an interview. Your background and experience align well with what we're looking for!</p>
      
      <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
        <h3 style="margin-top: 0; color: #065f46;">Interview Details:</h3>
        <ul style="margin: 0;">
          <li><strong>Type:</strong> ${interviewDetails.type || 'AI Screening Interview'}</li>
          <li><strong>Duration:</strong> ${interviewDetails.duration || '45 minutes'}</li>
          <li><strong>Format:</strong> ${interviewDetails.format || 'Video call via Zoom'}</li>
          <li><strong>Interviewer:</strong> ${interviewDetails.interviewer || 'Hiring Manager'}</li>
        </ul>
      </div>
      
      <p><strong>What to expect:</strong></p>
      <ul>
        <li>Discussion about your background and experience</li>
        <li>Technical questions related to your skills</li>
        <li>Opportunity to ask questions about the role and company</li>
        <li>Overview of our team and culture</li>
      </ul>
      
      <p><strong>Next Steps:</strong></p>
      <p>Please reply to this email with your availability for the next week, and we'll send you a calendar invitation with the meeting link.</p>
      
      <p>We're looking forward to speaking with you and learning more about your experience!</p>
      
      <p>Best regards,<br>
      <strong>The HireMind AI Hiring Team</strong></p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        If you have any questions or need to reschedule, please contact us immediately.
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: candidate.email,
    subject,
    html
  });
}

/**
 * Send job offer email
 * @param {Object} candidate - Candidate information
 * @param {Object} offerDetails - Job offer details
 * @returns {Object} Email sending result
 */
async function sendJobOffer(candidate, offerDetails = {}) {
  const subject = `Job Offer - Welcome to the team, ${candidate.name}!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">🎉 Congratulations! We'd like to extend you an offer</h2>
      
      <p>Dear ${candidate.name},</p>
      
      <p>We are thrilled to offer you the position at HireMind AI! After our interview process, we believe you would be an excellent addition to our team.</p>
      
      <div style="background-color: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7c3aed;">
        <h3 style="margin-top: 0; color: #581c87;">Offer Details:</h3>
        <ul style="margin: 0;">
          <li><strong>Position:</strong> ${offerDetails.jobTitle || 'Software Developer'}</li>
          <li><strong>Salary:</strong> $${offerDetails.salary?.toLocaleString() || candidate.recommendedSalary?.toLocaleString() || '95,000'} annually</li>
          <li><strong>Start Date:</strong> ${offerDetails.startDate || 'To be discussed'}</li>
          <li><strong>Employment Type:</strong> ${offerDetails.employmentType || 'Full-time'}</li>
          <li><strong>Location:</strong> ${offerDetails.location || 'San Francisco, CA (Hybrid)'}</li>
        </ul>
      </div>
      
      <p><strong>Benefits Package:</strong></p>
      <ul>
        <li>Comprehensive health, dental, and vision insurance</li>
        <li>401(k) retirement plan with company matching</li>
        <li>Flexible PTO and paid holidays</li>
        <li>Professional development budget</li>
        <li>Remote work flexibility</li>
        <li>Stock options</li>
      </ul>
      
      <p><strong>Next Steps:</strong></p>
      <p>Please review this offer carefully. We've attached the formal offer letter with complete terms and conditions. If you have any questions or would like to discuss any aspects of the offer, please don't hesitate to reach out.</p>
      
      <p>We're excited about the possibility of you joining our team and contributing to our mission of revolutionizing AI-powered hiring!</p>
      
      <p>Please let us know your decision by <strong>${offerDetails.deadline || 'one week from today'}</strong>.</p>
      
      <p>Welcome to the team (pending your acceptance)!</p>
      
      <p>Best regards,<br>
      <strong>The HireMind AI Team</strong></p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This offer is contingent upon successful completion of background checks and reference verification.
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: candidate.email,
    subject,
    html
  });
}

/**
 * Send rejection email
 * @param {Object} candidate - Candidate information
 * @param {Object} rejectionDetails - Rejection details and feedback
 * @returns {Object} Email sending result
 */
async function sendRejection(candidate, rejectionDetails = {}) {
  const subject = `Update on your application - ${candidate.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #374151;">Thank you for your interest in HireMind AI</h2>
      
      <p>Dear ${candidate.name},</p>
      
      <p>Thank you for taking the time to apply and interview with us. We genuinely appreciate the effort you put into the process and your interest in joining our team.</p>
      
      <p>After careful consideration of all candidates, we have decided to move forward with another candidate whose experience more closely matches our current specific needs.</p>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #374151;">We were impressed by:</h3>
        <ul style="margin: 0;">
          <li>Your technical skills in ${candidate.skills?.slice(0, 3).join(', ') || 'software development'}</li>
          <li>Your ${candidate.experience} years of professional experience</li>
          <li>Your enthusiasm and passion for technology</li>
          ${rejectionDetails.positives ? rejectionDetails.positives.map(item => `<li>${item}</li>`).join('') : ''}
        </ul>
      </div>
      
      <p>We encourage you to apply for future opportunities with us that may be a better match for your skills and career goals. We'll keep your information on file and reach out if a suitable position becomes available.</p>
      
      <p>We wish you the best of luck in your job search and future career endeavors.</p>
      
      <p>Thank you again for your interest in HireMind AI.</p>
      
      <p>Best regards,<br>
      <strong>The HireMind AI Hiring Team</strong></p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        We appreciate your understanding and wish you success in your career journey.
      </p>
    </div>
  `;
  
  return await sendEmail({
    to: candidate.email,
    subject,
    html
  });
}

/**
 * Send interview reminder email
 * @param {Object} candidate - Candidate information
 * @param {Object} interviewDetails - Interview details
 * @returns {Object} Email sending result
 */
async function sendInterviewReminder(candidate, interviewDetails = {}) {
  const subject = `Interview Reminder - Tomorrow at ${interviewDetails.time || '2:00 PM'}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Interview Reminder</h2>
      
      <p>Dear ${candidate.name},</p>
      
      <p>This is a friendly reminder about your upcoming interview with HireMind AI.</p>
      
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <h3 style="margin-top: 0; color: #1e40af;">Interview Details:</h3>
        <ul style="margin: 0;">
          <li><strong>Date:</strong> ${interviewDetails.date || 'Tomorrow'}</li>
          <li><strong>Time:</strong> ${interviewDetails.time || '2:00 PM PST'}</li>
          <li><strong>Duration:</strong> ${interviewDetails.duration || '45 minutes'}</li>
          <li><strong>Meeting Link:</strong> ${interviewDetails.meetingLink || 'Will be provided separately'}</li>
        </ul>
      </div>
      
      <p><strong>Preparation Tips:</strong></p>
      <ul>
        <li>Test your camera and microphone beforehand</li>
        <li>Prepare examples of your recent projects</li>
        <li>Review the job description and company information</li>
        <li>Prepare questions about the role and team</li>
      </ul>
      
      <p>We're looking forward to speaking with you!</p>
      
      <p>Best regards,<br>
      <strong>The HireMind AI Hiring Team</strong></p>
    </div>
  `;
  
  return await sendEmail({
    to: candidate.email,
    subject,
    html
  });
}

// Initialize transporter on module load
initializeTransporter();

module.exports = {
  sendEmail,
  sendApplicationAcknowledgment,
  sendInterviewInvitation,
  sendJobOffer,
  sendRejection,
  sendInterviewReminder,
  initializeTransporter
};
