export const ROUTES_CONSTANTS = {
  HOME: {
    ROOT: '/',
    NEWS: '/news'
  },
  FORBIDDEN: '/forbidden',
  LIBRARY: {
    BASE: '/library',
    BOOKS: '/library/books',    
    BOOK: (id: number) => `/library/book/${id}`
  },
  NEWS: {
    BASE: '/news',
    DETAIL: (id: number) => `/news/${id}`
  },
  PROTECTED: {
    USER: {
      BASE: '/user',
      DASHBOARD: '/user',
      PROFILE: {
        ROOT: '/user/profile',
        FORM: '/user/profile/form',
      },
    },
    ADMIN: {
      BASE: '/admin',
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
      SETTINGS: '/admin/settings',
    }
  },
  PAGES: [
    { URI: "/", NAME: "Inicio" },
    { URI: "/library", NAME: "Biblioteca" },
    { URI: "/news", NAME: "Noticias" },
    { URI: "/test", NAME: "Test" }   
  ],
}