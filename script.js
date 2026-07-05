document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MENU RESPONSIVO (HEADER)
       ========================================================================== */
    const headerToggle = document.getElementById('header-toggle');
    const headerNav = document.getElementById('header-nav');
    const headerLinks = document.querySelectorAll('.header__nav-link');

    if (headerToggle && headerNav) {
        headerToggle.addEventListener('click', () => {
            headerToggle.classList.toggle('active');
            headerNav.classList.toggle('active');
            document.body.classList.toggle('overflow-hidden');
        });

        // Fechar menu ao clicar em links
        headerLinks.forEach(link => {
            link.addEventListener('click', () => {
                headerToggle.classList.remove('active');
                headerNav.classList.remove('active');
                document.body.classList.remove('overflow-hidden');
                
                // Mudar active link
                headerLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }


    /* ==========================================================================
       GALERIA DE IMAGENS COM LIGHTBOX
       ========================================================================== */
    const galleryFilterBtns = document.querySelectorAll('.gallery__filter-btn');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let activeGalleryImages = [];
    let currentImageIndex = 0;

    // Filtros da Galeria
    galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mudar classe active no botão
            galleryFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Pequeno delay para animação suave
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 350);
                }
            });
            
            updateActiveImagesArray();
        });
    });

    function updateActiveImagesArray() {
        activeGalleryImages = [];
        galleryItems.forEach(item => {
            if (item.style.display !== 'none') {
                const img = item.querySelector('.gallery__img');
                activeGalleryImages.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt')
                });
            }
        });
    }

    // Inicializar array de imagens ativas
    updateActiveImagesArray();

    // Eventos do Lightbox
    galleryItems.forEach(item => {
        const zoomBtn = item.querySelector('.gallery__zoom-btn');
        if (zoomBtn) {
            zoomBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = item.querySelector('.gallery__img');
                openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
            });
        }

        item.addEventListener('click', () => {
            const img = item.querySelector('.gallery__img');
            openLightbox(img.getAttribute('src'), img.getAttribute('alt'));
        });
    });

    function openLightbox(src, alt) {
        lightboxImg.setAttribute('src', src);
        lightboxImg.setAttribute('alt', alt);
        lightboxCaption.textContent = alt;

        // Achar index no array ativo
        currentImageIndex = activeGalleryImages.findIndex(img => img.src === src);

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
        const img = activeGalleryImages[currentImageIndex];
        lightboxImg.setAttribute('src', img.src);
        lightboxImg.setAttribute('alt', img.alt);
        lightboxCaption.textContent = img.alt;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % activeGalleryImages.length;
        const img = activeGalleryImages[currentImageIndex];
        lightboxImg.setAttribute('src', img.src);
        lightboxImg.setAttribute('alt', img.alt);
        lightboxCaption.textContent = img.alt;
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Fechar ao clicar fora da imagem
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Controles do Teclado
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }


    /* ==========================================================================
       INTERFACE DO SISTEMA DE AGENDAMENTO (WIZARD)
       ========================================================================== */
    
    // Objeto do Estado do Agendamento
    const bookingState = {
        step: 1,
        maxSteps: 4,
        service: '',
        price: 0,
        duration: 0,
        barber: '',
        date: '',
        dateFormatted: '',
        time: '',
        clientName: '',
        clientPhone: ''
    };

    // Elementos DOM do Wizard
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const progressBar = document.getElementById('progress-bar');
    const progressSteps = document.querySelectorAll('.booking__progress-step');
    const stepContents = document.querySelectorAll('.booking__step-content');
    
    // Dados Dinâmicos Resumo
    const summaryService = document.getElementById('summary-service');
    const summaryBarber = document.getElementById('summary-barber');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');

    // Inicialização do agendamento
    function initBooking() {
        setupServices();
        setupBarbers();
        gerarCalendario();
        updateWizard();
    }

    // Avançar ou Voltar Etapas
    btnNext.addEventListener('click', () => {
        if (bookingState.step < bookingState.maxSteps) {
            bookingState.step++;
            updateWizard();
        } else {
            // Finalizar e Enviar para WhatsApp
            enviarAgendamentoWhatsApp();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (bookingState.step > 1) {
            bookingState.step--;
            updateWizard();
        }
    });

    // Atualização Visual do Wizard
    function updateWizard() {
        // Exibir passo correto
        stepContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`step-${bookingState.step}`).classList.add('active');

        // Atualizar barra de progresso
        const progressPercent = ((bookingState.step - 1) / (bookingState.maxSteps - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Atualizar marcadores dos passos
        progressSteps.forEach((step, idx) => {
            const stepNum = idx + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum === bookingState.step) {
                step.classList.add('active');
            } else if (stepNum < bookingState.step) {
                step.classList.add('completed');
            }
        });

        // Configurar botões Voltar / Avançar
        btnPrev.disabled = bookingState.step === 1;

        if (bookingState.step === bookingState.maxSteps) {
            btnNext.innerHTML = '<span>Confirmar no WhatsApp</span><svg viewBox="0 0 24 24" width="20" height="20" style="margin-left: 5px;"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.47 16.86L2 22L7.3 20.61C8.74 21.39 10.37 21.8 12.04 21.8C17.5 21.8 21.95 17.35 21.95 11.9C21.95 9.26 20.92 6.78 19.05 4.91C17.18 3.04 14.7 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.4 19.66L5.23 16.61L5.05 16.32C4.24 15.03 3.8 13.5 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7 8.5 7 9.71C7 10.93 7.89 12.1 8.01 12.26C8.14 12.44 9.76 14.94 12.25 16C12.84 16.25 13.3 16.39 13.66 16.5C14.25 16.69 14.79 16.66 15.22 16.6C15.7 16.53 16.7 15.99 16.9 15.43C17.11 14.87 17.11 14.39 17.05 14.29C16.99 14.19 16.84 14.13 16.61 14.03L15.53 13.5C15.41 13.44 15.3 13.41 15.2 13.56L14.72 14.17C14.6 14.3 14.47 14.33 14.3 14.24C14 14.1 13.04 13.78 11.9 12.77C11 11.97 10.4 11 10.22 10.7C10.1 10.5 10.2 10.4 10.3 10.3L10.74 9.79C10.84 9.67 10.87 9.58 10.93 9.46C11 9.33 10.97 9.23 10.93 9.13L10.4 7.86C10.27 7.56 10.14 7.6 10 7.6C9.9 7.6 9.77 7.59 9.62 7.59C9.47 7.59 9.23 7.59 9 7.74C8.77 7.89 8.53 8.16 8.53 8.53Z"/></svg>';
            btnNext.style.backgroundColor = '#10B981';
            btnNext.style.borderColor = '#10B981';
            btnNext.style.color = '#fff';
        } else {
            btnNext.innerHTML = 'Avançar';
            btnNext.style.backgroundColor = '';
            btnNext.style.borderColor = '';
            btnNext.style.color = '';
        }

        // Validação da etapa para habilitar botão Avançar
        validarEtapa();
    }

    function validarEtapa() {
        let isValid = false;

        switch (bookingState.step) {
            case 1:
                isValid = bookingState.service !== '';
                break;
            case 2:
                isValid = bookingState.barber !== '';
                break;
            case 3:
                isValid = bookingState.date !== '' && bookingState.time !== '';
                break;
            case 4:
                bookingState.clientName = document.getElementById('client-name').value.trim();
                bookingState.clientPhone = document.getElementById('client-phone').value.trim();
                isValid = bookingState.clientName !== '' && bookingState.clientPhone.length >= 10;
                
                // Preencher Resumo
                summaryService.textContent = `${bookingState.service} (R$ ${bookingState.price})`;
                summaryBarber.textContent = bookingState.barber;
                summaryDate.textContent = bookingState.dateFormatted;
                summaryTime.textContent = `${bookingState.time} (${bookingState.duration} min)`;
                break;
        }

        btnNext.disabled = !isValid;
    }

    // Monitorar inputs da Etapa 4 para re-validar em tempo real
    document.getElementById('client-name').addEventListener('input', validarEtapa);
    document.getElementById('client-phone').addEventListener('input', (e) => {
        // Máscara de telefone simples (XX) XXXXX-XXXX
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.substring(0, 11);
        
        let formatted = val;
        if (val.length > 2) {
            formatted = `(${val.substring(0, 2)}) `;
            if (val.length > 7) {
                formatted += `${val.substring(2, 7)}-${val.substring(7)}`;
            } else {
                formatted += val.substring(2);
            }
        }
        
        e.target.value = formatted;
        validarEtapa();
    });


    // Configurar Passo 1: Serviços
    function setupServices() {
        const serviceCards = document.querySelectorAll('.service-option');
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                serviceCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                bookingState.service = card.getAttribute('data-service');
                bookingState.price = parseFloat(card.getAttribute('data-price')).toFixed(2);
                bookingState.duration = parseInt(card.getAttribute('data-duration'));
                
                validarEtapa();
                
                // Auto avanço com pequeno delay
                setTimeout(() => {
                    if(bookingState.step === 1) {
                        bookingState.step = 2;
                        updateWizard();
                    }
                }, 300);
            });
        });
    }

    // Configurar Passo 2: Barbeiros
    function setupBarbers() {
        const barberCards = document.querySelectorAll('.barber-option');
        barberCards.forEach(card => {
            card.addEventListener('click', () => {
                barberCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                bookingState.barber = card.getAttribute('data-barber');
                
                validarEtapa();

                // Auto avanço com pequeno delay
                setTimeout(() => {
                    if(bookingState.step === 2) {
                        bookingState.step = 3;
                        updateWizard();
                    }
                }, 300);
            });
        });
    }


    // Configurar Passo 3: Gerar Calendário e Horários
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    function gerarCalendario() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;
        
        calendarEl.innerHTML = '';
        
        let diasGerados = 0;
        let dataAtual = new Date();
        
        // Se a data atual for Domingo (0) ou Segunda (1), avança até terça (2)
        if (dataAtual.getDay() === 0) {
            dataAtual.setDate(dataAtual.getDate() + 2);
        } else if (dataAtual.getDay() === 1) {
            dataAtual.setDate(dataAtual.getDate() + 1);
        }
        
        while(diasGerados < 5) {
            const diaSemanaIndex = dataAtual.getDay();
            
            // Barbearia abre apenas de Terça (2) a Sábado (6)
            if (diaSemanaIndex >= 2 && diaSemanaIndex <= 6) {
                const diaNum = dataAtual.getDate();
                const diaSemanaTexto = diasSemana[diaSemanaIndex];
                const mesTexto = meses[dataAtual.getMonth()];
                
                // Formato ISO
                const ano = dataAtual.getFullYear();
                const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
                const diaStr = String(diaNum).padStart(2, '0');
                const dataIso = `${ano}-${mes}-${diaStr}`;
                
                const dataFormatada = `${diaSemanaTexto}, ${diaNum} de ${mesTexto}`;
                
                const diaHtml = `
                    <div class="calendar-day" data-date="${dataIso}" data-formatted="${dataFormatada}">
                        <span class="calendar-day__week">${diaSemanaTexto}</span>
                        <span class="calendar-day__number">${diaNum}</span>
                        <span class="calendar-day__month">${mesTexto}</span>
                    </div>
                `;
                calendarEl.insertAdjacentHTML('beforeend', diaHtml);
                diasGerados++;
            }
            
            // Avança para o próximo dia
            dataAtual.setDate(dataAtual.getDate() + 1);
        }

        setupCalendarEvents();
    }

    function setupCalendarEvents() {
        const days = document.querySelectorAll('.calendar-day');
        days.forEach(day => {
            day.addEventListener('click', () => {
                days.forEach(d => d.classList.remove('selected'));
                day.classList.add('selected');
                
                bookingState.date = day.getAttribute('data-date');
                bookingState.dateFormatted = day.getAttribute('data-formatted');
                bookingState.time = ''; // Resetar horário ao trocar o dia
                
                gerarHorarios(bookingState.date);
                validarEtapa();
            });
        });
    }

    function gerarHorarios(dataSelecionada) {
        const hoursSection = document.getElementById('hours-section');
        const hoursGrid = document.getElementById('hours-grid');
        
        hoursGrid.innerHTML = '';
        hoursSection.style.display = 'block';

        // Horários Padrão
        const listHorarios = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
            '19:00'
        ];

        // Simulador de horários ocupados de forma determinística baseada na data
        // Para parecer que há horários pré-agendados de verdade
        const seed = parseInt(dataSelecionada.replace(/-/g, ''));
        
        listHorarios.forEach((hora, idx) => {
            // Um gerador pseudo-aleatório simples usando a data
            const pseudoRandom = Math.sin(seed + idx) * 10000;
            const isOcupado = (pseudoRandom - Math.floor(pseudoRandom)) > 0.65; // ~35% dos horários ocupados

            if (!isOcupado) {
                const hourBtn = document.createElement('button');
                hourBtn.className = 'hour-option';
                hourBtn.textContent = hora;
                hourBtn.addEventListener('click', () => {
                    document.querySelectorAll('.hour-option').forEach(h => h.classList.remove('selected'));
                    hourBtn.classList.add('selected');
                    bookingState.time = hora;
                    validarEtapa();
                });
                hoursGrid.appendChild(hourBtn);
            }
        });

        if (hoursGrid.children.length === 0) {
            hoursGrid.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.9rem;">Nenhum horário disponível para este dia. Tente outra data!</p>';
        }
    }


    /* ==========================================================================
       INTEGRAÇÃO COM WHATSAPP
       ========================================================================== */
    function enviarAgendamentoWhatsApp() {
        const telefoneBarbearia = '5511999998888'; // Número de exemplo da barbearia
        
        // Formatação refinada da mensagem de texto
        const mensagem = `💈 *NOVO AGENDAMENTO - ROCHA 20* 💈\n\n` +
                         `Olá, gostaria de confirmar o seguinte agendamento:\n\n` +
                         `👤 *Cliente:* ${bookingState.clientName}\n` +
                         `📞 *WhatsApp:* ${bookingState.clientPhone}\n` +
                         `✂️ *Serviço:* ${bookingState.service} (R$ ${bookingState.price})\n` +
                         `💈 *Barbeiro:* ${bookingState.barber}\n` +
                         `📅 *Data:* ${bookingState.dateFormatted}\n` +
                         `⏱️ *Horário:* ${bookingState.time} (${bookingState.duration} min)\n\n` +
                         `Aguardo a confirmação da reserva! Obrigado.`;

        // Codificar texto para a URL
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // URL da API do WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${telefoneBarbearia}&text=${mensagemCodificada}`;

        // Redirecionar usuário em nova aba
        window.open(whatsappUrl, '_blank');
    }

    /* ==========================================================================
       UPGRADE: REVEAL ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Uma vez revelado, desobserva o elemento
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // Inicializar Scroll Reveal
    initScrollReveal();

    // Inicializar o wizard de agendamento ao carregar a página
    initBooking();
});
