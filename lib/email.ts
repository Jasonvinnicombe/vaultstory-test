import { env } from "@/lib/env";

type InviteEmailInput = {
  to: string;
  recipientName?: string | null;
  vaultId: string;
  vaultName: string;
  inviterName: string;
  role: string;
};

type AdminInviteEmailInput = {
  to: string;
  recipientName?: string | null;
  inviterName: string;
};

type UnlockReadyEmailInput = {
  to: string;
  recipientName?: string | null;
  vaultId: string;
  vaultName: string;
  entryId: string;
  entryTitle: string;
  unlockedAt: string;
  subjectName?: string | null;
  coverImageUrl?: string | null;
};

type SupportEmailInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type EmailResult =
  | { status: "sent" }
  | { status: "skipped"; reason: "not-configured" };

const SUPPORT_EMAIL = "support@vaultstory.app";

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function buildInviteLink(mode: "login" | "signup", email: string) {
  const url = new URL(mode === "login" ? "/login" : "/signup", env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("email", email);
  url.searchParams.set("invite", "vault");
  url.searchParams.set("next", "/dashboard");
  return url.toString();
}

function buildAdminInviteLink(mode: "login" | "signup", email: string) {
  const url = new URL(mode === "login" ? "/login" : "/signup", env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("email", email);
  url.searchParams.set("invite", "admin");
  url.searchParams.set("next", "/admin/users");
  return url.toString();
}

function buildEntryLink(entryId: string, email: string) {
  const url = new URL(`/entries/${entryId}`, env.NEXT_PUBLIC_APP_URL);
  url.searchParams.set("email", email);
  return url.toString();
}

async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<EmailResult> {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { status: "skipped", reason: "not-configured" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Email delivery failed.");
  }

  return { status: "sent" };
}

export async function sendVaultInviteEmail(input: InviteEmailInput): Promise<EmailResult> {
  const loginUrl = buildInviteLink("login", input.to);
  const signupUrl = buildInviteLink("signup", input.to);
  const roleLabel = formatRole(input.role);
  const recipientLabel = input.recipientName?.trim() || input.to;

  const subject = `${input.inviterName} invited you to Vault Story`;
  const text = [
    `Hi ${recipientLabel},`,
    "",
    `${input.inviterName} invited you to join the vault \"${input.vaultName}\" as a ${roleLabel}.`,
    "",
    "Log in to accept the invite:",
    loginUrl,
    "",
    "Need an account first? Sign up here:",
    signupUrl,
  ].join("\n");

  const html = `
    <div style="background:#f7f5f2;padding:32px 20px;font-family:Inter,Arial,sans-serif;color:#2a2a2a;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(30,42,68,0.08);border-radius:28px;padding:36px;box-shadow:0 24px 60px rgba(30,42,68,0.08);">
        <p style="margin:0 0 12px;color:#e6b86a;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Vault Story</p>
        <h1 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:36px;line-height:1.15;color:#1e2a44;">You've been invited into a family vault</h1>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.8;">Hi <strong>${recipientLabel}</strong>,</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">
          <strong>${input.inviterName}</strong> invited you to join <strong>${input.vaultName}</strong> as a <strong>${roleLabel}</strong>.
        </p>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.8;">Step inside to help preserve memories, stories, photos, and future messages meant for the people you love.</p>
        <div style="margin:0 0 28px;">
          <a href="${loginUrl}" style="display:inline-block;background:#1e2a44;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:600;margin-right:12px;">Log in to view the vault</a>
          <a href="${signupUrl}" style="display:inline-block;background:#f7f5f2;color:#1e2a44;text-decoration:none;padding:14px 22px;border-radius:999px;border:1px solid rgba(30,42,68,0.14);font-weight:600;">Create your account</a>
        </div>
        <div style="padding:18px 20px;border-radius:22px;background:linear-gradient(180deg, rgba(230,184,106,0.14), rgba(230,184,106,0.05));font-size:14px;line-height:1.8;color:#5e5b57;">
          If the buttons above do not work, copy and paste this link into your browser:<br />
          <a href="${signupUrl}" style="color:#1e2a44;word-break:break-all;">${signupUrl}</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: input.to,
    subject,
    html,
    text,
  });
}

export async function sendAdminInviteEmail(input: AdminInviteEmailInput): Promise<EmailResult> {
  const loginUrl = buildAdminInviteLink("login", input.to);
  const signupUrl = buildAdminInviteLink("signup", input.to);
  const recipientLabel = input.recipientName?.trim() || input.to;
  const subject = `${input.inviterName} invited you to administer Vault Story`;
  const text = [
    `Hi ${recipientLabel},`,
    "",
    `${input.inviterName} invited you to help manage Vault Story accounts and memberships.`,
    "",
    "Log in to accept admin access:",
    loginUrl,
    "",
    "Need an account first? Sign up here:",
    signupUrl,
  ].join("\n");

  const html = `
    <div style="background:#f7f5f2;padding:32px 20px;font-family:Inter,Arial,sans-serif;color:#2a2a2a;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(30,42,68,0.08);border-radius:28px;padding:36px;box-shadow:0 24px 60px rgba(30,42,68,0.08);">
        <p style="margin:0 0 12px;color:#e6b86a;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Vault Story</p>
        <h1 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:36px;line-height:1.15;color:#1e2a44;">You've been invited to help run Vault Story</h1>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.8;">Hi <strong>${recipientLabel}</strong>,</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">
          <strong>${input.inviterName}</strong> invited you to help manage members, plans, and access inside Vault Story.
        </p>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.8;">Use the link below to sign in or create your account. Once you're in, your admin access will be activated automatically.</p>
        <div style="margin:0 0 28px;">
          <a href="${loginUrl}" style="display:inline-block;background:#1e2a44;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:600;margin-right:12px;">Log in as admin</a>
          <a href="${signupUrl}" style="display:inline-block;background:#f7f5f2;color:#1e2a44;text-decoration:none;padding:14px 22px;border-radius:999px;border:1px solid rgba(30,42,68,0.14);font-weight:600;">Create your account</a>
        </div>
        <div style="padding:18px 20px;border-radius:22px;background:linear-gradient(180deg, rgba(230,184,106,0.14), rgba(230,184,106,0.05));font-size:14px;line-height:1.8;color:#5e5b57;">
          If the buttons above do not work, copy and paste this link into your browser:<br />
          <a href="${signupUrl}" style="color:#1e2a44;word-break:break-all;">${signupUrl}</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to: input.to, subject, html, text });
}



export async function sendSupportRequestEmail(input: SupportEmailInput): Promise<EmailResult> {
  const safeName = input.name.trim();
  const safeEmail = input.email.trim().toLowerCase();
  const safeSubject = input.subject.trim();
  const safeMessage = input.message.trim();

  const subject = `Support request: ${safeSubject}`;
  const text = [
    "A new support request was submitted for Vault Story.",
    "",
    `Name: ${safeName}`,
    `Email: ${safeEmail}`,
    `Subject: ${safeSubject}`,
    "",
    "Message:",
    safeMessage,
  ].join("\n");

  const html = `
    <div style="background:#f7f5f2;padding:32px 20px;font-family:Inter,Arial,sans-serif;color:#2a2a2a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(30,42,68,0.08);border-radius:28px;padding:36px;box-shadow:0 24px 60px rgba(30,42,68,0.08);">
        <p style="margin:0 0 12px;color:#e6b86a;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Vault Story Support</p>
        <h1 style="margin:0 0 18px;font-family:'Playfair Display',Georgia,serif;font-size:34px;line-height:1.15;color:#1e2a44;">New support request</h1>
        <div style="margin:0 0 24px;padding:20px;border-radius:24px;background:linear-gradient(180deg, rgba(30,42,68,0.05), rgba(230,184,106,0.08));border:1px solid rgba(30,42,68,0.08);">
          <p style="margin:0 0 8px;font-size:14px;line-height:1.8;color:#5e5b57;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.8;color:#5e5b57;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin:0;font-size:14px;line-height:1.8;color:#5e5b57;"><strong>Subject:</strong> ${safeSubject}</p>
        </div>
        <div style="padding:22px;border-radius:24px;border:1px solid rgba(30,42,68,0.08);background:#fbfaf8;">
          <p style="margin:0 0 10px;color:#7d7469;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">Message</p>
          <p style="margin:0;font-size:16px;line-height:1.85;color:#2a2a2a;white-space:pre-wrap;">${safeMessage}</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: SUPPORT_EMAIL,
    subject,
    html,
    text,
  });
}
export async function sendUnlockReadyEmail(input: UnlockReadyEmailInput): Promise<EmailResult> {
  const entryUrl = buildEntryLink(input.entryId, input.to);
  const recipientLabel = input.recipientName?.trim() || input.to;
  const subjectLine = input.subjectName?.trim()
    ? `${input.subjectName}'s memory is ready to open`
    : "A memory is ready to open";

  const subject = `${subjectLine} in Vault Story`;
  const text = [
    `Hi ${recipientLabel},`,
    "",
    `A memory in \"${input.vaultName}\" is now ready to open.`,
    `Title: ${input.entryTitle}`,
    `Unlocked: ${input.unlockedAt}`,
    "",
    "Open it here:",
    entryUrl,
  ].join("\n");

  const coverImage = input.coverImageUrl
    ? `
        <div style="margin:0 0 24px;overflow:hidden;border-radius:24px;border:1px solid rgba(30,42,68,0.08);background:#f3eee7;">
          <img src="${input.coverImageUrl}" alt="${input.vaultName} cover image" style="display:block;width:100%;height:auto;" />
        </div>
      `
    : "";

  const html = `
    <div style="background:#f7f5f2;padding:32px 20px;font-family:Inter,Arial,sans-serif;color:#2a2a2a;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid rgba(30,42,68,0.08);border-radius:28px;padding:36px;box-shadow:0 24px 60px rgba(30,42,68,0.08);">
        <p style="margin:0 0 12px;color:#e6b86a;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;">Vault Story</p>
        <h1 style="margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;font-size:36px;line-height:1.15;color:#1e2a44;">A memory is ready to be opened</h1>
        <p style="margin:0 0 12px;font-size:16px;line-height:1.8;">Hi <strong>${recipientLabel}</strong>,</p>
        <p style="margin:0 0 16px;font-size:16px;line-height:1.8;">
          A memory from <strong>${input.vaultName}</strong> has reached the moment it was waiting for.
        </p>
        ${coverImage}
        <div style="margin:0 0 24px;padding:20px;border-radius:24px;background:linear-gradient(180deg, rgba(30,42,68,0.05), rgba(230,184,106,0.08));border:1px solid rgba(30,42,68,0.08);">
          <p style="margin:0 0 8px;color:#7d7469;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">Ready now</p>
          <h2 style="margin:0 0 10px;font-family:'Playfair Display',Georgia,serif;font-size:30px;line-height:1.2;color:#1e2a44;">${input.entryTitle}</h2>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#5e5b57;">Unlocked ${input.unlockedAt}</p>
        </div>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.8;">When you're ready, open it and step back into the moment it was recorded for.</p>
        <div style="margin:0 0 28px;">
          <a href="${entryUrl}" style="display:inline-block;background:#1e2a44;color:#ffffff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:600;">Open the memory</a>
        </div>
        <div style="padding:18px 20px;border-radius:22px;background:linear-gradient(180deg, rgba(230,184,106,0.14), rgba(230,184,106,0.05));font-size:14px;line-height:1.8;color:#5e5b57;">
          If the button above does not work, copy and paste this link into your browser:<br />
          <a href="${entryUrl}" style="color:#1e2a44;word-break:break-all;">${entryUrl}</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: input.to,
    subject,
    html,
    text,
  });
}
