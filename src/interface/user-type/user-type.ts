export type userType = {
  id: string;
  name: string;
  password: string;
  email: string;
  posts: {
    title: string;
    description: string;
  };
};
