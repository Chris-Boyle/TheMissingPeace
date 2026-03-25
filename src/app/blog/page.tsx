type BlogPost = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
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

export default function BlogPage() {
  return (
    <section className="w-full flex justify-center py-16 px-4 bg-white">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-semibold mb-10 text-[#7d5c3c] tracking-tight text-center">Blog</h1>
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
      </div>
    </section>
  );
}
