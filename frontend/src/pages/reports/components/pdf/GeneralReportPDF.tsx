import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../../assets/Logo.png';
import type { SchoolReport } from '../../api/reportsApi';

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#1e293b' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerText: {},
  logo: { width: 72, height: 'auto' },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  subtitle: { fontSize: 9, color: '#64748b' },
  table: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 4 },
  thead: { flexDirection: 'row', backgroundColor: '#f8fafb', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  th: { flex: 1, padding: '6 8', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase' },
  thWide: { flex: 2.5, padding: '6 8', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowAlt: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', backgroundColor: '#f8fafb' },
  td: { flex: 1, padding: '6 8' },
  tdWide: { flex: 2.5, padding: '6 8' },
  totalsRow: { flexDirection: 'row', backgroundColor: '#e8f8fb', borderTopWidth: 1, borderTopColor: '#00b4d8' },
  totalsLabel: { flex: 2.5, padding: '6 8', fontFamily: 'Helvetica-Bold', fontSize: 9 },
  totalsVal: { flex: 1, padding: '6 8', fontFamily: 'Helvetica-Bold', fontSize: 9, textAlign: 'center' },
  tdCenter: { flex: 1, padding: '6 8', textAlign: 'center' },
  footer: { marginTop: 16, fontSize: 8, color: '#94a3b8', textAlign: 'right' },
});

const COLS: { label: string; field: keyof SchoolReport; wide?: boolean; center?: boolean }[] = [
  { label: 'Escola',          field: 'school',                      wide: true },
  { label: 'Turmas',          field: 'countClassroom',               center: true },
  { label: 'Alunos',          field: 'countRegister',                center: true },
  { label: 'Questionários',   field: 'countQuestianarioPais',        center: true },
  { label: 'Triados',         field: 'countRegisterTriados',         center: true },
  { label: 'Encaminhados',    field: 'countForwardedConsultation',   center: true },
  { label: 'Consultados',     field: 'countConsultationCompleted',   center: true },
  { label: 'Receitas',        field: 'countReceitaOculosCompleted',  center: true },
  { label: 'Óculos',          field: 'countEntregaOculosCompleted',  center: true },
];

interface Props { data: SchoolReport[]; generatedAt: string }

export const GeneralReportPDF = ({ data, generatedAt }: Props) => {
  const totals = data.reduce(
    (acc, r) => ({
      countClassroom: acc.countClassroom + r.countClassroom,
      countRegister: acc.countRegister + r.countRegister,
      countQuestianarioPais: acc.countQuestianarioPais + r.countQuestianarioPais,
      countRegisterTriados: acc.countRegisterTriados + r.countRegisterTriados,
      countForwardedConsultation: acc.countForwardedConsultation + r.countForwardedConsultation,
      countConsultationCompleted: acc.countConsultationCompleted + r.countConsultationCompleted,
      countReceitaOculosCompleted: acc.countReceitaOculosCompleted + r.countReceitaOculosCompleted,
      countEntregaOculosCompleted: acc.countEntregaOculosCompleted + r.countEntregaOculosCompleted,
    }),
    { countClassroom: 0, countRegister: 0, countQuestianarioPais: 0, countRegisterTriados: 0, countForwardedConsultation: 0, countConsultationCompleted: 0, countReceitaOculosCompleted: 0, countEntregaOculosCompleted: 0 },
  );

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.header}>
          <View style={s.headerText}>
            <Text style={s.title}>Relatório Geral por Escola</Text>
            <Text style={s.subtitle}>Gerado em {generatedAt}</Text>
          </View>
          <Image src={logo} style={s.logo} />
        </View>

        <View style={s.table}>
          <View style={s.thead}>
            {COLS.map((c) => (
              <Text key={c.field} style={c.wide ? s.thWide : s.th}>{c.label}</Text>
            ))}
          </View>

          {data.map((row, i) => (
            <View key={row.schoolId} style={i % 2 === 0 ? s.row : s.rowAlt}>
              {COLS.map((c) => (
                <Text key={c.field} style={c.wide ? s.tdWide : (c.center ? s.tdCenter : s.td)}>
                  {String(row[c.field])}
                </Text>
              ))}
            </View>
          ))}

          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>TOTAL</Text>
            {COLS.slice(1).map((c) => (
              <Text key={c.field} style={s.totalsVal}>
                {String(totals[c.field as keyof typeof totals])}
              </Text>
            ))}
          </View>
        </View>

        <Text style={s.footer}>Lupa — Sistema de Triagem Visual Escolar</Text>
      </Page>
    </Document>
  );
};
