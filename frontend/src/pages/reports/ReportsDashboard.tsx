import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { pdf } from '@react-pdf/renderer';
import { reportsApi, type SchoolReport, type ReportFilter } from './api/reportsApi';
import { useConsultations } from '../consultations/hooks/useConsultations';
import { useSchools } from '../schools/hooks/useSchools';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { MultiSelect } from 'primereact/multiselect';
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

  // Date filter state
  const [startDate,    setStartDate]    = useState('');
  const [endDate,      setEndDate]      = useState('');
  const [triagemStart, setTriagemStart] = useState('');
  const [triagemEnd,   setTriagemEnd]   = useState('');
  const [consultaStart,setConsultaStart]= useState('');
  const [consultaEnd,  setConsultaEnd]  = useState('');
  const [entregaStart, setEntregaStart] = useState('');
  const [entregaEnd,   setEntregaEnd]   = useState('');
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<number[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<ReportFilter | undefined>(undefined);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const anyFilter = startDate || triagemStart || consultaStart || entregaStart || selectedSchoolIds.length > 0;

  const handleApplyFilter = () => {
    const f: ReportFilter = {};
    if (startDate && endDate)        { f.startDate = startDate; f.endDate = endDate; }
    if (triagemStart && triagemEnd)  { f.triagemStart = triagemStart; f.triagemEnd = triagemEnd; }
    if (consultaStart && consultaEnd){ f.consultaStart = consultaStart; f.consultaEnd = consultaEnd; }
    if (entregaStart && entregaEnd)  { f.entregaStart = entregaStart; f.entregaEnd = entregaEnd; }
    if (selectedSchoolIds.length)    { f.schoolIds = selectedSchoolIds; }
    setAppliedFilter(Object.keys(f).length ? f : undefined);
    setShowFilterModal(false);
  };

  const handleClearFilter = () => {
    setStartDate(''); setEndDate('');
    setTriagemStart(''); setTriagemEnd('');
    setConsultaStart(''); setConsultaEnd('');
    setEntregaStart(''); setEntregaEnd('');
    setSelectedSchoolIds([]);
    setAppliedFilter(undefined);
    setShowFilterModal(false);
  };


  const { data: generalData = [], isLoading: loadingGeneral } = useQuery({
    queryKey: ['reports', 'general', appliedFilter],
    queryFn: () => reportsApi.general(appliedFilter),
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

      {/* Botão de filtro */}
      <div className="reports-page__filter-trigger">
        <Button
          label="Filtrar"
          icon={appliedFilter ? 'pi pi-filter-fill' : 'pi pi-filter'}
          variant={appliedFilter ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowFilterModal(true)}
        />
        {appliedFilter && (
          <>
            {appliedFilter.startDate && (
              <span className="reports-page__filter-chip">
                Cadastro: {appliedFilter.startDate.split('-').reverse().join('/')} – {appliedFilter.endDate!.split('-').reverse().join('/')}
              </span>
            )}
            {appliedFilter.triagemStart && (
              <span className="reports-page__filter-chip">
                Triagem: {appliedFilter.triagemStart.split('-').reverse().join('/')} – {appliedFilter.triagemEnd!.split('-').reverse().join('/')}
              </span>
            )}
            {appliedFilter.consultaStart && (
              <span className="reports-page__filter-chip">
                Consulta: {appliedFilter.consultaStart.split('-').reverse().join('/')} – {appliedFilter.consultaEnd!.split('-').reverse().join('/')}
              </span>
            )}
            {appliedFilter.entregaStart && (
              <span className="reports-page__filter-chip">
                Entrega: {appliedFilter.entregaStart.split('-').reverse().join('/')} – {appliedFilter.entregaEnd!.split('-').reverse().join('/')}
              </span>
            )}
            {appliedFilter.schoolIds?.map((id) => (
              <span key={id} className="reports-page__filter-chip">
                {schools.find((s) => s.id === id)?.name ?? `Escola ${id}`}
              </span>
            ))}
            <button className="reports-page__filter-clear" onClick={handleClearFilter} title="Remover todos os filtros">
              <i className="pi pi-times" />
            </button>
          </>
        )}
      </div>

      {/* Modal de filtro */}
      <Modal
        visible={showFilterModal}
        onHide={() => setShowFilterModal(false)}
        title="Filtrar por período"
        width="560px"
        footer={
          <div className="reports-page__modal-footer">
            <Button label="Limpar" icon="pi pi-times" size="sm" variant="secondary" onClick={handleClearFilter} />
            <Button label="Aplicar" icon="pi pi-check" size="sm" disabled={!anyFilter} onClick={handleApplyFilter} />
          </div>
        }
      >
        <div className="reports-page__filter-grid">
          <div className="reports-page__filter-grid-header">
            <span />
            <span>Início</span>
            <span>Fim</span>
          </div>
          {([
            { label: 'Cadastro do aluno',  start: startDate,    end: endDate,      setStart: setStartDate,    setEnd: setEndDate },
            { label: 'Triagem visual',     start: triagemStart, end: triagemEnd,   setStart: setTriagemStart, setEnd: setTriagemEnd },
            { label: 'Consulta médica',    start: consultaStart,end: consultaEnd,  setStart: setConsultaStart,setEnd: setConsultaEnd },
            { label: 'Entrega de óculos',  start: entregaStart, end: entregaEnd,   setStart: setEntregaStart, setEnd: setEntregaEnd },
          ] as const).map((row) => (
            <div key={row.label} className="reports-page__filter-grid-row">
              <span className="reports-page__filter-row-label">{row.label}</span>
              <input type="date" className="reports-page__date-input"
                value={row.start} onChange={(e) => row.setStart(e.target.value)} />
              <input type="date" className="reports-page__date-input"
                value={row.end} min={row.start} onChange={(e) => row.setEnd(e.target.value)} />
            </div>
          ))}
        </div>

        {schools.length > 0 && (
          <div className="reports-page__filter-schools">
            <FormField label="Escolas">
              <MultiSelect
                value={selectedSchoolIds}
                onChange={(e) => setSelectedSchoolIds(e.value as number[])}
                options={schools.map((s) => ({ label: s.name, value: s.id }))}
                placeholder="Todas as escolas"
                display="chip"
                style={{ width: '100%' }}
              />
            </FormField>
          </div>
        )}
      </Modal>

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
