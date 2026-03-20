import Link from "next/link";
import { ChevronRight, HelpCircle, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqCategory = {
  title: string;
  eyebrow: string;
  intro: string;
  items: FaqItem[];
};

const quickPoints = [
  {
    title: "Private by default",
    body: "Vaults are designed for private family memories, not public posting or social engagement.",
    icon: LockKeyhole,
  },
  {
    title: "Built for meaningful timing",
    body: "The point is not just storing media. It is deciding when that memory should arrive in the future.",
    icon: Sparkles,
  },
  {
    title: "Made for memories that matter",
    body: "Letters, photos, voice notes, and video can live together so the future moment feels complete.",
    icon: ShieldCheck,
  },
];

const faqCategories: FaqCategory[] = [
  {
    eyebrow: "Getting started",
    title: "What Vault Story is and who it is for",
    intro:
      "These questions cover the core idea behind Vault Story, what makes it different from normal cloud storage, and the kinds of people who usually find it valuable.",
    items: [
      {
        question: "What is Vault Story?",
        answer:
          "Vault Story is a private memory vault for saving letters, photos, voice notes, and videos that are meant to be opened at the right moment in the future. Instead of only storing a file, it lets you pair that memory with timing, meaning, and context so it feels intentional when it returns.",
      },
      {
        question: "How is Vault Story different from Google Drive, iCloud, Dropbox, or a folder on my phone?",
        answer:
          "Those tools are built mainly for storage and retrieval. Vault Story is built around emotional timing. The main difference is that you are not just keeping a file somewhere safe. You are deciding who it is for, why it matters, and when it should arrive so it feels like a future moment rather than a forgotten upload.",
      },
      {
        question: "Who is Vault Story for?",
        answer:
          "It is for parents, grandparents, couples, families preserving stories, and people writing to their future selves. It is especially useful for anyone who already feels that certain memories should not be left to chance or buried in a camera roll.",
      },
      {
        question: "What kinds of memories do people usually save?",
        answer:
          "Common examples include birthday letters, milestone videos, messages for children to open later, stories from grandparents, voice notes from loved ones, reassurance for a hard future season, family history, and letters to a future self. The strongest entries are often simple, personal, and specific rather than polished.",
      },
      {
        question: "Is Vault Story only for parents and children?",
        answer:
          "No. Parents and children are a natural use case, but the product also works for family history, couple messages, end-of-life legacy memories, private personal journaling, and future-self reflections. The unifying idea is preserving something now so it can land later with more meaning.",
      },
      {
        question: "What does a vault actually contain?",
        answer:
          "A vault can contain multiple entries over time. Each entry can include text, photos, voice notes, and video, depending on what you want to save. In practice, one vault becomes a private timeline of meaningful memories tied to future dates, ages, or milestones.",
      },
    ],
  },
  {
    eyebrow: "Saving memories",
    title: "Creating entries and choosing what to preserve",
    intro:
      "These questions explain how entries work, what media can be uploaded, and how people normally shape a vault over time.",
    items: [
      {
        question: "What can I save inside an entry?",
        answer:
          "Entries can include written text, photos, voice notes, and video. The goal is to let one memory feel complete instead of flattening it into a single format. For example, a birthday entry could include a letter, a short video message, and a few photos from the same season of life.",
      },
      {
        question: "Can I save only a letter without any media?",
        answer:
          "Yes. A simple written letter can still be incredibly powerful. Many of the most meaningful future memories are only text because the emotional weight comes from honesty, timing, and what the person needed to hear.",
      },
      {
        question: "Can I add multiple photos, videos, or voice notes to one memory?",
        answer:
          "Yes. A single entry can represent one meaningful moment using several assets, as long as it fits within the account limits for your plan. That lets the memory feel richer and more alive when it is eventually opened.",
      },
      {
        question: "Can I keep editing an entry before it is sealed or unlocked?",
        answer:
          "Yes, entries can be drafted and refined before you consider them complete. This is useful when you want to write something now, revisit it later, and only lock it once it feels emotionally right.",
      },
      {
        question: "Do entries have to be polished or professionally recorded?",
        answer:
          "Not at all. In fact, the most valuable memories are often the least polished. A shaky video, a short voice note, or a simple letter can feel more real and more loved than something highly produced.",
      },
      {
        question: "Can I organize different people or themes into separate vaults?",
        answer:
          "Yes. Many people create separate vaults for different children, one vault for a partner, one for family history, or one for their own future self. Keeping those streams separate can make the archive feel calmer and easier to understand.",
      },
    ],
  },
  {
    eyebrow: "Unlocks and timing",
    title: "How future delivery works",
    intro:
      "These questions cover how timed opening works and why that timing matters so much to the product experience.",
    items: [
      {
        question: "How do future unlocks work?",
        answer:
          "When you create an entry, you can tie it to a future date, age, or meaningful moment. The entry stays locked until that condition is reached. Once the time arrives, it becomes available to view inside the vault and transforms from stored media into a timely emotional experience.",
      },
      {
        question: "Why is the unlock date so important?",
        answer:
          "Because timing changes how a memory is felt. The exact same letter can land very differently at age 8, age 18, after a wedding, after a loss, or during a difficult year. Vault Story treats timing as part of the memory itself, not as an afterthought.",
      },
      {
        question: "Can I choose a specific date instead of a milestone?",
        answer:
          "Yes. Date-based unlocks are ideal for birthdays, anniversaries, future holidays, and planned milestones. If you already know the future day that matters, a fixed date is usually the simplest choice.",
      },
      {
        question: "Can I create memories intended for a certain age, like 18 or 21?",
        answer:
          "Yes. Age-based future messages are one of the strongest use cases. Parents often save letters, advice, and videos for 16, 18, 21, graduation, marriage, or becoming a parent.",
      },
      {
        question: "Can a memory be opened immediately instead of later?",
        answer:
          "Some memories may be available right away, but the product is most powerful when it is used for delayed meaning. If you want something to feel like a future arrival, it should be tied to a future moment rather than opened the same day it is recorded.",
      },
      {
        question: "What happens when a memory unlocks?",
        answer:
          "Once unlocked, the entry becomes viewable in its reveal experience. That means the recipient can read the letter, watch the video, listen to the voice note, and reflect on what was predicted, remembered, or meant in the original moment.",
      },
    ],
  },
  {
    eyebrow: "Privacy and trust",
    title: "Security, access, and protecting family memories",
    intro:
      "These questions focus on privacy expectations, collaboration, and the trust people need before they will place meaningful memories into a product like this.",
    items: [
      {
        question: "Is Vault Story private?",
        answer:
          "Yes. Vault Story is designed around private vaults and intentional sharing. It is not a public social platform, and the product language, permissions, and structure are all meant to support a quieter, more respectful experience around sensitive memories.",
      },
      {
        question: "Who can see the memories in my vault?",
        answer:
          "Only people with the appropriate access to that vault should be able to see its contents. In practice, this means the vault owner controls who is invited and what level of participation those people have.",
      },
      {
        question: "Can I invite family members into a vault?",
        answer:
          "Yes. Family collaboration is part of the product idea. You can invite the right relatives so multiple people can help preserve stories, messages, and media in one shared family archive.",
      },
      {
        question: "Can invited family members edit or delete my memories?",
        answer:
          "That depends on their level of access. Collaboration should be intentional rather than open-ended. The product is built so the owner keeps control while still making it possible for trusted relatives to contribute where appropriate.",
      },
      {
        question: "What if I want some memories to stay completely private even inside a shared family vault?",
        answer:
          "That is a reasonable expectation, and it is one reason people often separate vaults by person or purpose. If a memory is especially personal, keeping it in its own vault or under tighter access control is usually the best approach.",
      },
      {
        question: "Why should I trust Vault Story with meaningful family history?",
        answer:
          "Because the product is built specifically around emotional permanence, intentional delivery, and private access. The whole experience is designed to feel more like an archive for loved ones and less like disposable consumer storage.",
      },
    ],
  },
  {
    eyebrow: "Accounts and plans",
    title: "Pricing, limits, and membership questions",
    intro:
      "These questions address common practical concerns around plan levels, storage expectations, and when someone might need to upgrade.",
    items: [
      {
        question: "Do I need a paid plan to start using Vault Story?",
        answer:
          "Not necessarily. The product is designed so people can begin simply and get emotionally attached before needing richer capacity. A free or starter experience should be enough to understand the core value before upgrading.",
      },
      {
        question: "When would I need to upgrade?",
        answer:
          "Most people upgrade when they want more storage, more media richness, more vaults, or broader family collaboration. The turning point is usually when the archive becomes important enough that they want to deepen it rather than just experiment.",
      },
      {
        question: "Does pricing depend on how many vaults or media files I have?",
        answer:
          "Plans are typically structured around capacity, features, and collaboration rather than one-off purchases for each memory. The specific limits depend on the current plan setup shown on the pricing page.",
      },
      {
        question: "Can I cancel later?",
        answer:
          "Yes, people should be able to stop a paid plan if they no longer need expanded capacity. The exact billing and downgrade behavior should follow whatever is currently offered on the pricing and account settings flows.",
      },
      {
        question: "If I downgrade, will my existing memories disappear?",
        answer:
          "A healthy product experience should protect the archive people already built rather than making memories feel disposable. In practice, downgrades are usually handled through limits on future usage rather than immediately destroying important existing content.",
      },
      {
        question: "Where can I compare plans?",
        answer:
          "The clearest current plan breakdown is on the pricing page, where you can compare what each tier includes and decide whether you need richer media, more storage, or broader family access.",
      },
    ],
  },
  {
    eyebrow: "Practical edge cases",
    title: "Questions people often think of later",
    intro:
      "These are the practical, emotional, or edge-case questions that usually come up once someone starts taking the idea seriously.",
    items: [
      {
        question: "What if I do not know exactly what to say yet?",
        answer:
          "That is normal. Many meaningful entries start as drafts. The important thing is usually to begin while the feeling is still real. You can refine the wording later if you need to.",
      },
      {
        question: "What if I want to save a memory for a child who is still very young?",
        answer:
          "That is one of the strongest reasons to use the product. You can record things while they are little, when their voice, habits, and world are still changing fast, then let those memories arrive years later when they can fully understand them.",
      },
      {
        question: "What if my family wants to preserve stories from grandparents before they are forgotten?",
        answer:
          "Vault Story is well suited to that. Voice notes, old photographs, written recollections, and short interviews can all live together so the story stays attached to the person, the voice, and the generation it came from.",
      },
      {
        question: "Can Vault Story be used for legacy or end-of-life memories?",
        answer:
          "Yes, and that can be one of the most meaningful uses. Messages, stories, reassurances, and family history can be preserved in a way that allows love and presence to arrive later, rather than being reduced to scattered files after the fact.",
      },
      {
        question: "Can I use Vault Story as a future journal for myself?",
        answer:
          "Yes. A future-self vault is a strong use case. People often write letters to themselves, record difficult seasons honestly, or capture beliefs and hopes they want to revisit years later with more perspective.",
      },
      {
        question: "What if I want help deciding what to record first?",
        answer:
          "A good first memory is usually something specific, personal, and hard to recreate later: how your child sounds right now, a family story only one relative knows, a birthday message for the future, or a short note about what this season of life feels like today.",
      },
      {
        question: "What if I am not very technical?",
        answer:
          "The product should feel more like guided preservation than like managing a complicated archive. The flow is based on simple actions people already understand: create a vault, save a memory, choose when it should open, and let time do the rest.",
      },
      {
        question: "What if I am afraid I will start and never keep up with it?",
        answer:
          "That is common, which is why the best approach is not trying to create a perfect archive all at once. Start with one meaningful vault and one important memory. A single honest message can matter more than an ambitious archive that never begins.",
      },
      {
        question: "Does every memory need a future unlock date?",
        answer:
          "Not necessarily, but delayed timing is what makes Vault Story distinctive. If you already know something should mean more in the future than it does today, that is usually a sign it belongs behind a timed reveal.",
      },
      {
        question: "What is the best way to think about using Vault Story well?",
        answer:
          "Think less like a person organizing files and more like a person protecting future moments. The best entries are not the most polished ones. They are the ones that capture something real before it disappears and deliver it when it can be felt most deeply.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.96),rgba(241,235,227,0.92))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative max-w-4xl section-stack">
                <Badge className="w-fit bg-secondary/88">Frequently asked questions</Badge>
                <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Detailed answers for the questions people ask before trusting a product with meaningful memories.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  This page covers the practical, emotional, and privacy questions that usually come up when someone is deciding whether Vault Story is the right place to preserve family memories for the future.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild><Link href="/signup">Start your vault</Link></Button>
                  <Button asChild variant="outline"><Link href="/pricing">View pricing</Link></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap pb-8 sm:pb-12">
          <div className="grid gap-4 md:grid-cols-3">
            {quickPoints.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="glass-panel">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl">{item.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="max-w-3xl section-stack">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Browse by topic</p>
            <h2 className="text-balance font-display text-4xl sm:text-5xl">Everything people usually want to know before they begin.</h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              The sections below are grouped so you can skim quickly or read deeply, depending on what you need answered.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {faqCategories.map((category) => (
              <Card key={category.title} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(30,42,68,0.08)]">
                <CardContent className="p-7 sm:p-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{category.eyebrow}</p>
                  <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-foreground">{category.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{category.intro}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-wrap pb-16 lg:pb-20">
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <Card key={category.title} className="overflow-hidden border-white/60 bg-card/90 shadow-[0_20px_56px_rgba(66,46,31,0.09)]">
                <CardContent className="p-7 sm:p-8 lg:p-10">
                  <div className="max-w-4xl section-stack">
                    <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{category.eyebrow}</p>
                    <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">{category.title}</h2>
                    <p className="text-base leading-8 text-muted-foreground sm:text-lg">{category.intro}</p>
                  </div>

                  <div className="mt-8 space-y-3">
                    {category.items.map((item) => (
                      <details key={item.question} className="group rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,243,237,0.82))] px-5 py-5 shadow-[0_12px_30px_rgba(30,42,68,0.05)]">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/85 text-primary">
                              <HelpCircle className="h-4 w-4" />
                            </span>
                            <span className="text-lg font-semibold leading-7 text-foreground">{item.question}</span>
                          </div>
                          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="pl-11 pr-2 pt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Still deciding?</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Start with one meaningful vault and one memory that would be hard to replace.
                </h2>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Create Your First Vault</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
