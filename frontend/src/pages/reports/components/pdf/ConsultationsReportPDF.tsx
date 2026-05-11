import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../../assets/Logo.png';
import type { ConsultationItem } from '../../../consultations/api/consultationsApi';

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: 'Helvetica', color: '#1e293b' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerText: {},
  logo: { width: 72, height: 'auto' },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  subtitle: { fontSize: 9, color: '#64748b' },
  table: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 4 },
  thead: { flexDirection: 'row', backgroundColor: '#f8fafb', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  th: { padding: '6 8', fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  rowAlt: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', backgroundColor: '#f8fafb' },
  td: { padding: '6 8', fontSize: 9 },
  priorityMax: { padding: '2 6', borderRadius: 4, backgroundColor: '#fef2f2', color: '#ef4444', fontSize: 8, fontFamily: 'Helvetica-Bold' },
  priorityMed: { padding: '2 6', borderRadius: 4, backgroundColor: '#fffbeb', color: '#d97706', fontSize: 8, fontFamily: 'Helvetica-Bold' },
  priorityMin: { padding: '2 6', borderRadius: 4, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: 8 },
  footer: { marginTop: 16, fontSize: 8, color: '#94a3b8', textAlign: 'right' },
});

const COL_WIDTHS = { num: 32, escola: 140, turma: 60, aluno: 150, nasc: 72, prio: 70 };

interface Props { data: ConsultationItem[]; generatedAt: string }

export const ConsultationsReportPDF = ({ data, generatedAt }: Props) => (
  <Document>
    <Page size="A4" orientation="portrait" style={s.page}>
      <View style={s.header}>
        <View style={s.headerText}>
          <Text style={s.title}>Relatório de Consultas</Text>
          <Text style={s.subtitle}>
            Alunos encaminhados para consulta médica · {data.length} registro{data.length !== 1 ? 's' : ''} · Gerado em {generatedAt}
          </Text>
        </View>
        <Image src={logo} style={s.logo} />
      </View>

      <View style={s.table}>
        <View style={s.thead}>
          <Text style={[s.th, { width: COL_WIDTHS.num }]}>Nº</Text>
          <Text style={[s.th, { width: COL_WIDTHS.escola }]}>Escola</Text>
          <Text style={[s.th, { width: COL_WIDTHS.turma }]}>Turma</Text>
          <Text style={[s.th, { width: COL_WIDTHS.aluno }]}>Aluno</Text>
          <Text style={[s.th, { width: COL_WIDTHS.nasc }]}>Nascimento</Text>
          <Text style={[s.th, { width: COL_WIDTHS.prio }]}>Prioridade</Text>
        </View>

        {data.map((row, i) => (
          <View key={row.studentDataId} style={i % 2 === 0 ? s.row : s.rowAlt}>
            <Text style={[s.td, { width: COL_WIDTHS.num, color: '#94a3b8' }]}>{i + 1}</Text>
            <Text style={[s.td, { width: COL_WIDTHS.escola }]}>{row.school}</Text>
            <Text style={[s.td, { width: COL_WIDTHS.turma }]}>{row.classroom}</Text>
            <Text style={[s.td, { width: COL_WIDTHS.aluno, fontFamily: 'Helvetica-Bold' }]}>{row.studentName}</Text>
            <Text style={[s.td, { width: COL_WIDTHS.nasc }]}>{row.birthday}</Text>
            <View style={[{ width: COL_WIDTHS.prio, padding: '4 8', justifyContent: 'center' }]}>
              <Text style={
                row.priority === 'Máxima' ? s.priorityMax
                : row.priority === 'Média' ? s.priorityMed
                : s.priorityMin
              }>
                {row.priority}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={s.footer}>Lupa — Sistema de Triagem Visual Escolar</Text>
    </Page>
  </Document>
);
