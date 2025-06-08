const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// We will rely on server/index.js for initial console.log of env vars

/**
 * Sends a contact email using SendGrid.
 * @param {Object} formData - The submitted contact form values.
 */
async function sendContactEmail(formData) {
  try {
    const { fullName, email, message, athleteSlug } = formData;
    const recipientEmail = process.env.CONTACT_EMAIL_RECIPIENT;

    if (!recipientEmail) {
      throw new Error(
        'CONTACT_EMAIL_RECIPIENT environment variable is not set'
      );
    }

    console.log('📬 Sending contact email to:', recipientEmail);

    const emailContent = {
      to: recipientEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@oneshot.com',
      replyTo: email, // Reply goes to sender
      subject: `New Contact from OneShot Profile${athleteSlug ? `: ${athleteSlug}` : ''}`,
      html: `
        <h2>📨 New Profile Contact Submission</h2>
        <p><strong>From:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${athleteSlug ? `<p><strong>Profile:</strong> ${athleteSlug}</p>` : ''}
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br/>')}
        </div>
        <hr/>
        <p><small>Sent via OneShot contact form</small></p>
      `,
    };

    await sgMail.send(emailContent);
    console.log(`✅ Contact email sent from ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', error);

    if (error.response) {
      console.error('📩 SendGrid response status:', error.response.statusCode);
      console.error('📩 SendGrid response body:', error.response.body);
    }

    throw new Error('Failed to send email. Please try again later.');
  }
}

module.exports = { sendContactEmail };
