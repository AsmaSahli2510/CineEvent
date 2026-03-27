import gatsbyImg from "../images/upscalemedia-transformed.png";
import parisImg from "../images/Gemini_Generated_Image_8huwzw8huwzw8huw.png";
import noirImg from "../images/Gemini_Generated_Image_rgs6dorgs6dorgs6.png";

export const events = [
  {
    id: "great-gatsby-gala",
    title: "The Great Gatsby Gala",
    heroTitle: "THE GREAT GATSBY GALA",
    category: "Exclusive Gala",
    secondaryTag: "Charity Event",
    price: "$120",
    fullPrice: "$120.00",
    date: "Oct 24 • 8:00 PM",
    fullDate: "October 24, 2024 • 8:00 PM",
    location: "Burgundy Theater, New York",
    fullLocation: "Burgundy Luxury Theater, New York",
    venueAddress: "152 W 54th St, New York, NY 10019",
    badge: "Selling Fast",
    image: gatsbyImg,
    gallery: [gatsbyImg, parisImg, noirImg, parisImg],
    about: [
      "Step back into the roaring twenties for an evening of unparalleled glamour and cinematic splendor. This exclusive screening will be accompanied by a live jazz ensemble, themed cocktails, and an immersive atmosphere.",
      "Guests are encouraged to dress in their finest 1920s attire. The evening includes a champagne reception and a post-screening conversation with film enthusiasts.",
    ],
    reviews: [
      {
        initials: "JD",
        name: "Julianne Deville",
        time: "2 days ago",
        text: "The last gala event was magical. Decor and sound quality were exceptional. Can’t wait for this edition!",
      },
      {
        initials: "MR",
        name: "Marcus Rossi",
        time: "1 week ago",
        text: "Absolutely worth it. These events are complete experiences, not just screenings.",
      },
      {
        initials: "EL",
        name: "Elena Laurent",
        time: "2 weeks ago",
        text: "Attending with my book club. CinéEvent always delivers a premium atmosphere.",
      },
    ],
  },
  {
    id: "midnight-in-paris-screening",
    title: "Midnight in Paris Screening",
    heroTitle: "MIDNIGHT IN PARIS",
    category: "Limited Screening",
    secondaryTag: "Live Jazz",
    price: "$45",
    fullPrice: "$45.00",
    date: "Oct 28 • 9:30 PM",
    fullDate: "October 28, 2024 • 9:30 PM",
    location: "Golden Era Cinema, LA",
    fullLocation: "Golden Era Cinema, Los Angeles",
    venueAddress: "110 Sunset Blvd, Los Angeles, CA 90028",
    badge: "Limited",
    image: parisImg,
    gallery: [parisImg, gatsbyImg, noirImg, gatsbyImg],
    about: [
      "An intimate screening inspired by vintage Parisian nights, paired with curated live jazz and signature cocktails.",
      "Perfect for cinephiles looking for an elegant late-night cinema experience with a social after-session.",
    ],
    reviews: [
      {
        initials: "CL",
        name: "Camille Laurent",
        time: "3 days ago",
        text: "The music and atmosphere made the whole night unforgettable.",
      },
      {
        initials: "AN",
        name: "Alex Navarro",
        time: "6 days ago",
        text: "Great venue, smooth organization, and a very classy audience.",
      },
      {
        initials: "RT",
        name: "Rita Thompson",
        time: "2 weeks ago",
        text: "Loved the cinematic mood and the curated post-screening playlist.",
      },
    ],
  },
  {
    id: "noir-film-festival",
    title: "Noir Film Festival",
    heroTitle: "NOIR FILM FESTIVAL",
    category: "Festival Pick",
    secondaryTag: "Popular Choice",
    price: "$75",
    fullPrice: "$75.00",
    date: "Nov 05 • 7:00 PM",
    fullDate: "November 05, 2024 • 7:00 PM",
    location: "Vintage Film House, CHI",
    fullLocation: "Vintage Film House, Chicago",
    venueAddress: "58 Lake St, Chicago, IL 60601",
    badge: "Popular",
    image: noirImg,
    gallery: [noirImg, gatsbyImg, parisImg, gatsbyImg],
    about: [
      "A curated celebration of noir classics featuring immersive lighting design and expert-led discussions.",
      "From iconic detective stories to hidden gems, this festival offers a rich cinematic journey for dedicated fans.",
    ],
    reviews: [
      {
        initials: "HB",
        name: "Hugo Bernard",
        time: "1 day ago",
        text: "A must for noir lovers. Programming quality is top-tier.",
      },
      {
        initials: "PS",
        name: "Paula Stein",
        time: "5 days ago",
        text: "Excellent curation and an amazing vintage venue ambiance.",
      },
      {
        initials: "JT",
        name: "Jon Tate",
        time: "10 days ago",
        text: "Great crowd and very smooth organization throughout the event.",
      },
    ],
  },
];

export const eventById = Object.fromEntries(
  events.map((event) => [event.id, event]),
);
