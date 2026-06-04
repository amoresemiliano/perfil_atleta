const app = {
    state: {
        currentView: 'view-login',
        athleteData: {
            racha: 12,
            totalKm: 1250,
            bestPace: "4:15"
        },
        bgImages: [
            'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=1000',
            'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000',
            'https://images.unsplash.com/photo-1461896642303-90d6573baf9b?q=80&w=1000'
        ]
    },

    init() {
        console.log("Runner Pro Initialized");
        this.changeLoginImage();
        // Evitar scroll elástico en iOS
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('.view')) return;
            e.preventDefault();
        }, { passive: false });
    },

    navigateTo(viewId) {
        // Ocultar vistas con transicion
        document.querySelectorAll('.view').forEach(v => {
            v.classList.remove('active');
        });

        // Mostrar nueva vista
        const target = document.getElementById(viewId);
        if (target) {
            target.classList.add('active');
            window.scrollTo(0, 0);
        }

        // Control del Bottom Nav
        const nav = document.getElementById('bottom-nav');
        const isAppArea = viewId.startsWith('view-athlete') || viewId === 'view-profile' || viewId === 'view-metrics' || viewId === 'view-community';
        
        if (isAppArea) {
            nav.classList.remove('hidden');
            nav.classList.add('flex');
        } else {
            nav.classList.add('hidden');
            nav.classList.remove('flex');
        }

        // Actualizar iconos nav
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `nav-${viewId}`) btn.classList.add('active');
        });

        if(viewId === 'view-login') this.changeLoginImage();
    },

    changeLoginImage() {
        const loginSection = document.getElementById('view-login');
        const randomImg = this.state.bgImages[Math.floor(Math.random() * this.state.bgImages.length)];
        loginSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${randomImg}')`;
    }
};

window.onload = () => app.init();