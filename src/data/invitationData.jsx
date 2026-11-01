
export const defaultInvitation = {
  id: "wedding-demo-001",

  couple: {
    groom: "Aarav",
    bride: "Kiara",
    groomSurname: "Sharma",
    brideSurname: "Mehta",
  },

  wedding: {
    date: "2027-02-14",
    time: "7:00 PM",
    city: "Jaipur, Rajasthan",
  },

  venue: {
    name: "THE GRAND PALACE",
    address: "Amer Road, Jaipur, Rajasthan",
    mapLink: "https://maps.google.com/?q=Amer+Road+Jaipur",
  },

  events: [
    {
      id: 1,
      icon: "🌼",
      name: "Haldi",
      daysBefore: 2,
      time: "11:00 AM onwards",
      description:
        "A morning of sunshine, marigolds and blessings.",
    },
    {
      id: 2,
      icon: "🌿",
      name: "Mehendi",
      daysBefore: 1,
      time: "4:00 PM onwards",
      description:
        "An evening of music, henna and happy hearts.",
    },
    {
      id: 3,
      icon: "♡",
      name: "The Wedding",
      daysBefore: 0,
      time: "7:00 PM onwards",
      description:
        "Join us as we begin our forever together.",
    },
  ],

  invitation: {
    welcomeMessage: "Together with our families",
    description:
      "Joyfully invite you to celebrate the beginning of our forever.",
    theme: "royal",
  },
};
