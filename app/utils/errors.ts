export const defaultError = {
  title: "Oops, something isn't right!",
  description:
    "Sorry, it seems like something went wrong here. Please try again or contact support!",
};

const errors: Record<string, { title: string; description: string }> = {
  "404": {
    title: "Page not found.",
    description: "Sorry, we couldn't find the page you're looking for.",
  },
};

export default errors;
