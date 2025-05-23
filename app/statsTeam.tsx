import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { SEASONS_URL, STATS_BY_SEASON_URL } from '@/config';

export default function OffensiveStatsBySeasonScreen() {
  // Dropdown Temporadas
  const [openSeasons, setOpenSeasons] = useState(false);
  const [seasons, setSeasons] = useState<Array<{ label: string; value: number }>>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Datos ofensivos
  const [stats, setStats] = useState<any[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  // Cargar temporadas al montar
  useEffect(() => {
    const fetchSeasons = async () => {
      setLoadingSeasons(true);
      try {
        const res = await fetch(SEASONS_URL);
        const data = await res.json();
        const seasonItems = data.seasons.map((season: { id: number; name: string }) => ({
          label: season.name,
          value: season.id,
        }));
        setSeasons(seasonItems);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar las temporadas');
      } finally {
        setLoadingSeasons(false);
      }
    };
    fetchSeasons();
  }, []);

  // Cargar stats cuando cambia la temporada seleccionada
  useEffect(() => {
    if (!selectedSeason) {
      setStats([]);
      return;
    }
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch(`${STATS_BY_SEASON_URL}/${selectedSeason}`);
        if (!res.ok) throw new Error('No se pudieron obtener los datos');
        const data = await res.json();
        setStats(data.stats || []);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los datos ofensivos');
        setStats([]);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [selectedSeason]);

  // Render de cada fila de stats
  const renderStatItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
        <Text style={styles.cell}>{item.player_name}</Text>
        <Text style={styles.cell}>{item.tot_vb}</Text>
        <Text style={styles.cell}>{item.tot_hits}</Text>
        <Text style={styles.cell}>{item.tot_2b}</Text>
        <Text style={styles.cell}>{item.tot_3b}</Text>
        <Text style={styles.cell}>{item.tot_hr}</Text>
        <Text style={styles.cell}>{item.tot_bb}</Text>
        <Text style={styles.cell}>{item.tot_k}</Text>
        <Text style={styles.cell}>{item.avg}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas</Text>
      <View style={{ zIndex: 2, width: '90%', marginBottom: 20 }}>
        <DropDownPicker
          open={openSeasons}
          value={selectedSeason}
          items={seasons}
          setOpen={setOpenSeasons}
          setValue={setSelectedSeason}
          setItems={setSeasons}
          placeholder="Selecciona un Torneo"
          zIndex={2000}
          loading={loadingSeasons}
        />
      </View>

      {loadingStats ? (
        <ActivityIndicator size="large" />
      ) : selectedSeason && stats.length > 0 ? (
        <View style={styles.tableContainer}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>JJ</Text>
            <Text style={[styles.cell, styles.headerCell]}>VB</Text>
            <Text style={[styles.cell, styles.headerCell]}>H</Text>
            <Text style={[styles.cell, styles.headerCell]}>2B</Text>
            <Text style={[styles.cell, styles.headerCell]}>3B</Text>
            <Text style={[styles.cell, styles.headerCell]}>HR</Text>
            <Text style={[styles.cell, styles.headerCell]}>BB</Text>
            <Text style={[styles.cell, styles.headerCell]}>K</Text>
            <Text style={[styles.cell, styles.headerCell]}>AVG.</Text>
          </View>
          <FlatList
            data={stats}
            renderItem={renderStatItem}
            keyExtractor={(_, idx) => idx.toString()}
          />
        </View>
      ) : selectedSeason ? (
        <Text style={{ marginTop: 20 }}>No hay datos ofensivos para este torneo.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tableContainer: {
    width: '98%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  headerRow: {
    backgroundColor: '#4caf50',
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rowEven: {
    backgroundColor: '#f1f8e9',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
});