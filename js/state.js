export const state = {
    currentUser: null,
    users: [
        { id: 'admin1', role: 'admin', email: 'vegendigital@gmail.com', name: 'Super Admin', img: 'https://i.pravatar.cc/150?u=admin' },
        { id: 'athlete1', role: 'athlete', email: 'atleta@test.com', name: 'Martín Pérez', roleDesc: 'Deportista Elite', img: 'https://i.pravatar.cc/150?u=athlete' },
        { id: 'athlete2', role: 'athlete', email: 'atleta2@test.com', name: 'Julia V.', roleDesc: 'Deportista Amateur', img: 'https://i.pravatar.cc/150?u=athlete2' },
        { id: 'coach1', role: 'coach', email: 'coach1@test.com', name: 'Profe Sebastián', roleDesc: 'Head Coach', img: 'https://i.pravatar.cc/150?u=coach' },
        { id: 'coach2', role: 'coach', email: 'coach2@test.com', name: 'Prof. Carlos', roleDesc: 'Coach Poli 10', img: 'https://i.pravatar.cc/150?u=coach2' }
    ],
    sports: [
        { id: 'running', name: 'Running', icon: 'fa-running' },
        { id: 'padel', name: 'Padel', icon: 'fa-table-tennis' },
        { id: 'tennis', name: 'Tenis', icon: 'fa-baseball-ball' },
        { id: 'cycling', name: 'Ciclismo', icon: 'fa-biking' },
        { id: 'rowing', name: 'Remo', icon: 'fa-water' }
    ],
    // Vínculos entrenador <-> atleta
    connections: [
        { coachId: 'coach1', athleteId: 'athlete1' },
        { coachId: 'coach1', athleteId: 'athlete2' },
        { coachId: 'coach2', athleteId: 'athlete1' }
    ],
    activities: [
        // Ej: Actividad asignada por un profe (pending o completed)
        {
            id: 'act1',
            athleteId: 'athlete1',
            coachId: 'coach1',
            status: 'pending',
            sport: 'running',
            title: 'Pasadas Potencia 800m',
            type: 'Pasadas',
            bloques: 3,
            vueltas: 4,
            dist: 800,
            pace: '2:10',
            zone: 'Z4',
            place: 'Pista Central',
            dateAssigned: new Date().toISOString()
        },
        // Ej: Actividad autogenerada o completada
        {
            id: 'act2',
            athleteId: 'athlete1',
            coachId: null, // autogenerada
            status: 'completed',
            sport: 'running',
            title: 'Trote Regenerativo',
            distance: 10, // en km
            time: '00:50:00',
            rpe: 4,
            dateCompleted: new Date().toISOString(),
            dateAssigned: new Date().toISOString()
        }
    ]
};

// Generar datos mock extra (para el leaderboard o pruebas)
export function generateMockData() {
    const names = ["Ricardo G.", "Ana Ponce", "Luis Sosa", "Marta M.", "Santi Q.", "Elena F.", "Marcos T.", "Beto D.", "Carla X.", "Diego R.", "Fede H.", "Gaby L.", "Hugo M.", "Iara S.", "Juan K.", "Lola P.", "Mati N.", "Nico W.", "Pau B."];

    names.forEach((name, i) => {
        const id = `athlete_mock_${i}`;
        state.users.push({
            id: id,
            role: 'athlete',
            email: `mock${i}@test.com`,
            name: name,
            roleDesc: 'Atleta del grupo',
            img: `https://i.pravatar.cc/150?u=${id}`
        });

        // Vincular a los profes
        if (i % 2 === 0) {
            state.connections.push({ coachId: 'coach1', athleteId: id });
        } else {
            state.connections.push({ coachId: 'coach2', athleteId: id });
        }

        // Historial aleatorio (completado)
        for(let j=0; j<5; j++) {
            state.activities.push({
                id: `act_mock_${i}_${j}`,
                athleteId: id,
                coachId: null,
                status: 'completed',
                sport: 'running',
                title: 'Fondo',
                distance: parseFloat((Math.random()*10 + 5).toFixed(1)),
                time: '00:45:00', // simplificado
                rpe: 6,
                dateCompleted: new Date(Date.now() - Math.random() * 10000000000).toISOString()
            });
        }
    });
}
