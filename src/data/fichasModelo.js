/**
 * Modelos de ficha usados quando uma conta nova é criada.
 * Uma delas é sorteada para o aluno, com cargas iniciais conservadoras.
 * (cargaKg: null = sem carga, exercício de peso corporal)
 */
module.exports = [
  {
    titulo: 'Peito e Tríceps',
    observacoes: 'Descanse de 60 a 90 segundos entre as séries. Faça 5 minutos de aquecimento antes de começar.',
    exercicios: [
      { nome: 'Supino Reto com Barra', series: 3, repeticoes: 10, cargaKg: 30 },
      { nome: 'Supino Inclinado com Halteres', series: 3, repeticoes: 12, cargaKg: 10 },
      { nome: 'Crucifixo na Máquina', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Tríceps Pulley', series: 3, repeticoes: 12, cargaKg: 15 },
      { nome: 'Tríceps Testa', series: 3, repeticoes: 10, cargaKg: 10 }
    ]
  },
  {
    titulo: 'Costas e Bíceps',
    observacoes: 'Mantenha a postura e evite balançar o tronco nas roscas.',
    exercicios: [
      { nome: 'Puxada Frontal', series: 3, repeticoes: 10, cargaKg: 35 },
      { nome: 'Remada Baixa', series: 3, repeticoes: 12, cargaKg: 30 },
      { nome: 'Remada Unilateral com Halter', series: 3, repeticoes: 10, cargaKg: 12 },
      { nome: 'Rosca Direta', series: 3, repeticoes: 12, cargaKg: 15 },
      { nome: 'Rosca Martelo', series: 3, repeticoes: 12, cargaKg: 8 }
    ]
  },
  {
    titulo: 'Pernas e Glúteos',
    observacoes: 'Se sentir desconforto no joelho, reduza a carga e avise o professor.',
    exercicios: [
      { nome: 'Agachamento Livre', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Leg Press 45°', series: 4, repeticoes: 12, cargaKg: 80 },
      { nome: 'Cadeira Extensora', series: 3, repeticoes: 15, cargaKg: 30 },
      { nome: 'Mesa Flexora', series: 3, repeticoes: 12, cargaKg: 25 },
      { nome: 'Elevação Pélvica', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Panturrilha em Pé', series: 3, repeticoes: 15, cargaKg: 30 }
    ]
  },
  {
    titulo: 'Ombros e Abdômen',
    observacoes: 'Controle a descida em todos os exercícios de ombro. Na prancha, segure de 30 a 45 segundos.',
    exercicios: [
      { nome: 'Desenvolvimento com Halteres', series: 3, repeticoes: 10, cargaKg: 10 },
      { nome: 'Elevação Lateral', series: 3, repeticoes: 15, cargaKg: 5 },
      { nome: 'Elevação Frontal', series: 3, repeticoes: 12, cargaKg: 5 },
      { nome: 'Abdominal Supra', series: 3, repeticoes: 20, cargaKg: null },
      { nome: 'Prancha Abdominal', series: 3, repeticoes: 1, cargaKg: null }
    ]
  },
  {
    titulo: 'Full Body',
    observacoes: 'Treino de corpo inteiro para a adaptação inicial. Foque na execução correta antes de aumentar a carga.',
    exercicios: [
      { nome: 'Agachamento no Smith', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Supino na Máquina', series: 3, repeticoes: 12, cargaKg: 25 },
      { nome: 'Puxada Frontal', series: 3, repeticoes: 12, cargaKg: 30 },
      { nome: 'Desenvolvimento na Máquina', series: 3, repeticoes: 12, cargaKg: 15 },
      { nome: 'Rosca Alternada', series: 2, repeticoes: 12, cargaKg: 6 },
      { nome: 'Prancha Abdominal', series: 3, repeticoes: 1, cargaKg: null }
    ]
  },
  {
    titulo: 'Funcional e Core',
    observacoes: 'Faça os exercícios em circuito, com 30 segundos de descanso entre eles.',
    exercicios: [
      { nome: 'Agachamento com Salto', series: 3, repeticoes: 12, cargaKg: null },
      { nome: 'Flexão de Braço', series: 3, repeticoes: 10, cargaKg: null },
      { nome: 'Afundo Alternado', series: 3, repeticoes: 12, cargaKg: 6 },
      { nome: 'Kettlebell Swing', series: 3, repeticoes: 15, cargaKg: 8 },
      { nome: 'Abdominal Infra', series: 3, repeticoes: 15, cargaKg: null }
    ]
  }
];
