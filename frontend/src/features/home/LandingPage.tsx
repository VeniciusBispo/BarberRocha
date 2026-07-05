import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  CalendarDays, 
  GraduationCap, 
  CreditCard, 
  Tv, 
  MapPin, 
  MessageCircleQuestion, 
  Scissors,
  Clock,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookingRedirect = () => {
    if (user?.isAdmin) {
      navigate('/admin');
    } else {
      navigate('/agendar');
    }
  };

  // Mensagens codificadas para WhatsApp
  const contactLinks = {
    mentoria: 'https://wa.me/5579998443523?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20a%20Mentoria%20/%20Curso%20do%20Básico%20ao%20Transformador.',
    rochaCred: 'https://wa.me/5579996556393?text=Olá!%20Gostaria%20de%20fazer%20uma%20simulação%20de%20saque/limite%20no%20Rocha%20Cred.',
    rochaCanais: 'https://wa.me/5579998443523?text=Olá!%20Gostaria%20de%20saber%20como%20funciona%20o%20Rocha%20Canais%20(TV,%20Filmes%20e%20Séries).',
    duvidas: 'https://wa.me/5579998443523?text=Olá!%20Tenho%20uma%20dúvida%20e%20gostaria%20de%20falar%20com%20o%20suporte.',
    localizacao: 'https://maps.app.goo.gl/RWumUd6aF5uALw1H7',
    instagram: 'https://www.instagram.com/' // Pode ser complementado com o arroba correto
  };

  return (
    <div className="landing-wrapper">
      {/* Perfil & Bio */}
      <div className="landing-profile">
        <div className="landing-avatar-wrapper">
          {/* Avatar com efeito de borda iluminada */}
          <div className="landing-avatar-glow"></div>
          <img 
            src="https://bio.linkcdn.cc/upload/2025040913/174420427700083766.jpg" 
            alt="Barbearia Rocha 20" 
            className="landing-avatar" 
            onError={(e) => {
              // Fallback caso a imagem externa falhe
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=150';
            }}
          />
        </div>
        <h2 className="landing-title">BARBEARIA ROCHA 20</h2>
        <p className="landing-subtitle">Ritual de Estilo, Confiança & Conexão</p>

        {/* Tags de Especialidades */}
        <div className="landing-specialties">
          <div className="specialty-tag">📐 Visagismo</div>
          <div className="specialty-tag">🧔🏻‍♂️ Barbas Premium</div>
          <div className="specialty-tag">✂️ Corte Tesoura</div>
          <div className="specialty-tag">🪒 Degradê Perfeito</div>
          <div className="specialty-tag">🛵 Atendimento a Domicílio</div>
        </div>
      </div>

      {/* Grid de Links/Ações Principais */}
      <div className="landing-links-grid">
        
        {/* Botão Agendamento Online (Destaque Principal) */}
        <button 
          onClick={handleBookingRedirect}
          className="landing-btn-action landing-btn-action--highlight"
          aria-label="Agendar horário online"
        >
          <div className="landing-btn-icon"><CalendarDays size={22} /></div>
          <div className="landing-btn-content">
            <span className="landing-btn-title">AGENDAR MEU HORÁRIO 📝</span>
            <span className="landing-btn-desc">Escolha barbeiro, dia e hora online em 1 minuto</span>
          </div>
          <span className="btn-badge">Agende Já</span>
        </button>

        {/* Mentoria / Curso */}
        <a 
          href={contactLinks.mentoria} 
          target="_blank" 
          rel="noopener noreferrer"
          className="landing-btn-action"
        >
          <div className="landing-btn-icon"><GraduationCap size={22} /></div>
          <div className="landing-btn-content">
            <span className="landing-btn-title">CURSO: DO BÁSICO AO TRANSFORMADOR 📚✂️</span>
            <span className="landing-btn-desc">Mentoria exclusiva e treinamento prático de barbearia</span>
          </div>
        </a>

        {/* Rocha Cred */}
        <a 
          href={contactLinks.rochaCred} 
          target="_blank" 
          rel="noopener noreferrer"
          className="landing-btn-action"
        >
          <div className="landing-btn-icon"><CreditCard size={22} /></div>
          <div className="landing-btn-content">
            <span className="landing-btn-title">ROCHA CRED 💰💳💵</span>
            <span className="landing-btn-desc">Simulação de liberação de limite e saque no cartão</span>
          </div>
        </a>

        {/* Rocha Canais */}
        <a 
          href={contactLinks.rochaCanais} 
          target="_blank" 
          rel="noopener noreferrer"
          className="landing-btn-action"
        >
          <div className="landing-btn-icon"><Tv size={22} /></div>
          <div className="landing-btn-content">
            <span className="landing-btn-title">ROCHA CANAIS 📺🍿</span>
            <span className="landing-btn-desc">Pacote completo de canais, filmes e séries para sua TV</span>
          </div>
        </a>

        {/* Localização */}
        <a 
          href={contactLinks.localizacao} 
          target="_blank" 
          rel="noopener noreferrer"
          className="landing-btn-action"
        >
          <div className="landing-btn-icon"><MapPin size={22} /></div>
          <div className="landing-btn-content">
            <span className="landing-btn-title">COMO CHEGAR (LOCALIZAÇÃO) 📍</span>
            <span className="landing-btn-desc">Ver mapa e rotas no Google Maps</span>
          </div>
        </a>

        {/* Fale Conosco / Dúvidas */}
        <a 
          href={contactLinks.duvidas} 
          target="_blank" 
          rel="noopener noreferrer"
          className="landing-btn-action"
        >
          <div className="landing-btn-icon"><MessageCircleQuestion size={22} /></div>
          <div className="landing-btn-content">
            <span className="landing-btn-title">DÚVIDAS? FALE CONOSCO 🤝🏻</span>
            <span className="landing-btn-desc">Converse diretamente com o nosso suporte via WhatsApp</span>
          </div>
        </a>

      </div>

      {/* Seção Sobre / Detalhes Rápidos */}
      <div className="landing-about">
        <div className="about-item">
          <Scissors size={18} />
          <span>Mais de 7 anos de experiência cuidando do seu visual.</span>
        </div>
        <div className="about-item">
          <Clock size={18} />
          <span>Terça a Sexta: 09h às 20h | Sábado: 08h às 19h</span>
        </div>
        <div className="about-item">
          <Compass size={18} />
          <span>Atendimento presencial premium ou delivery a domicílio.</span>
        </div>
      </div>

      {/* Rodapé Dedicado / Fé */}
      <footer className="landing-footer">
        <p className="faith-message">Toda honra e toda glória sejam dadas a Deus sempre. 🙏🏻</p>
        <div className="socials-wrapper">
          <a href={contactLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </a>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Barbearia Rocha 20. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
export default LandingPage;
