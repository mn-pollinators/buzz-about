// We have some types for Anime.js that we got from the @types/animejs package.
// However, that package erroneously expects us to import Anime.js from
// 'node_modules/animejs' instead of 'node_modules/animejs/lib/anime.es.js'.
// So, this module just associates all of the types with the path that we want.
declare module 'animejs/lib/anime.es' {
  import * as anime from 'animejs';
  export default anime;
}
