import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { styles } from "../styles/StartStyles";

export default function Inicio() {
  return (
    <ScrollView style={styles.container}>

      {/* TITLE */}
      <Text style={styles.title}>Inicio</Text>

      {/* HOME */}
      <View style={styles.homeContainer}>

        {/* TEAM */}
        <View style={styles.teamCard} />

        {/* ROW */}
        <View style={styles.homeRow}>

          {/* CALENDAR */}
          <TouchableOpacity style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <Text style={styles.month}>Jun 2026</Text>

              <View style={styles.row}>
                <TouchableOpacity>
                  <Text style={styles.white}>{"<"}</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.white}>{">"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.gray}>Días del calendario</Text>
          </TouchableOpacity>

          {/* FAVORITES */}
          <TouchableOpacity style={styles.favoritesCard}>
            <Text style={styles.cardLabel}>Favoritos</Text>

            <View style={styles.favoritesContent}>
              <View>
                <Text style={styles.favTitle}>Tus canciones</Text>
                <Text style={styles.gray}>Acceso rápido</Text>
              </View>

              <Text style={styles.star}>★</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>

      {/* PROXIMOS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos</Text>

        {/* EMPTY */}
        <View style={styles.emptyCard}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.emptyTitle}>
            Nada planificado todavía
          </Text>
          <Text style={styles.gray}>
            No hay eventos aún
          </Text>
        </View>

        {/* EVENT CARD */}
        <View style={styles.eventCard}>
          <View>
            <Text style={styles.date}>24 Mar</Text>
            <Text style={styles.eventTitle}>Nombre del evento</Text>
            <Text style={styles.gray}>Iglesia Central</Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MINI PLAYER */}
      <View style={styles.miniPlayer}>
        <Text style={styles.white}>🎵 Sin canción</Text>
        <TouchableOpacity>
          <Text style={styles.white}>▶️</Text>
        </TouchableOpacity>
      </View>

      {/* NAVBAR */}
      <View style={styles.navbar}>

        <TouchableOpacity>
          <Text style={styles.white}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.white}>Canciones</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.white}>Instrumentos</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.white}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.white}>Escenario</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.white}>Ajustes</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}