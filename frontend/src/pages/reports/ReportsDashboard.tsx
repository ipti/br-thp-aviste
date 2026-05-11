import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pdf } from '@react-pdf/renderer';
import { reportsApi, type SchoolReport } from './api/reportsApi';
import { useConsultations } from '../consultations/hooks/useConsultations';
import { useSchools } from '../schools/hooks/useSchools';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import type { DocumentProps } from '@react-pdf/renderer';
import { GeneralReportPDF } from './components/pdf/GeneralReportPDF';
import { ConsultationsReportPDF } from './components/pdf/ConsultationsReportPDF';
import type { ConsultationItem } from '../consultations/api/consultationsApi';
import type { BadgeProps } from '../../components/ui/Badge';
import './styles.scss';

const priorityVariant = (priority: string): BadgeProps['variant'] => {
  if (priority === 'Máxima') return 'danger';
  if (priority === 'Média') return 'warning';
  return 'neutral';
};

const nowLabel = () =>
  new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const downloadPdf = async (element: React.ReactElement<DocumentProps>, filename: string) => {
  const blob = await pdf(element).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const ReportsDashboard = () => {
  const [consultSchoolId, setConsultSchoolId] = useState<number | null>(null);
  const [exportingGeneral, setExportingGeneral] = useState(false);
  const [exportingConsult, setExportingConsult] = useState(false);

  const { data: generalData = [], isLoading: loadingGeneral } = useQuery({
    queryKey: ['reports', 'general'],
    queryFn: reportsApi.general,
  });
  const { data: consultData = [], isLoading: loadingConsult } = useConsultations(consultSchoolId ?? undefined);
  const { data: schools = [] } = useSchools();

  const schoolOptions = schools.map((s) => ({ label: s.name, value: s.id }));

  const totals = generalData.reduce(
    (acc, r) => ({
      countRegister: acc.countRegister + r.countRegister,
      countRegisterTriados: acc.countRegisterTriados + r.countRegisterTriados,
      countForwardedConsultation: acc.countForwardedConsultation + r.countForwardedConsultation,
      countConsultationCompleted: acc.countConsultationCompleted + r.countConsultationCompleted,
      countEntregaOculosCompleted: acc.countEntregaOculosCompleted + r.countEntregaOculosCompleted,
    }),
    { countRegister: 0, countRegisterTriados: 0, countForwardedConsultation: 0, countConsultationCompleted: 0, countEntregaOculosCompleted: 0 },
  );

  const handleExportGeneral = async () => {
    setExportingGeneral(true);
    try {
      await downloadPdf(
        <GeneralReportPDF data={generalData} generatedAt={nowLabel()} />,
        `relatorio-geral-${Date.now()}.pdf`,
      );
    } finally {
      setExportingGeneral(false);
    }
  };

  const handleExportConsult = async () => {
    setExportingConsult(true);
    try {
      await downloadPdf(
        <ConsultationsReportPDF data={consultData} generatedAt={nowLabel()} />,
        `relatorio-consultas-${Date.now()}.pdf`,
      );
    } finally {
      setExportingConsult(false);
    }
  };

  return (
    <div className="reports-page">
      <h1 className="page-title">Relatórios</h1>

      {/* KPIs */}
      <div className="reports-page__kpis">
        {[
          { label: 'Matriculados',    value: totals.countRegister },
          { label: 'Triados',         value: totals.countRegisterTriados },
          { label: 'Encaminhados',    value: totals.countForwardedConsultation },
          { label: 'Consultados',     value: totals.countConsultationCompleted },
          { label: 'Óculos entregues',value: totals.countEntregaOculosCompleted },
        ].map((kpi) => (
          <div key={kpi.label} className="reports-page__kpi-card">
            <p className="reports-page__kpi-value">{kpi.value}</p>
            <p className="reports-page__kpi-label">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Relatório Geral */}
      <div className="reports-page__section">
        <div className="reports-page__section-header">
          <div>
            <h2 className="reports-page__section-title">Resumo por escola</h2>
            <p className="reports-page__section-sub">Visão geral de cada escola no programa</p>
          </div>
          <Button
            label="Exportar PDF"
            icon="pi pi-file-pdf"
            variant="secondary"
            size="sm"
            loading={exportingGeneral}
            disabled={generalData.length === 0}
            onClick={handleExportGeneral}
          />
        </div>

        <Table
          data={generalData}
          loading={loadingGeneral}
          columns={[
            { field: 'school',                     header: 'Escola' },
            { field: 'countClassroom',             header: 'Turmas',        align: 'center' },
            { field: 'countRegister',              header: 'Alunos',        align: 'center' },
            { field: 'countQuestianarioPais',      header: 'Questionários', align: 'center' },
            { field: 'countRegisterTriados',       header: 'Triados',       align: 'center' },
            { field: 'countForwardedConsultation', header: 'Encaminhados',  align: 'center' },
            { field: 'countConsultationCompleted', header: 'Consultados',   align: 'center' },
            { field: 'countReceitaOculosCompleted',header: 'Receitas',      align: 'center' },
            { field: 'countEntregaOculosCompleted',header: 'Óculos',        align: 'center' },
          ] as Array<{ field: keyof SchoolReport; header: string; align?: 'center' }>}
        />
      </div>

      {/* Relatório de Consultas */}
      <div className="reports-page__section">
        <div className="reports-page__section-header">
          <div>
            <h2 className="reports-page__section-title">Alunos encaminhados para consulta</h2>
            <p className="reports-page__section-sub">Pontuação ≥ 5 — ordenados por prioridade</p>
          </div>
          <div className="reports-page__section-actions">
            <Select
              id="consult-school-filter"
              label="Escola"
              value={consultSchoolId}
              onChange={(v) => setConsultSchoolId(v as number | null)}
              options={schoolOptions}
              placeholder="Todas as escolas"
            />
            <Button
              label="Exportar PDF"
              icon="pi pi-file-pdf"
              variant="secondary"
              size="sm"
              loading={exportingConsult}
              disabled={consultData.length === 0}
              onClick={handleExportConsult}
            />
          </div>
        </div>

        <Table
          data={consultData.map((r, i) => ({ ...r, _num: i + 1 }))}
          loading={loadingConsult}
          emptyMessage="Nenhum aluno encaminhado para consulta"
          columns={[
            { field: '_num',        header: 'Nº',          align: 'center', width: '56px' },
            { field: 'school',      header: 'Escola' },
            { field: 'classroom',   header: 'Turma',       width: '80px' },
            { field: 'studentName', header: 'Aluno' },
            { field: 'birthday',    header: 'Nascimento',  width: '120px' },
            {
              field: 'priority',
              header: 'Prioridade',
              width: '130px',
              body: (r: ConsultationItem & { _num: number }) => (
                <Badge label={r.priority} variant={priorityVariant(r.priority)} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
