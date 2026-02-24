export const ROUTES_CONSTANTS = {
  FORBIDDEN: '/forbidden',
  HOME: {
    ROOT: '/',
    NEWS: {
      DETAIL: (id: number) => `/news/${id}`,
    },
    BOOK: {
      DETAIL: (id: number) => `/book/${id}`,
    }
  },
  PROTECTED: {
    USER: {
      DASHBOARD: '/user',
      PROFILE: {
        ROOT: '/user/profile',
        FORM: '/user/profile/form',
      },
    },
    ADMIN: {
      DASHBOARD: '/admin',
      BOOKS: '/admin/books',
      NEWS: {
        ROOT: '/admin/news',
        FORM: '/admin/news/form',
      },
      USERS: {
        ROOT: '/admin/users',
        FORM: '/admin/users/form',
      },
      PROFILE: {
        ROOT: '/admin/profile',
        FORM: '/admin/profile/form',
      },
      SETTINGS: {
        ROOT: '/admin/settings'
      },
    }
  },
  PAGES: [
    { URI: "/", NAME: "Inicio" },
    { URI: "/news", NAME: "Noticias" },
  ],
}