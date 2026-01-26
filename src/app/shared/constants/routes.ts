export const ROUTES = {
  HOME: '/',
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
    USER: '/user',
    ADMIN: '/admin'
  },
  PAGES: [
    {
      URI: "/",
      NAME: "Inicio"
    },
    {
      URI: "/library",
      NAME: "Biblioteca"
    },
    {
      URI: "/news",
      NAME: "Noticias"
    },
    {
      URI: "/test",
      NAME: "Test"
    }   
  ],
} as const;