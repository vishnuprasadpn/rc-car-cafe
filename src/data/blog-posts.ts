export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  metaDescription: string
  content: string
  author: string
  date: string
  lastModified?: string
  readTime: string
  coverImage: string
  tags: string[]
  keywords: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "rc-car-racing-in-bangalore-discovering-a-different-kind-of-thrill",
    title: "RC Car Racing in Bangalore: Discovering a Different Kind of Thrill",
    excerpt:
      "In Bangalore, you never really run out of things to do. But every now and then, you come across something different — the kind of experience that stays with you longer than you expect.",
    metaDescription:
      "Discover the thrill of RC car racing in Bangalore at Fury Road RC Club. Experience professional tracks, hobby grade cars, and an adrenaline rush like no other. Read about what makes RC gaming a must-try activity in the city.",
    author: "Fury Road RC Club",
    date: "2026-02-17",
    lastModified: "2026-02-17",
    readTime: "5 min read",
    coverImage: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg",
    tags: ["RC Racing", "Bangalore", "Experience", "Indoor Gaming"],
    keywords: [
      "RC car racing Bangalore",
      "Fury Road RC Club",
      "indoor RC racing Bangalore",
      "RC gaming Bangalore",
      "things to do in Bangalore",
      "remote control car racing",
      "RC car experience",
      "indoor activities Bangalore",
      "weekend activities Bangalore",
      "RC car club near me",
    ],
    content: `In Bangalore, you never really run out of things to do. The city has its own ways of unwinding. It might be a late coffee night, a live gig you didn't plan for, a last-minute house party, a sudden weekend escape, or just driving around after the roads finally calm down. But every now and then, you come across something different — the kind of experience that stays with you longer than you expect.

One of those experiences, surprisingly, led me indoors, to a place where small machines pull you in almost without trying and somehow manage to feel genuinely excited. Yeah, it's RC gaming.

In Bangalore, RC gaming clubs are still few and far between. Perhaps that's what makes them feel special — almost like places you discover rather than plan for. At a glance, it's easy to dismiss it as just another indoor pastime, another screen-adjacent hobby in an already digital world. I thought so too. But the first time I stepped into Furyroad RC Club, that assumption changed almost immediately.

The place felt alert, like something interesting was about to happen. Controllers rested in steady hands. Miniature machines waited at the starting line, patient but ready.

As the cars dart across the track, adrenaline rises in a way that feels surprisingly physical. Your eyes follow every turn. Your reflexes respond faster than you expect. Time seems to move differently. For those few minutes, your attention stays right there on the track, with the sound of motors and the occasional encouragement from someone standing nearby.

There's also something wonderfully grounding about it. You don't need prior experience. You don't need to be an expert. You just need curiosity and the willingness to try. And once you do, even for a single lap, it stays with you. The memory of concentrating so deeply, of feeling both calm and excited at the same time, is reason enough to come back.

As the city slowly transitions from the older era of outdoor games to newer forms of play, something interesting is happening. The younger generation isn't just gravitating toward RC gaming for novelty; they're drawn by how deeply it pulls them in. It's the kind of activity that asks you to be there fully — alert and engaged, without forcing it.

My recent experience at Furyroad RC Club reminded me of a line from *The Old Man and the Sea* by Ernest Hemingway:

> "Now is no time to think of what you do not have. Think of what you can do with what there is."

That quote lingers because RC gaming lives in that exact moment. You work with what you have — your control, your judgment, your ability to adapt in real time. Every mistake teaches you something. Every clean lap builds confidence. Slowly, almost without realizing it, patience grows. Your thinking becomes clearer and more deliberate. You begin to anticipate rather than react. What starts off feeling like a simple game slowly shows you how much control, patience, and self-belief it actually asks for.

And perhaps that's the biggest surprise. RC gaming doesn't slow you down; it tunes you. It teaches the mind to stay steady under pressure, to recover quickly, to remain focused even when speed threatens to take over. In a city like Bangalore — fast, ambitious, and always on the move — this kind of engagement feels refreshingly balanced and real.

So while RC gaming clubs may still be rare here, their impact feels anything but small. They offer more than entertainment; they offer an experience. One that blends adrenaline with awareness, and play with personal growth. And once you feel that rush, once you've guided a car through its first clean turn, it's hard not to believe that everyone should try RC car racing at least once. The experience is simply different, and sometimes, different is exactly what a city — and a person — needs.

If you're looking to do something different with your free time, Furyroad RC Club is worth stepping into. Pick up the controller, take the reins, and see how it feels to guide a car through every turn. You'll learn how to play, sure — and maybe even how to win — but more than that, you'll learn to enjoy being fully there, moment by moment.`,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
