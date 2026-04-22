import { CalendarClock, HeartHandshake, LockKeyhole, MessageSquareText, Mic, ShieldCheck, Users, Video } from "lucide-react";

import type { SeoLandingPageContent } from "@/components/marketing/seo-landing-page";

export const seoLandingPages: Record<string, SeoLandingPageContent & { metaTitle: string; metaDescription: string }> = {
  "family-memory-vault": {
    slug: "family-memory-vault",
    eyebrow: "Family memory vault",
    metaTitle: "Family Memory Vault | Preserve Private Family Stories",
    metaDescription:
      "Create a private family memory vault for letters, photos, voice notes, videos, future messages, and shared family stories.",
    title: "A private family memory vault for the stories your loved ones should not lose.",
    description:
      "Vault Story helps families collect letters, photos, videos, and voice notes in one private archive, then choose when each memory should be opened in the future.",
    intro:
      "A family memory vault is more than storage. It gives your family a calm, intentional place to preserve voices, milestones, and everyday details before they disappear into old phones and scattered folders.",
    points: [
      {
        title: "One private place",
        body: "Keep meaningful family memories together instead of scattering them across camera rolls, cloud drives, and message threads.",
        icon: LockKeyhole,
      },
      {
        title: "Shared family care",
        body: "Invite trusted relatives so the right people can contribute stories, photos, and context over time.",
        icon: Users,
      },
      {
        title: "Timed unlocks",
        body: "Save memories now and let them open on birthdays, milestones, anniversaries, or future family moments.",
        icon: CalendarClock,
      },
    ],
    sections: [
      {
        title: "Built for families, not public feeds",
        body: "Vault Story is designed for private preservation rather than social posting. That makes it suitable for emotional letters, family history, voice notes, and memories that should stay between the people who matter.",
      },
      {
        title: "Preserve the context, not just the file",
        body: "A photo or video becomes more meaningful when it includes who it is for, why it matters, and when it should be opened. Vault Story keeps that context attached to the memory.",
      },
      {
        title: "Start small and grow over time",
        body: "You do not need a perfect archive on day one. Start with one vault and one memory, then add birthdays, school milestones, grandparent stories, and family messages as life unfolds.",
      },
      {
        title: "Helpful for parents, grandparents, and future generations",
        body: "Parents can save milestone messages, grandparents can preserve stories in their own voice, and families can build a shared archive that becomes more valuable with time.",
      },
    ],
    faqs: [
      {
        question: "What is a family memory vault?",
        answer:
          "A family memory vault is a private place to store meaningful family memories such as letters, photos, videos, voice notes, and stories so they can be revisited later with context and care.",
      },
      {
        question: "Can multiple family members contribute?",
        answer:
          "Yes. Vault Story is built around intentional family access, so trusted relatives can help care for the archive when you choose to invite them.",
      },
      {
        question: "Is a family memory vault different from cloud storage?",
        answer:
          "Yes. Cloud storage keeps files. Vault Story keeps memories with timing, meaning, recipients, and future unlock moments so they feel intentional when opened.",
      },
    ],
  },
  "digital-time-capsule": {
    slug: "digital-time-capsule",
    eyebrow: "Digital time capsule",
    metaTitle: "Digital Time Capsule | Save Messages for the Future",
    metaDescription:
      "Create a private digital time capsule with future messages, photos, videos, voice notes, and milestone unlocks for loved ones.",
    title: "Create a digital time capsule your family can open at the right future moment.",
    description:
      "Vault Story lets you save messages, media, and memories today, then tie them to a future date, age, or milestone so they arrive with meaning.",
    intro:
      "The best time capsules are not just collections of old files. They are messages from one season of life to another, opened when the timing makes them feel more powerful.",
    points: [
      {
        title: "Future dates",
        body: "Set memories to unlock on birthdays, anniversaries, graduations, weddings, or any date that matters.",
        icon: CalendarClock,
      },
      {
        title: "Rich media",
        body: "Combine letters, photos, videos, and voice notes so the future memory feels complete.",
        icon: Video,
      },
      {
        title: "Private by design",
        body: "Keep your time capsule personal, protected, and separate from public social feeds.",
        icon: ShieldCheck,
      },
    ],
    sections: [
      {
        title: "A modern time capsule for emotional moments",
        body: "Instead of burying a box or forgetting a folder, Vault Story lets you create a digital time capsule that stays connected to the people, dates, and milestones that matter.",
      },
      {
        title: "Messages can grow in meaning with time",
        body: "A simple video, voice note, or letter can feel very different years later. Vault Story helps you preserve that message and deliver it when it can be felt most deeply.",
      },
      {
        title: "Useful for children, partners, families, and your future self",
        body: "A digital time capsule can hold birthday letters, future advice, wedding messages, personal reflections, family stories, and memories from relatives who want their voice to be heard later.",
      },
      {
        title: "Designed to be opened, not forgotten",
        body: "The unlock experience is part of the product. Every memory can have a future moment attached, so it does not simply sit unseen in storage.",
      },
    ],
    faqs: [
      {
        question: "What can I put in a digital time capsule?",
        answer:
          "You can save written messages, photos, voice notes, and videos. The strongest time capsules usually include personal context about who the memory is for and why it matters.",
      },
      {
        question: "Can I choose when the time capsule opens?",
        answer:
          "Yes. Vault Story is built around future unlocks, so memories can open on dates, ages, or milestones.",
      },
      {
        question: "Is this only for families?",
        answer:
          "No. Families are a major use case, but a digital time capsule can also be used for partners, close friends, personal reflection, or future-self messages.",
      },
    ],
  },
  "legacy-messages": {
    slug: "legacy-messages",
    eyebrow: "Legacy messages",
    metaTitle: "Legacy Messages | Preserve Stories for Loved Ones",
    metaDescription:
      "Record legacy messages, family stories, reassurance, videos, and voice notes for loved ones to receive in the future.",
    title: "Preserve legacy messages that let loved ones hear your words in the future.",
    description:
      "Vault Story helps you save meaningful letters, voice notes, and videos so family members can receive your stories, reassurance, and wisdom when they need them most.",
    intro:
      "Legacy messages are not about perfect speeches. They are about preserving voice, love, context, and family history before those details are lost to time.",
    points: [
      {
        title: "Voice and video",
        body: "Record your real tone, pauses, expressions, and presence so loved ones can experience more than written words.",
        icon: Mic,
      },
      {
        title: "Family history",
        body: "Capture the stories, places, traditions, and lessons that often disappear when no one writes them down.",
        icon: HeartHandshake,
      },
      {
        title: "Private delivery",
        body: "Keep legacy memories protected and share them only with the people who should receive them.",
        icon: LockKeyhole,
      },
    ],
    sections: [
      {
        title: "A place for words that should outlast the moment",
        body: "Legacy messages can include advice, family stories, apologies, encouragement, memories, or simple expressions of love. Vault Story gives those messages somewhere intentional to live.",
      },
      {
        title: "For grandparents, parents, and anyone preserving family history",
        body: "A grandparent can record childhood stories. A parent can leave future birthday messages. A family member can preserve traditions and context that younger generations may not understand yet.",
      },
      {
        title: "Timing makes the message feel present",
        body: "Some messages matter most at a particular moment. A graduation, wedding, birthday, or difficult year can change how deeply the same words are received.",
      },
      {
        title: "Start with one honest message",
        body: "You do not need a complete life story to begin. One sincere voice note, one short video, or one letter can become irreplaceable later.",
      },
    ],
    faqs: [
      {
        question: "What are legacy messages?",
        answer:
          "Legacy messages are letters, recordings, videos, or stories preserved for loved ones to receive later, often as a way to pass on love, wisdom, family history, or reassurance.",
      },
      {
        question: "Can I record legacy messages as videos?",
        answer:
          "Yes. Vault Story supports rich memories such as videos and voice notes, which can preserve tone and presence in a way text cannot.",
      },
      {
        question: "Do legacy messages need to be formal?",
        answer:
          "No. The most meaningful legacy messages are often simple, honest, and specific. They do not need to be polished to matter.",
      },
    ],
  },
  "future-messages-for-family": {
    slug: "future-messages-for-family",
    eyebrow: "Future messages",
    metaTitle: "Future Messages for Family | Letters, Videos & Voice Notes",
    metaDescription:
      "Create future messages for family with letters, videos, photos, and voice notes that unlock on birthdays, milestones, or meaningful dates.",
    title: "Send future messages to family for birthdays, milestones, and moments that matter.",
    description:
      "Vault Story helps you create private future messages for children, partners, parents, grandparents, and loved ones, then unlock them when the timing is right.",
    intro:
      "A future message can feel like love arriving ahead of time. It lets your family receive your words when they are older, wiser, grieving, celebrating, or stepping into a new chapter.",
    points: [
      {
        title: "Milestone unlocks",
        body: "Create messages for 18th birthdays, graduations, weddings, anniversaries, first homes, or future family events.",
        icon: CalendarClock,
      },
      {
        title: "Personal formats",
        body: "Use letters, photos, videos, or voice notes depending on what the message needs.",
        icon: MessageSquareText,
      },
      {
        title: "Meaningful recipients",
        body: "Build a message for a child, partner, sibling, parent, grandchild, or future version of your family.",
        icon: HeartHandshake,
      },
    ],
    sections: [
      {
        title: "Future messages help ordinary words become timely",
        body: "The same message can mean something completely different when opened at age 18, on a wedding morning, after a move, or during a hard season. Vault Story treats that timing as part of the memory.",
      },
      {
        title: "Ideal for parents and children",
        body: "Parents can record messages while children are small, then let those words arrive when the child is old enough to understand the emotion behind them.",
      },
      {
        title: "Useful for family reassurance and encouragement",
        body: "Future messages can carry guidance, pride, comfort, stories, and reminders that family members may need later, even if they do not need them today.",
      },
      {
        title: "Private enough for real emotion",
        body: "Because Vault Story is not a public feed, messages can be more honest, tender, and specific than something written for social media.",
      },
    ],
    faqs: [
      {
        question: "How do future messages for family work?",
        answer:
          "You create a message, choose who it is for, and set when it should unlock. The message can include text, photos, video, or voice notes.",
      },
      {
        question: "What are good future message ideas?",
        answer:
          "Good ideas include birthday letters, graduation advice, wedding morning videos, family history, grandparent stories, and reassurance for a future difficult season.",
      },
      {
        question: "Can future messages include video or voice?",
        answer:
          "Yes. Video and voice can make a future message feel more personal because the recipient hears tone, laughter, pauses, and emotion.",
      },
    ],
  },
  "voice-messages-for-loved-ones": {
    slug: "voice-messages-for-loved-ones",
    eyebrow: "Voice messages",
    metaTitle: "Voice Messages for Loved Ones | Preserve Voices for the Future",
    metaDescription:
      "Save voice messages for loved ones in a private memory vault so family can hear your real voice during future milestones.",
    title: "Save voice messages for loved ones so your real voice can be heard later.",
    description:
      "Vault Story lets you preserve voice notes alongside letters, photos, and videos, then unlock them for family at meaningful future moments.",
    intro:
      "A voice can carry warmth, humor, reassurance, and presence in a way text alone cannot. Saving voice messages now can make future memories feel alive.",
    points: [
      {
        title: "Preserve tone and presence",
        body: "Voice notes keep the pauses, accent, laughter, and emotion that written messages often cannot capture.",
        icon: Mic,
      },
      {
        title: "Pair voice with context",
        body: "Add photos, letters, dates, and notes so the voice message is connected to the moment it came from.",
        icon: MessageSquareText,
      },
      {
        title: "Unlock later",
        body: "Let loved ones hear the message on a birthday, anniversary, milestone, or future day when it will matter most.",
        icon: CalendarClock,
      },
    ],
    sections: [
      {
        title: "A voice note can become a family treasure",
        body: "The way someone says your name, laughs, pauses, or tells a story can become irreplaceable. Vault Story helps preserve those small details with intention.",
      },
      {
        title: "Useful for parents, grandparents, partners, and children",
        body: "Voice messages can hold bedtime stories, birthday wishes, family memories, encouragement, and ordinary details that become precious later.",
      },
      {
        title: "More personal than a text file",
        body: "Written words matter, but a voice message can make the sender feel present. For many families, that is the difference between an archive and a living memory.",
      },
      {
        title: "Keep voice messages private",
        body: "Vault Story is built for private family preservation, so sensitive voice notes can stay in a controlled vault rather than sitting in a public or generic app.",
      },
    ],
    faqs: [
      {
        question: "Why save voice messages for loved ones?",
        answer:
          "Voice messages preserve tone, emotion, accent, and presence. They can help loved ones hear a real voice again during future milestones.",
      },
      {
        question: "Can I add voice messages to a family vault?",
        answer:
          "Yes. Voice notes can be part of a vault entry alongside written text, photos, and videos.",
      },
      {
        question: "When should a voice message unlock?",
        answer:
          "Common choices include birthdays, graduations, weddings, anniversaries, future holidays, or meaningful family milestones.",
      },
    ],
  },
};
