import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../../assets/Logo.png';
import type { Student } from '../../api/studentsApi';

const ACOMP_LABELS: Record<string, string> = {
  acomp_ambliopia: 'Ambliopia',
  acomp_retinoblastoma: 'Retinoblastoma',
  acomp_catarata_congenita: 'Catarata congênita',
  acomp_obstrucao_lacrimais: 'Obstrução de vias lacrimais',
  acomp_estrabismo: 'Estrabismo',
  acomp_glaucoma_congenito: 'Glaucoma congênito',
  acomp_uveites: 'Uveítes',
  acomp_nistagmo: 'Nistagmo',
  acomp_miopia_progressiva: 'Miopia progressiva',
  acomp_ectasias_cornea: 'Ectasias de córnea',
  acomp_alergias_conjuntivites: 'Alergias / Conjuntivites / Calázio',
  acomp_baixa_visao_central: 'Baixa visão central',
};

const s = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#111827',
    backgroundColor: '#f1f3f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1.2,
    borderBottomColor: '#9aa1a9',
    backgroundColor: '#f1f3f5',
  },
  patientName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
    lineHeight: 1.2,
  },
  headerLine: {
    fontSize: 10,
    marginBottom: 2,
    lineHeight: 1.25,
  },
  logo: {
    width: 110,
    height: 'auto',
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2b2f33',
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0d9488',
    textTransform: 'uppercase',
    marginBottom: 5,
    marginTop: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: '#0d9488',
    paddingBottom: 2,
  },
  eyeLabel: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 3,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  fieldBox: {
    backgroundColor: '#ffffff',
    borderRadius: 3,
    padding: '4 8',
    minWidth: 90,
    marginBottom: 4,
  },
  fieldBoxFull: {
    backgroundColor: '#ffffff',
    borderRadius: 3,
    padding: '4 8',
    width: '100%',
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 7.5,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 10,
    color: '#111827',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
  },
  tableRowLast: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  thCell: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    padding: '4 4',
  },
  tdLabel: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    padding: '4 8',
  },
  tdCell: {
    fontSize: 9.5,
    color: '#1f2937',
    textAlign: 'center',
    padding: '4 4',
  },
  cLabel: { width: '22%' },
  cField: { width: '15.6%' },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  tag: {
    backgroundColor: '#ccfbf1',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 9,
    color: '#0f766e',
  },
  footer: {
    marginTop: 14,
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center',
  },
  divider: {
    height: 0.8,
    backgroundColor: '#d1d5db',
    marginVertical: 8,
  },
});

const Field = ({ label, value, full }: { label: string; value?: string | null; full?: boolean }) => (
  <View style={full ? s.fieldBoxFull : s.fieldBox}>
    <Text style={s.fieldLabel}>{label}</Text>
    <Text style={s.fieldValue}>{value || '—'}</Text>
  </View>
);

interface Props {
  student: Student;
  emittedAt: string;
}

export const StudentConsultationPDF = ({ student, emittedAt }: Props) => {
  const st = student as unknown as Record<string, unknown>;
  const acompSelected = Object.entries(ACOMP_LABELS).filter(([k]) => st[k]).map(([, label]) => label);

  const hasSpot = student.spot_esferico_od || student.spot_esferico_oe ||
    student.spot_cilindrico_od || student.spot_cilindrico_oe;
  const hasRefStatica = student.ref_estatica_esferico_od || student.ref_estatica_esferico_oe ||
    student.ref_estatica_cilindrico_od || student.ref_estatica_cilindrico_oe;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.patientName}>Paciente: {student.name}</Text>
            <Text style={s.headerLine}>Data de Nascimento: {student.birthday || '—'}</Text>
            <Text style={s.headerLine}>Data da Consulta: {student.data_consulta || '—'}</Text>
            <Text style={s.headerLine}>Médico: {student.nome_medico || '—'}</Text>
            <Text style={s.headerLine}>CRM: {student.crm_medico || '—'}</Text>
            <Text style={s.headerLine}>
              Precisa de óculos: {student.precisa_oculos === '1' ? 'Sim' : student.precisa_oculos === '0' ? 'Não' : '—'}
              {student.proxima_consulta_meses ? `   |   Próxima consulta: ${student.proxima_consulta_meses} meses` : ''}
            </Text>
          </View>
          <Image src={logo} style={s.logo} />
        </View>

        <View style={s.body}>
          <Text style={s.pageTitle}>Relatório de Consulta Médica</Text>

          {/* Spot Vision */}
          {hasSpot && (
            <View>
              <Text style={s.sectionTitle}>Spot Vision</Text>
              <View style={s.tableHeader}>
                <Text style={[s.thCell, s.cLabel]}> </Text>
                <Text style={[s.thCell, s.cField]}>Esférico</Text>
                <Text style={[s.thCell, s.cField]}>Cilíndrico</Text>
                <Text style={[s.thCell, s.cField]}>Eixo</Text>
                <Text style={[s.thCell, s.cField]}>Eq. Esférico</Text>
                <Text style={[s.thCell, s.cField]}>DP</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdLabel, s.cLabel]}>Olho direito</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_esferico_od || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_cilindrico_od || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_eixo_od || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_eq_esferico_od || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_dp_od || '—'}</Text>
              </View>
              <View style={s.tableRowLast}>
                <Text style={[s.tdLabel, s.cLabel]}>Olho esquerdo</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_esferico_oe || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_cilindrico_oe || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_eixo_oe || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_eq_esferico_oe || '—'}</Text>
                <Text style={[s.tdCell, s.cField]}>{student.spot_dp_oe || '—'}</Text>
              </View>
              {student.spot_observacao && (
                <View style={{ marginTop: 4 }}>
                  <Field label="Observação Spot Vision" value={student.spot_observacao} full />
                </View>
              )}
            </View>
          )}

          {/* Anamnese */}
          {student.anamnese && (
            <View>
              <Text style={s.sectionTitle}>Anamnese</Text>
              <Field label="Anamnese" value={student.anamnese} full />
            </View>
          )}

          {/* Refração Estática */}
          {hasRefStatica && (
            <View>
              <Text style={s.sectionTitle}>Refração Estática</Text>
              <View style={s.tableHeader}>
                <Text style={[s.thCell, s.cLabel]}> </Text>
                <Text style={[s.thCell, { width: '19.5%' }]}>Esférico</Text>
                <Text style={[s.thCell, { width: '19.5%' }]}>Cilíndrico</Text>
                <Text style={[s.thCell, { width: '19.5%' }]}>Eixo</Text>
                <Text style={[s.thCell, { width: '19.5%' }]}>Acuidade visual</Text>
              </View>
              <View style={s.tableRow}>
                <Text style={[s.tdLabel, s.cLabel]}>Olho direito</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_esferico_od || '—'}</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_cilindrico_od || '—'}</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_eixo_od || '—'}</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_acuidade_od || '—'}</Text>
              </View>
              <View style={s.tableRowLast}>
                <Text style={[s.tdLabel, s.cLabel]}>Olho esquerdo</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_esferico_oe || '—'}</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_cilindrico_oe || '—'}</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_eixo_oe || '—'}</Text>
                <Text style={[s.tdCell, { width: '19.5%' }]}>{student.ref_estatica_acuidade_oe || '—'}</Text>
              </View>
            </View>
          )}

          {/* Biomicroscopia */}
          {(student.biomicroscopia_od || student.biomicroscopia_oe) && (
            <View>
              <Text style={s.sectionTitle}>Biomicroscopia</Text>
              <View style={s.grid}>
                {student.biomicroscopia_od && <Field label="Olho direito" value={student.biomicroscopia_od} />}
                {student.biomicroscopia_oe && <Field label="Olho esquerdo" value={student.biomicroscopia_oe} />}
              </View>
            </View>
          )}

          {/* Fundoscopia */}
          {(student.fundoscopia_od || student.fundoscopia_oe) && (
            <View>
              <Text style={s.sectionTitle}>Fundoscopia</Text>
              <View style={s.grid}>
                {student.fundoscopia_od && <Field label="Olho direito" value={student.fundoscopia_od} />}
                {student.fundoscopia_oe && <Field label="Olho esquerdo" value={student.fundoscopia_oe} />}
              </View>
            </View>
          )}

          {/* Motilidade Ocular */}
          {student.motilidade_ocular && (
            <View>
              <Text style={s.sectionTitle}>Motilidade Ocular</Text>
              <Field label="Motilidade ocular" value={student.motilidade_ocular} full />
            </View>
          )}

          {/* Diagnóstico e Conduta */}
          {(student.diagnostico || student.conduta) && (
            <View>
              <Text style={s.sectionTitle}>Diagnóstico e Conduta</Text>
              {student.diagnostico && <Field label="Diagnóstico" value={student.diagnostico} full />}
              {student.conduta && <Field label="Conduta" value={student.conduta} full />}
            </View>
          )}

          {/* Acompanhamento */}
          {acompSelected.length > 0 && (
            <View>
              <Text style={s.sectionTitle}>Acompanhamento</Text>
              <View style={s.tagsWrap}>
                {acompSelected.map((label) => (
                  <Text key={label} style={s.tag}>{label}</Text>
                ))}
              </View>
            </View>
          )}

          {/* Observações */}
          {student.observacoes_consulta && (
            <View>
              <Text style={s.sectionTitle}>Observações</Text>
              <Field label="Observações da consulta" value={student.observacoes_consulta} full />
            </View>
          )}

          <Text style={s.footer}>
            Relatório gerado em: {emittedAt}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
