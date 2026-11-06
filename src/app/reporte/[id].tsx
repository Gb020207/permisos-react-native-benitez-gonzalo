import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import {
  ActionButton,
  Card,
  Eyebrow,
  Heading,
  Loading,
  Screen,
  colors,
} from '@/components/ui';
import { useAppData } from '@/context/AppContext';
import { ensureReportNotificationChannel } from '@/lib/notifications';
import { ReportStatus } from '@/types/report';

const statusStyleConfig: Record<ReportStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  pendiente: { label: 'Pendiente', text: '#b45309', bg: '#fef3c7', border: '#fde68a', dot: '#d97706' },
  'en curso': { label: 'En curso', text: '#0369a1', bg: '#e0f2fe', border: '#bae6fd', dot: '#0284c7' },
  resuelto: { label: 'Resuelto', text: '#0c4a6e', bg: '#bae6fd', border: '#7dd3fc', dot: '#0284c7' },
};

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { reports, loading, notificationsEnabled, updateReport, addNotice } = useAppData();
  const [saving, setSaving] = useState(false);
  const report = reports.find((item) => item.id === id);

  async function changeStatus(status: ReportStatus) {
    if (!report) return;
    setSaving(true);
    try {
      await updateReport(report.id, { status });
      if (status === 'resuelto') {
        await addNotice({
          title: 'Reporte resuelto',
          message: `Se resolvió “${report.title}”.`,
          reportId: report.id,
        });

        if (notificationsEnabled) {
          const currentPermission = await Notifications.getPermissionsAsync();
          if (currentPermission.granted) {
            await ensureReportNotificationChannel();
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Mantenimiento IPF',
                body: `Se resolvió “${report.title}”.`,
                data: { reportId: report.id },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 10,
                channelId: 'reportes',
              },
            });
          } else {
            Alert.alert(
              'Reporte actualizado',
              'El aviso queda en la bandeja de la app. El permiso fue cambiado desde Ajustes.',
            );
          }
        }
      } else if (status === 'en curso') {
        await addNotice({
          title: 'Reporte en curso',
          message: `El equipo comenzó a trabajar en “${report.title}”.`,
          reportId: report.id,
        });
      }
    } catch (error) {
      Alert.alert('No se pudo completar la acción', error instanceof Error ? error.message : 'Intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <Screen><Loading label="Cargando reporte…" /></Screen>;
  }

  if (!report) {
    return (
      <Screen>
        <Eyebrow>Reporte</Eyebrow>
        <Heading>No se encontró el reporte</Heading>
        <Text style={{ color: colors.muted, fontSize: 14 }}>
          Puede haber sido eliminado del almacenamiento local.
        </Text>
        <ActionButton onPress={() => router.replace('/')}>Volver al inicio</ActionButton>
      </Screen>
    );
  }

  return (
    <Screen>
      <Eyebrow>Reporte · {report.aula}</Eyebrow>
      <Heading subtitle={`${report.category} · creado ${new Date(report.createdAt).toLocaleString()}`}>
        {report.title}
      </Heading>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: statusStyleConfig[report.status].bg, borderWidth: 1, borderColor: statusStyleConfig[report.status].border }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusStyleConfig[report.status].dot }} />
          <Text style={{ color: statusStyleConfig[report.status].text, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }}>
            Estado: {statusStyleConfig[report.status].label}
          </Text>
        </View>
        <Text style={{ color: colors.ink, fontSize: 15, lineHeight: 22 }}>{report.description}</Text>
        {report.location ? (
          <View style={{ gap: 4 }}>
            <Text style={{ color: colors.ink, fontWeight: '700' }}>Lugar</Text>
            <Text style={{ color: colors.muted, fontSize: 14 }}>{report.location.label}</Text>
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {report.location.approximate ? 'Ubicación aproximada o sector elegido a mano.' : 'Ubicación en primer plano.'}
            </Text>
          </View>
        ) : null}
        {report.imageUri ? (
          <Image
            source={{ uri: report.imageUri }}
            accessibilityLabel="Foto adjunta al reporte"
            style={{ width: '100%', height: 230, borderRadius: 12 }}
            resizeMode="cover"
          />
        ) : null}
      </Card>

      {report.status === 'pendiente' ? (
        <ActionButton disabled={saving} onPress={() => changeStatus('en curso')}>
          Marcar en curso
        </ActionButton>
      ) : null}
      {report.status !== 'resuelto' ? (
        <ActionButton disabled={saving} onPress={() => changeStatus('resuelto')} variant="secondary">
          Simular resolución
        </ActionButton>
      ) : (
        <Card style={{ backgroundColor: colors.primaryLight, borderColor: '#bae6fd' }}>
          <Text style={{ color: colors.primaryDark, fontSize: 15, fontWeight: '800' }}>
            ✓ Este reporte está resuelto.
          </Text>
          {notificationsEnabled ? (
            <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>
              Si los avisos están habilitados, se programa una notificación local en 10 segundos.
            </Text>
          ) : (
            <Text style={{ color: colors.muted, fontSize: 13, lineHeight: 19 }}>
              La novedad quedó en la bandeja Avisos. Podés activar notificaciones desde Ajustes.
            </Text>
          )}
        </Card>
      )}

      <ActionButton onPress={() => router.push('/avisos')} variant="quiet">Abrir Avisos</ActionButton>
      <ActionButton onPress={() => router.back()} variant="quiet">Volver</ActionButton>
    </Screen>
  );
}
