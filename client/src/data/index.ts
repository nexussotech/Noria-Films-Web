import type { Service, Project, Feature, Pillar, Social } from '../types'

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Producción Cinematográfica',
    description: 'Desarrollo completo de proyectos cinematográficos, desde el guión hasta la postproducción.',
    icon: 'CP',
    image_url: '/assets/images/noria/service-1.jpg',
  },
  {
    id: 2,
    title: 'Comerciales y Publicidad',
    description: 'Creación de contenido publicitario impactante que conecta marcas con su audiencia.',
    icon: 'CM',
    image_url: '/assets/images/noria/service-2.jpg',
  },
  {
    id: 3,
    title: 'Proyectos Culturales',
    description: 'Documentales, cortometrajes y contenido audiovisual para iniciativas culturales y artísticas.',
    icon: 'PC',
    image_url: '/assets/images/noria/service-3.jpg',
  },
  {
    id: 4,
    title: 'Cobertura de Eventos',
    description: 'Registro profesional de festivales, conciertos, conferencias y eventos especiales.',
    icon: 'EV',
    image_url: '/assets/images/noria/service-4.jpg',
  },
]

export const PROJECTS: Project[] = [
  { id: 1, title: 'Rodaje exterior', category: 'Ficción', cat: 'ficcion', image: '/assets/images/noria/portfolio-1.jpg' },
  { id: 2, title: 'Sesión de producción', category: 'Publicidad', cat: 'publicidad', image: '/assets/images/noria/portfolio-2.jpg' },
  { id: 3, title: 'Documental cultural', category: 'Documental', cat: 'documental', image: '/assets/images/noria/portfolio-3.jpg' },
  { id: 4, title: 'Cobertura de evento', category: 'Eventos', cat: 'eventos', image: '/assets/images/noria/portfolio-4.jpg' },
  { id: 5, title: 'Producción audiovisual', category: 'Musical', cat: 'musical', image: '/assets/images/noria/portfolio-5.jpg' },
  { id: 6, title: 'Equipo en set', category: 'Serie', cat: 'serie', image: '/assets/images/noria/portfolio-6.jpg' },
]

export const PORTFOLIO_FILTERS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Ficción', value: 'ficcion' },
  { label: 'Documental', value: 'documental' },
  { label: 'Eventos', value: 'eventos' },
]

export const FEATURES: Feature[] = [
  { icon: 'NF', title: 'Pasión Cinematográfica', desc: 'Cada proyecto es una oportunidad para contar historias que inspiran y conectan con las emociones del público.' },
  { icon: 'NF', title: 'Calidad Profesional', desc: 'Trabajamos con los más altos estándares de producción para garantizar resultados excepcionales en cada entrega.' },
  { icon: 'NF', title: 'Apoyo al Talento', desc: 'Impulsamos a creadores emergentes, brindando espacios y oportunidades para desarrollar su potencial artístico.' },
]

export const PILLARS: Pillar[] = [
  { icon: 'NF', title: 'Mentoría Profesional', desc: 'Conectamos a nuevos talentos con profesionales experimentados de la industria para guiar su desarrollo creativo y técnico.' },
  { icon: 'NF', title: 'Espacios Creativos', desc: 'Facilitamos acceso a equipos, locaciones y recursos técnicos para que los creadores puedan materializar sus ideas.' },
  { icon: 'NF', title: 'Lanzamiento de Proyectos', desc: 'Apoyamos en la producción y difusión de obras originales, ayudando a que alcancen festivales y plataformas relevantes.' },
]

export const SOCIALS: Social[] = [
  { icon: 'f', label: 'Facebook', href: '#' },
  { icon: 'IG', label: 'Instagram', href: '#' },
  { icon: '▶', label: 'YouTube', href: '#' },
  { icon: 'in', label: 'LinkedIn', href: '#' },
  { icon: '@', label: 'Email', href: 'mailto:contacto@noriafilms.com' },
]

export const BUDGET_RANGES = [
  'Menos de $5,000 MXN',
  '$5,000 – $15,000 MXN',
  '$15,000 – $30,000 MXN',
  '$30,000 – $60,000 MXN',
  'Más de $60,000 MXN',
  'Por definir',
]
