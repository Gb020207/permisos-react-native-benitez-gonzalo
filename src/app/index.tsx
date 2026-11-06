import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import {
  ActionButton,
  Card,
  Heading,
  Loading,
  Screen,
  colors,
} from '@/components/ui';
import { useAppData } from '@/context/AppContext';
import { Report, ReportStatus } from '@/types/report';

const statusConfig: Record<ReportStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  pendiente: {
    label: 'Pendiente',
    text: '#b45309',
    bg: '#fef3c7',
    border: '#fde68a',
    dot: '#d97706',
  },
  'en curso': {
    label: 'En curso',
    text: '#0369a1',
    bg: '#e0f2fe',
    border: '#bae6fd',
    dot: '#0284c7',
  },
  resuelto: {
    label: 'Resuelto',
    text: '#0c4a6e',
    bg: '#bae6fd',
    border: '#7dd3fc',
    dot: '#0284c7',
  },
};

function ReportCard({ report, onPress }: { report: Report; onPress: () => void }) {
  const status = statusConfig[report.status] ?? statusConfig.pendiente;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] }]}
    >
      <Card style={{ borderLeftWidth: 5, borderLeftColor: status.dot }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ color: colors.ink, fontSize: 17, fontWeight: '800', letterSpacing: -0.2 }}>
              {report.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <View
                style={{
                  backgroundColor: colors.primaryLight,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.primaryDark, fontSize: 12, fontWeight: '700' }}>
                  Aula {report.aula}
                </Text>
              </View>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600' }}>
                • {report.category}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: status.bg,
              borderWidth: 1,
              borderColor: status.border,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: status.dot }} />
            <Text
              style={{
                color: status.text,
                fontSize: 11,
                fontWeight: '800',
                textTransform: 'uppercase',
              }}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <Text numberOfLines={2} style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>
          {report.description}
        </Text>
      </Card>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { reports, loading, notices } = useAppData();

  const totalReports = reports.length;
  const inProgressReports = reports.filter((r) => r.status === 'en curso').length;
  const resolvedReports = reports.filter((r) => r.status === 'resuelto').length;

  return (
    <Screen>
      {/* Hero Banner en Azules y Celestes */}
      <View
        style={{
          backgroundColor: '#0c4a6e',
          borderRadius: 24,
          padding: 22,
          gap: 16,
          shadowColor: '#0c4a6e',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 14,
          elevation: 5,
        }}
      >
        <View style={{ gap: 8 }}>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(224, 242, 254, 0.2)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(224, 242, 254, 0.35)',
            }}
          >
            <Text
              style={{
                color: '#e0f2fe',
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              🏛️ Instituto Politécnico Formosa
            </Text>
          </View>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 26,
              fontWeight: '900',
              lineHeight: 32,
              letterSpacing: -0.5,
            }}
          >
            Mantenimiento Edilicio
          </Text>
          <Text style={{ color: '#bae6fd', fontSize: 14, lineHeight: 21 }}>
            Reportá desperfectos al instante con control total de tus permisos y privacidad.
          </Text>
        </View>

        {/* Panel de Estadísticas Rápidas */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              padding: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 22, fontWeight: '900' }}>{totalReports}</Text>
            <Text style={{ color: '#e0f2fe', fontSize: 11, fontWeight: '700' }}>Total</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              padding: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <Text style={{ color: '#38bdf8', fontSize: 22, fontWeight: '900' }}>{inProgressReports}</Text>
            <Text style={{ color: '#e0f2fe', fontSize: 11, fontWeight: '700' }}>En curso</Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              padding: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <Text style={{ color: '#7dd3fc', fontSize: 22, fontWeight: '900' }}>{resolvedReports}</Text>
            <Text style={{ color: '#e0f2fe', fontSize: 11, fontWeight: '700' }}>Resueltos</Text>
          </View>
        </View>
      </View>

      {/* Botones de Acción Primaria */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1.2 }}>
          <ActionButton onPress={() => router.push('/reporte/nuevo')}>
            ＋ Nuevo reporte
          </ActionButton>
        </View>
        <View style={{ flex: 1 }}>
          <ActionButton onPress={() => router.push('/avisos')} variant="secondary">
            🔔 Avisos{notices.length ? ` (${notices.length})` : ''}
          </ActionButton>
        </View>
      </View>

      {/* Tarjeta de Garantía de Privacidad en Celeste */}
      <Card
        style={{
          backgroundColor: colors.primaryLight,
          borderColor: '#bae6fd',
          borderWidth: 1.5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 22 }}>🛡️</Text>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={{ color: colors.primaryDark, fontSize: 15, fontWeight: '800' }}>
              Permisos bajo tu control
            </Text>
            <Text style={{ color: colors.ink, fontSize: 13, lineHeight: 19 }}>
              Escanear, sacar foto, marcar ubicación y recibir avisos son decisiones individuales y opcionales.
            </Text>
          </View>
        </View>
        <ActionButton onPress={() => router.push('/permisos')} variant="quiet">
          Gestionar permisos
        </ActionButton>
      </Card>

      {/* Listado de Reportes Recientes */}
      <View style={{ gap: 12 }}>
        <Heading subtitle="Guardados de manera segura en este dispositivo.">
          Historial de reportes
        </Heading>

        {loading ? <Loading label="Cargando reportes…" /> : null}

        {!loading && reports.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 28, gap: 10 }}>
            <Text style={{ fontSize: 36 }}>📋</Text>
            <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '800', textAlign: 'center' }}>
              No hay reportes registrados
            </Text>
            <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center', maxWidth: 360 }}>
              Si encontrás una luminaria dañada, problemas edilicios o mobiliario roto, tocá en «Nuevo reporte».
            </Text>
          </Card>
        ) : null}

        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onPress={() =>
              router.push({ pathname: '/reporte/[id]', params: { id: report.id } })
            }
          />
        ))}
      </View>

      <ActionButton onPress={() => router.push('/ajustes-app')} variant="quiet">
        ⚙️ Configurar alertas y avisos
      </ActionButton>
    </Screen>
  );
}
