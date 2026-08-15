import defaultBackground from '../assets/blog-placeholder-1.webp';

/**
 * Hero copy and background settings for one page.
 */
export interface HeroSectionConfig {
  /**
   * Main hero headline text.
   */
  text: string;
  /**
   * Optional hero subtitle text.
   */
  subtitle?: string;
  /**
   * Hero background image URL.
   */
  backgroundImage: string;
}

/**
 * Centralized hero configuration for all top-level pages and post fallback.
 */
export interface HeroConfig {
  home: HeroSectionConfig;
  blog: HeroSectionConfig;
  tags: HeroSectionConfig;
  about: HeroSectionConfig;
  /**
   * Default hero image shared by all article pages.
   */
  postDefaultBackground: string;
}

export const heroConfig: HeroConfig = {
  home: {
    text: 'Conoce más de mí y mis proyectos..',
    subtitle: 'Conocerás mis aprendizajes y crecimientos en esta plataforma.',
    backgroundImage: defaultBackground.src,
  },
  blog: {
    text: 'Mis evidencias',
    subtitle: 'Comparto mis aprendizajes, proyectos, evidencias y experiencias durante mi formación.',
    backgroundImage: defaultBackground.src,
  },
  tags: {
    text: 'Temas',
    subtitle: 'Explora mis artículos por temas de interés.',
    backgroundImage: defaultBackground.src,
  },
  about: {
    text: 'Sobre mí',
    subtitle: 'Conoce mi formación, habilidades y experiencia en Ingeniería de Sistemas.',
    backgroundImage: defaultBackground.src,
  },
  postDefaultBackground: defaultBackground.src,
};
