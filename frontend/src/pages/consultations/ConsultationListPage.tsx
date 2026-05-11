import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultations } from './hooks/useConsultations';
import { useSchools } from '../schools/hooks/useSchools';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import type { ConsultationItem } from './api/consultationsApi';
import type { BadgeProps } from '../../components/ui/Badge';

const priorityVariant = (priority: string): BadgeProps['variant'] => {
  if (priority === 'Máxima') return 'danger';
  if (priority === 'Média') return 'warning';
  return 'neutral';
};

export const ConsultationListPage = () => {
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState<number | null>(null);

  const { data: schools = [] } = useSchools();
  const { data = [], isLoading } = useConsultations(schoolId ?? undefined);

  const schoolOptions = schools.map((s) => ({ label: s.name, value: s.id }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Consultas</h1>
          <p className="page-subtitle">Alunos com pontuação ≥ 5 encaminhados para consulta médica</p>
        </div>
        <div className="page-header__actions">
          <Select
            id="filter-school"
            label="Escola"
            value={schoolId}
            onChange={(v) => setSchoolId(v as number | null)}
            options={schoolOptions}
            placeholder="Todas as escolas"
          />
        </div>
      </div>

      <Table
        data={data}
        loading={isLoading}
        emptyMessage="Nenhum aluno encaminhado para consulta"
        columns={[
          { field: 'studentName', header: 'Aluno' },
          { field: 'school', header: 'Escola' },
          { field: 'classroom', header: 'Turma' },
          { field: 'birthday', header: 'Nascimento' },
          {
            field: 'points',
            header: 'Pontos',
            align: 'center',
            width: '100px',
            body: (r: ConsultationItem) => (
              <Badge label={String(r.points)} variant={r.points >= 10 ? 'danger' : 'warning'} />
            ),
          },
          {
            field: 'priority',
            header: 'Prioridade',
            width: '140px',
            body: (r: ConsultationItem) => (
              <Badge label={r.priority} variant={priorityVariant(r.priority)} />
            ),
          },
        ]}
        onRowClick={(row) => navigate(`/alunos/${(row as ConsultationItem).studentDataId}`)}
      />
    </div>
  );
};
