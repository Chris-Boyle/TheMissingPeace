type BlogPost = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
};

type CommunityEvent = {
  id: string;
  title: string;
  date: string;
  description: string;
};

const posts: BlogPost[] = [
  {
    id: '1',
    title: 'Preparing for Birth: What to Expect',
    date: '2026-03-01',
    excerpt: 'A guide to help you feel confident and prepared for your birthing experience, covering what to expect and how to plan ahead.'
  },
  {
    id: '2',
    title: 'The Benefits of Doula Support',
    date: '2026-02-15',
    excerpt: 'Discover how a doula can provide emotional, physical, and educational support throughout your pregnancy and birth journey.'
  },
  {
    id: '3',
    title: 'Postpartum Care: Nurturing Yourself',
    date: '2026-01-28',
    excerpt: 'Tips and resources for new mothers to prioritize self-care and recovery during the postpartum period.'
  }
];

const communityEvents: CommunityEvent[] = [
  {
    id: "comfort-measures-workshop",
    title: "Comfort Measures Workshop",
    date: "2026-04-12",
    description:
      "An evening session on breathing, positioning, and partner support tools for labor.",
  },
  {
    id: "birth-planning-circle",
    title: "Birth Planning Circle",
    date: "2026-04-26",
    description:
      "A small-group conversation focused on preferences, advocacy, and creating a peaceful plan.",
  },
  {
    id: "postpartum-preparation-chat",
    title: "Postpartum Preparation Chat",
    date: "2026-05-10",
    description:
      "Guidance on recovery rhythms, feeding support, and building a gentle support system at home.",
  },
];

export default function BlogPage() {
  return (
    <section className="flex w-full justify-center bg-white px-4 py-16">
      <div className="w-full max-w-5xl space-y-14">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
            Resources and Community
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#7d5c3c]">
            Blog
          </h1>
          <p className="mt-4 text-lg leading-8 text-[#57453a]">
            Practical reading and community updates for families preparing for
            birth and postpartum.
          </p>
        </div>

        <ul className="space-y-8">
          {posts.map(post => (
            <li key={post.id} className="p-6 rounded-xl bg-[#f7f3ef] shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-[#3d2c1e] mb-2">{post.title}</h2>
              <time className="block text-sm text-[#a08c7d] mb-2" dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
              <p className="text-base text-[#4d3b2a] leading-relaxed">{post.excerpt}</p>
            </li>
          ))}
        </ul>

        <div className="rounded-[2rem] bg-[#f7efe4] p-8 shadow-[0_20px_55px_rgba(109,75,54,0.08)]">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8c6a52]">
              Community
            </p>
            <h2 className="mt-4 text-3xl text-[#684835] [font-family:Georgia,'Times_New_Roman',serif] sm:text-4xl">
              Upcoming gatherings and learning spaces.
            </h2>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {communityEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-[1.5rem] bg-[#fffaf5] p-6 shadow-[0_14px_35px_rgba(109,75,54,0.08)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8c6a52]">
                  {new Date(event.date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <h3 className="mt-3 text-2xl text-[#6d4b36] [font-family:Georgia,'Times_New_Roman',serif]">
                  {event.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[#57453a]">
                  {event.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
