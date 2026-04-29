import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import CalendarModal from "../components/CalendarModal";
import { styles } from "../styles/StartStyles";

export default function Inicio({ navigation }: any) {

  const [showCalendar, setShowCalendar] = useState(false);

  // 🔥 Fecha optimizada (no recalcula en cada render)
  const currentMonth = useMemo(() => {
    return new Date().toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric"
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {/* CONTENIDO */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* TITLE */}
        <Text style={styles.title}>Inicio</Text>

        {/* HOME */}
        <View style={styles.homeContainer}>

          {/* TEAM */}
          <View style={styles.teamCard} />

          {/* ROW */}
          <View style={styles.homeRow}>

            {/* CALENDAR */}
            <TouchableOpacity
              style={styles.calendarCard}
              activeOpacity={0.8}
              onPress={() => setShowCalendar(true)}
            >
              <View style={styles.calendarHeader}>

                <Text style={styles.month}>
                  {currentMonth}
                </Text>

                {/* Solo visual (no funcional aquí) */}
                <View style={styles.row}>
                  <Text style={styles.white}>{"<"}</Text>
                  <Text style={styles.white}>{">"}</Text>
                </View>

              </View>

              <Text style={styles.gray}>
                Abrir calendario
              </Text>
            </TouchableOpacity>

            {/* FAVORITES */}
            <TouchableOpacity
              style={styles.favoritesCard}
              activeOpacity={0.8}
            >
              <Text style={styles.cardLabel}>Favoritos</Text>

              <View style={styles.favoritesContent}>
                <View>
                  <Text style={styles.favTitle}>
                    Tus canciones
                  </Text>
                  <Text style={styles.gray}>
                    Acceso rápido
                  </Text>
                </View>

                <Text style={styles.star}>★</Text>
              </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* PROXIMOS */}
        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Próximos
          </Text>

          <View style={styles.emptyCard}>
            <Text style={styles.icon}>📅</Text>

            <Text style={styles.emptyTitle}>
              Nada planificado todavía
            </Text>

            <Text style={styles.gray}>
              No hay eventos aún
            </Text>
          </View>

        </View>

      </ScrollView>

      {/* 🔥 MODAL CALENDARIO */}
      <CalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
      />

      {/* 🔥 NAVBAR GLASS PRO */}
      <BlurView
        intensity={90}
        tint="dark"
        style={styles.navbar}
      >

        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => navigation.navigate("Start")}
        >
          <Ionicons name="home" size={22} color="white" />
          <Text style={styles.white}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => navigation.navigate("Songs")}
        >
          <Ionicons name="musical-notes" size={22} color="white" />
          <Text style={styles.white}>Canciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => navigation.navigate("Instruments")}
        >
          <MaterialCommunityIcons
            name="guitar-electric"
            size={22}
            color="white"
          />
          <Text style={styles.white}>Instrumentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => navigation.navigate("Events")}
        >
          <Ionicons name="calendar" size={22} color="white" />
          <Text style={styles.white}>Eventos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => navigation.navigate("Stage")}
        >
          <Ionicons name="mic" size={22} color="white" />
          <Text style={styles.white}>Escenario</Text>
        </TouchableOpacity>

      </BlurView>

    </View>
  );
}