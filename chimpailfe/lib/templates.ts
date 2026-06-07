export type EmailTemplate = {
  id: string;
  name: string;
  description: string;
  subject: string;
  html: string;
};

export type Recipient = {
  name: string;
  email: string;
};

const welcomeHtml = `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body style="font-family: Arial, sans-serif; color: #111;">
    <h2>Hello {{Name}},</h2>
    <p>Thank you for joining our platform.</p>
    <p>We are excited to have you with us.</p>
    <p>If you have any questions, feel free to contact us.</p>
    <br />
    <p>Best Regards,</p>
    <p><strong>ChimpMail Team</strong></p>
    <p style="color:#888;font-size:12px">Sent to {{Email}}</p>
  </body>
</html>`;

const newsletterHtml = `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body style="font-family: Arial, sans-serif; color: #111; max-width:600px; margin:0 auto;">
    <h1 style="border-bottom:2px solid #111; padding-bottom:8px;">Monthly Newsletter</h1>
    <p>Hi {{Name}},</p>
    <p>Here's what's new this month:</p>
    <ul>
      <li>Faster bulk send pipeline</li>
      <li>Improved template editor</li>
      <li>New analytics dashboard</li>
    </ul>
    <p style="text-align:center; margin:24px 0;">
      <a href="https://example.com" style="background:#111;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Read more</a>
    </p>
    <p style="color:#888;font-size:12px">You're receiving this at {{Email}}.</p>
  </body>
</html>`;

const announcementHtml = `<!DOCTYPE html>
<html>
  <head><meta charset="UTF-8" /></head>
  <body style="font-family: Arial, sans-serif; color: #111;">
    <h1 style="font-size:24px;"><strong>Important Announcement</strong></h1>
    <p>Dear {{Name}},</p>
    <p>We have an important update to share with you. Please review the details below and reach out if you have questions.</p>
    <blockquote style="border-left:4px solid #111;padding-left:12px;color:#444;">
      Service will undergo scheduled maintenance this weekend.
    </blockquote>
    <p>Thank you for being part of our community.</p>
    <p>— The ChimpMail Team</p>
    <p style="color:#888;font-size:12px">Notice sent to {{Email}}.</p>
  </body>
</html>`;

export const TEMPLATES: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Warm intro for new signups.",
    subject: "Welcome to ChimpMail",
    html: welcomeHtml,
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Monthly recap with a CTA.",
    subject: "Your monthly ChimpMail update",
    html: newsletterHtml,
  },
  {
    id: "announcement",
    name: "Announcement",
    description: "Short, formal notice.",
    subject: "An important announcement",
    html: announcementHtml,
  },
];

export function getTemplate(id: string): EmailTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function renderTemplate(html: string, recipient: Recipient): string {
  return html
    .replaceAll("{{Name}}", escapeHtml(recipient.name))
    .replaceAll("{{Email}}", escapeHtml(recipient.email));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
