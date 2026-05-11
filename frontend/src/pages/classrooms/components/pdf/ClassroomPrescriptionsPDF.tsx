import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import logo from '../../../../assets/Logo.png';
import type { Student } from '../../../students/api/studentsApi';

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
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    lineHeight: 1.2,
  },
  headerLine: {
    fontSize: 10.5,
    marginBottom: 3,
    lineHeight: 1.25,
  },
  logo: {
    width: 118,
    height: 'auto',
    marginTop: 2,
  },
  body: {
    paddingTop: 8,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
    marginBottom: 10,
    color: '#2b2f33',
  },
  table: {
    borderTopWidth: 1.2,
    borderBottomWidth: 1.2,
    borderColor: '#9aa1a9',
    backgroundColor: '#f3f4f6',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#c8ced4',
    minHeight: 34,
    alignItems: 'center',
  },
  rowNoBorder: {
    flexDirection: 'row',
    minHeight: 34,
    alignItems: 'center',
  },
  cellHead: {
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    fontSize: 12,
    color: '#1f2937',
  },
  cellLabel: {
    paddingLeft: 12,
    fontSize: 11.5,
    color: '#1f2937',
  },
  cellValue: {
    textAlign: 'center',
    fontSize: 11.5,
    color: '#1f2937',
  },
  c0: { width: '40%' },
  c1: { width: '15%' },
  c2: { width: '15%' },
  c3: { width: '15%' },
  c4: { width: '15%' },
  footer: {
    marginTop: 12,
    paddingHorizontal: 20,
    fontSize: 10,
    color: '#111827',
  },
});

interface Props {
  students: Student[];
  emittedAt: string;
}

export const ClassroomPrescriptionsPDF = ({ students, emittedAt }: Props) => (
  <Document>
    {students.map((student) => (
      <Page key={student.id} size="A4" orientation="landscape" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.patientName}>Nome: {student.name}</Text>
            <Text style={s.headerLine}>Data de Nascimento: {student.birthday || '—'}</Text>
            <Text style={s.headerLine}>Data da consulta: {student.data_consulta || '—'}</Text>
            <Text style={s.headerLine}>Médico: {student.nome_medico || '—'}</Text>
            <Text style={s.headerLine}>CRM: {student.crm_medico || '—'}</Text>
          </View>
          <Image src={logo} style={s.logo} />
        </View>

        <View style={s.body}>
          <Text style={s.sectionTitle}>Receita de óculos</Text>

          <View style={s.table}>
            <View style={s.row}>
              <Text style={[s.cellHead, s.c0]}> </Text>
              <Text style={[s.cellHead, s.c1]}>Esférico</Text>
              <Text style={[s.cellHead, s.c2]}>Cilíndrico</Text>
              <Text style={[s.cellHead, s.c3]}>Eixo</Text>
              <Text style={[s.cellHead, s.c4]}>DP</Text>
            </View>

            <View style={s.row}>
              <Text style={[s.cellLabel, s.c0]}>Olho direito</Text>
              <Text style={[s.cellValue, s.c1]}>{student.receita_esferico_od || '—'}</Text>
              <Text style={[s.cellValue, s.c2]}>{student.receita_cilindrico_od || '—'}</Text>
              <Text style={[s.cellValue, s.c3]}>{student.receita_eixo_od || '—'}</Text>
              <Text style={[s.cellValue, s.c4]}>{student.receita_dp || '—'}</Text>
            </View>

            <View style={s.rowNoBorder}>
              <Text style={[s.cellLabel, s.c0]}>Olho esquerdo</Text>
              <Text style={[s.cellValue, s.c1]}>{student.receita_esferico_oe || '—'}</Text>
              <Text style={[s.cellValue, s.c2]}>{student.receita_cilindrico_oe || '—'}</Text>
              <Text style={[s.cellValue, s.c3]}>{student.receita_eixo_oe || '—'}</Text>
              <Text style={[s.cellValue, s.c4]}>{student.receita_dp || '—'}</Text>
            </View>
          </View>

          <Text style={s.footer}>
            Receita feita por um profissional da saúde. Data de emissão: {emittedAt}
          </Text>
        </View>
      </Page>
    ))}
  </Document>
);

