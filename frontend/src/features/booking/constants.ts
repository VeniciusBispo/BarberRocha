export interface ServiceItem {
  name: string;
  price: number;
  duration: number;
  desc: string;
  badge?: string;
}

export interface BarberItem {
  name: string;
  desc: string;
  avatar?: string;
}

export const servicesList: ServiceItem[] = [
  { 
    name: 'Corte Masculino', 
    price: 50, 
    duration: 30, 
    desc: 'Corte degradê fade, tesoura ou máquina. Lavagem e finalização inclusos.' 
  },
  { 
    name: 'Barba Alinhada', 
    price: 40, 
    duration: 30, 
    desc: 'Alinhamento, toalha quente e massagem facial com óleos premium.' 
  },
  { 
    name: 'Combo Rocha 20', 
    price: 80, 
    duration: 60, 
    desc: 'Corte completo + barba com toalha quente + lavagem premium cortesia.', 
    badge: 'Mais Escolhido' 
  }
];

export const barbersList: BarberItem[] = [
  { 
    name: 'Qualquer Profissional', 
    desc: 'O primeiro barbeiro disponível.' 
  },
  { 
    name: 'Felipe Rocha', 
    desc: 'Especialista em Degradê e Freestyle.', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' 
  },
  { 
    name: 'Thiago Silva', 
    desc: 'Mestre da Barba Clássica e Navalha.', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' 
  }
];
