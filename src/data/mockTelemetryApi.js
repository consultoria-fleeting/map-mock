import { BRAZIL_STATES } from './brazilStates';

// Corredores reais de ruas conhecidas para gerar posições autênticas sobre vias públicas
const KNOWN_STREET_CORRIDORS = {
  SP: [
    { street: 'Av. Paulista', baseLat: -23.5614, baseLng: -46.6560, deltaLat: 0.008, deltaLng: 0.015, neighborhood: 'Bela Vista / Cerqueira César' },
    { street: 'Av. Brigadeiro Faria Lima', baseLat: -23.5874, baseLng: -46.6821, deltaLat: 0.012, deltaLng: 0.010, neighborhood: 'Itaim Bibi / Pinheiros' },
    { street: 'Marginal Pinheiros (Av. Nações Unidas)', baseLat: -23.6020, baseLng: -46.6980, deltaLat: 0.030, deltaLng: 0.015, neighborhood: 'Morumbi / Santo Amaro' },
    { street: 'Marginal Tietê (Av. Otaviano Alves de Lima)', baseLat: -23.5130, baseLng: -46.6430, deltaLat: 0.015, deltaLng: 0.040, neighborhood: 'Barra Funda / Vila Maria' },
    { street: 'Av. 23 de Maio', baseLat: -23.5750, baseLng: -46.6420, deltaLat: 0.020, deltaLng: 0.006, neighborhood: 'Paraíso / Vila Mariana' },
    { street: 'Rodovia dos Bandeirantes, km 18', baseLat: -23.4680, baseLng: -46.7550, deltaLat: 0.025, deltaLng: 0.020, neighborhood: 'Pirituba / Jaraguá' },
    { street: 'Av. Engenheiro Luís Carlos Berrini', baseLat: -23.6080, baseLng: -46.6960, deltaLat: 0.009, deltaLng: 0.005, neighborhood: 'Brooklin' },
    { street: 'Rodovia Anchieta, km 12', baseLat: -23.6210, baseLng: -46.5980, deltaLat: 0.018, deltaLng: 0.012, neighborhood: 'Sacomã / Ipiranga' },
    { street: 'Av. Rebouças', baseLat: -23.5680, baseLng: -46.6780, deltaLat: 0.010, deltaLng: 0.008, neighborhood: 'Pinheiros / Jardins' },
    { street: 'Av. Cruzeiro do Sul', baseLat: -23.5180, baseLng: -46.6260, deltaLat: 0.014, deltaLng: 0.005, neighborhood: 'Santana' }
  ],
  RJ: [
    { street: 'Av. Rio Branco', baseLat: -22.9035, baseLng: -43.1780, deltaLat: 0.008, deltaLng: 0.004, neighborhood: 'Centro' },
    { street: 'Av. Brasil, Trecho Bonsucesso', baseLat: -22.8680, baseLng: -43.2540, deltaLat: 0.025, deltaLng: 0.035, neighborhood: 'Bonsucesso' },
    { street: 'Av. das Américas', baseLat: -22.9980, baseLng: -43.3650, deltaLat: 0.015, deltaLng: 0.040, neighborhood: 'Barra da Tijuca' },
    { street: 'Av. Atlântica', baseLat: -22.9710, baseLng: -43.1820, deltaLat: 0.012, deltaLng: 0.009, neighborhood: 'Copacabana' },
    { street: 'Linha Amarela (Av. Gov. Carlos Lacerda)', baseLat: -22.9150, baseLng: -43.3100, deltaLat: 0.020, deltaLng: 0.030, neighborhood: 'Jacarepaguá' }
  ],
  MG: [
    { street: 'Av. Afonso Pena', baseLat: -19.9240, baseLng: -43.9350, deltaLat: 0.012, deltaLng: 0.010, neighborhood: 'Centro / Funcionários' },
    { street: 'Av. do Contorno', baseLat: -19.9320, baseLng: -43.9280, deltaLat: 0.020, deltaLng: 0.020, neighborhood: 'Savassi / Floresta' },
    { street: 'Av. Amazonas', baseLat: -19.9390, baseLng: -43.9680, deltaLat: 0.018, deltaLng: 0.025, neighborhood: 'Prado / Nova Suíça' },
    { street: 'Anel Rodoviário Celso Mello Azevedo', baseLat: -19.9050, baseLng: -43.9850, deltaLat: 0.030, deltaLng: 0.040, neighborhood: 'Engenho Nogueira' }
  ],
  PR: [
    { street: 'Av. Sete de Setembro', baseLat: -25.4380, baseLng: -49.2720, deltaLat: 0.010, deltaLng: 0.015, neighborhood: 'Batel / Rebouças' },
    { street: 'Linha Verde (BR-476)', baseLat: -25.4650, baseLng: -49.2550, deltaLat: 0.025, deltaLng: 0.020, neighborhood: 'Pinheirinho / Prado Velho' },
    { street: 'Av. Marechal Floriano Peixoto', baseLat: -25.4520, baseLng: -49.2620, deltaLat: 0.015, deltaLng: 0.010, neighborhood: 'Hauer / Boqueirão' }
  ],
  RS: [
    { street: 'Av. Ipiranga', baseLat: -30.0520, baseLng: -51.1850, deltaLat: 0.012, deltaLng: 0.030, neighborhood: 'Azenha / Santana' },
    { street: 'Av. Carlos Gomes (3ª Perimetral)', baseLat: -30.0310, baseLng: -51.1820, deltaLat: 0.018, deltaLng: 0.008, neighborhood: 'Petrópolis / Três Figueiras' },
    { street: 'Av. Mauá / Cais', baseLat: -30.0270, baseLng: -51.2280, deltaLat: 0.008, deltaLng: 0.012, neighborhood: 'Centro Histórico' }
  ],
  DF: [
    { street: 'Eixo Monumental Oeste', baseLat: -15.7920, baseLng: -47.9150, deltaLat: 0.005, deltaLng: 0.025, neighborhood: 'Zona Cívico-Administrativa' },
    { street: 'Eixão Sul (DF-002)', baseLat: -15.8250, baseLng: -47.9250, deltaLat: 0.025, deltaLng: 0.008, neighborhood: 'Asa Sul' },
    { street: 'W3 Norte', baseLat: -15.7650, baseLng: -47.8920, deltaLat: 0.020, deltaLng: 0.006, neighborhood: 'Asa Norte' }
  ],
  BA: [
    { street: 'Av. Paralela (Av. Luís Viana Filho)', baseLat: -12.9420, baseLng: -38.4120, deltaLat: 0.025, deltaLng: 0.030, neighborhood: 'Imbuí / Pituaçu' },
    { street: 'Av. Tancredo Neves', baseLat: -12.9820, baseLng: -38.4550, deltaLat: 0.008, deltaLng: 0.010, neighborhood: 'Caminho das Árvores' }
  ]
};

const VEHICLE_MODELS = [
  { model: 'Volvo FH 540 6x4T', category: 'truck', icon: 'truck', fuelType: 'Diesel S10' },
  { model: 'Scania R 450 Plus', category: 'truck', icon: 'truck', fuelType: 'Diesel S10' },
  { model: 'Mercedes-Benz Actros 2651', category: 'truck', icon: 'truck', fuelType: 'Diesel S10' },
  { model: 'Volkswagen Delivery 11.180', category: 'truck', icon: 'truck', fuelType: 'Diesel S10' },
  { model: 'Mercedes-Benz Sprinter 415 CDI', category: 'van', icon: 'van', fuelType: 'Diesel S10' },
  { model: 'Renault Master 2.3 dCi', category: 'van', icon: 'van', fuelType: 'Diesel S10' },
  { model: 'Fiat Fiorino 1.4 EVO', category: 'van', icon: 'van', fuelType: 'Flex' },
  { model: 'Toyota Hilux CD 2.8 4x4', category: 'car', icon: 'car', fuelType: 'Diesel' },
  { model: 'Chevrolet S10 LTZ 2.8', category: 'car', icon: 'car', fuelType: 'Diesel' },
  { model: 'Fiat Strada Freedom 1.3', category: 'car', icon: 'car', fuelType: 'Flex' },
  { model: 'Volkswagen Gol 1.0 MPI', category: 'car', icon: 'car', fuelType: 'Flex' },
  { model: 'Honda CG 160 Cargo', category: 'motorcycle', icon: 'motorcycle', fuelType: 'Gasolina' }
];

const DRIVERS = [
  'Carlos Eduardo Silva', 'Rodrigo Mendes de Souza', 'Antônio Marcos Ferreira',
  'Juliana Ramos Vieira', 'Lucas Pinheiro Santos', 'Gabriel Castro de Oliveira',
  'Marcelo Guimarães Neto', 'Fernanda Lima Alencar', 'Paulo Roberto Farias',
  'Thiago Siqueira Rocha', 'Rafael Azevedo Neves', 'Alexandre Costa Dias',
  'Bruno Henrique Nogueira', 'Leonardo Vasconcelos', 'Mateus Silveira Bueno'
];

const STATUS_TYPES = [
  { status: 'in_transit', label: 'Em Rota / Trânsito', color: '#10b981', weight: 45 },
  { status: 'parked', label: 'Estacionado / Cliente', color: '#3b82f6', weight: 30 },
  { status: 'depot', label: 'No Pátio / Garagem', color: '#8b5cf6', weight: 18 },
  { status: 'maintenance', label: 'Em Manutenção', color: '#f59e0b', weight: 7 }
];

// Gerador determinístico de placa mercosul
function generatePlate(seed) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l1 = letters[(seed * 7) % 26];
  const l2 = letters[(seed * 11) % 26];
  const l3 = letters[(seed * 13) % 26];
  const n1 = (seed * 3) % 10;
  const l4 = letters[(seed * 17) % 26];
  const n2 = (seed * 5) % 10;
  const n3 = (seed * 9) % 10;
  return `${l1}${l2}${l3}${n1}${l4}${n2}${n3}`;
}

// Gera veículos com posições georreferenciadas autênticas para cada estado
export function generateVehiclesForState(stateObj, sampleSize = null) {
  const count = sampleSize || Math.min(stateObj.vehicleCount, 250); // amostra rica para visualização fluida
  const corridors = KNOWN_STREET_CORRIDORS[stateObj.uf] || [];
  const vehicles = [];

  for (let i = 0; i < count; i++) {
    const seed = (stateObj.uf.charCodeAt(0) * 1000 + i * 37) % 10000;
    const modelObj = VEHICLE_MODELS[i % VEHICLE_MODELS.length];
    const driver = DRIVERS[(i + seed) % DRIVERS.length];
    
    // Status baseado em peso
    const randStatus = (seed % 100);
    let status = 'in_transit';
    if (randStatus > 85) status = 'maintenance';
    else if (randStatus > 65) status = 'depot';
    else if (randStatus > 40) status = 'parked';

    // Determina LAT e LONG
    let lat, lng, streetName, neighborhood;
    
    if (corridors.length > 0 && (i % 5 !== 0)) {
      // 80% dos veículos em vias mapeadas de capitais/regiões metropolitanas
      const corridor = corridors[i % corridors.length];
      const offsetLat = ((seed % 100) / 100 - 0.5) * corridor.deltaLat;
      const offsetLng = (((seed * 7) % 100) / 100 - 0.5) * corridor.deltaLng;
      lat = Number((corridor.baseLat + offsetLat).toFixed(6));
      lng = Number((corridor.baseLng + offsetLng).toFixed(6));
      streetName = `${corridor.street}, nº ${100 + (seed % 2800)}`;
      neighborhood = corridor.neighborhood;
    } else {
      // Demais veículos distribuídos no estado / rodovias estaduais
      const offsetLat = ((seed % 1000) / 1000 - 0.5) * 1.5;
      const offsetLng = (((seed * 3) % 1000) / 1000 - 0.5) * 1.8;
      lat = Number((stateObj.lat + offsetLat).toFixed(6));
      lng = Number((stateObj.lng + offsetLng).toFixed(6));
      streetName = `Rodovia BR-${100 + (seed % 300)}, km ${(seed % 250)}`;
      neighborhood = `Região de ${stateObj.capital}`;
    }

    const speed = status === 'in_transit' ? Math.floor(35 + (seed % 55)) : 0;
    const heading = (seed * 43) % 360;
    const fuel = Math.max(15, 100 - (seed % 80));
    const odometer = 45000 + (seed * 85);

    vehicles.push({
      id: `VEH-${stateObj.uf}-${(i + 1).toString().padStart(4, '0')}`,
      plate: generatePlate(seed + i),
      model: modelObj.model,
      category: modelObj.category,
      fuelType: modelObj.fuelType,
      driver,
      driverPhone: `(11) 98${(seed % 90).toString().padStart(2, '0')}-${((seed * 3) % 9000).toString().padStart(4, '0')}`,
      status,
      speed,
      heading,
      odometer,
      fuelLevel: fuel,
      batteryLevel: Math.max(88, 100 - (seed % 12)),
      temperatureCargo: modelObj.category === 'truck' ? `${(-2 + (seed % 8)).toFixed(1)} °C` : null,
      state: stateObj.uf,
      lat,
      lng,
      address: `${streetName} - ${neighborhood}, ${stateObj.capital} - ${stateObj.uf}`,
      lastTransmission: 'Hoje, 06:45 (Carga diária de telemetria)',
      dailySyncDate: new Date().toLocaleDateString('pt-BR'),
      ignitionOn: status === 'in_transit' || status === 'parked'
    });
  }

  return vehicles;
}

// Cache em memória para não regenerar posições diferentes durante navegação
const vehiclesCacheByState = {};

// Inicializa o cache dos estados com amostras
BRAZIL_STATES.forEach(st => {
  vehiclesCacheByState[st.uf] = generateVehiclesForState(st);
});

/**
 * Simula a chamada GET do backend que envia os veículos de um estado ou área
 */
export async function fetchVehiclesByState(uf) {
  // Simula latência de rede realista (250ms)
  await new Promise(resolve => setTimeout(resolve, 220));
  return vehiclesCacheByState[uf] || [];
}

/**
 * Retorna os veículos de múltiplos estados visíveis no viewport
 */
export async function fetchVehiclesByMultipleStates(ufs) {
  await new Promise(resolve => setTimeout(resolve, 100));
  let result = [];
  const list = Array.isArray(ufs) ? ufs : [ufs];
  list.forEach(uf => {
    if (vehiclesCacheByState[uf]) {
      result = result.concat(vehiclesCacheByState[uf]);
    }
  });
  return result;
}

/**
 * Retorna todos os veículos ativos em cache para visualização e busca global
 */
export async function fetchAllActiveVehicles() {
  await new Promise(resolve => setTimeout(resolve, 180));
  let all = [];
  Object.keys(vehiclesCacheByState).forEach(uf => {
    all = all.concat(vehiclesCacheByState[uf]);
  });
  return all;
}

/**
 * Simula a chegada do novo GET diário de telemetria
 */
export function simulateNewDailySnapshot() {
  BRAZIL_STATES.forEach(st => {
    vehiclesCacheByState[st.uf] = generateVehiclesForState(st);
  });
  return {
    syncTimestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    totalVehicles: Object.values(vehiclesCacheByState).flat().length
  };
}
