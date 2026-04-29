import React, { useState } from "react";
import {
    Animated,
    Modal,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function CalendarModal({ visible, onClose }: any) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const [isVisible, setIsVisible] = useState(visible);

  const slideAnim = useState(new Animated.Value(300))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  // 🔥 SIN EVENTOS POR DEFECTO
  const events: Record<number, string[]> = {};

  // 🔥 CONTROL DE APERTURA
  React.useEffect(() => {
    if (visible) {

      setIsVisible(true);

      // reset
      setCurrentDate(new Date());
      setSelectedDay(null);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [visible]);

  // 🔥 CIERRE CON ANIMACIÓN
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      setIsVisible(false);
      onClose(); // ahora sí cerramos
    });
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const start = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < start; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const days = getDaysInMonth();

  return (
    <Modal visible={isVisible} transparent>

      {/* BACKDROP */}
      <Animated.View style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        opacity: fadeAnim,
        justifyContent: "center",
        alignItems: "center"
      }}>

        {/* MODAL */}
        <Animated.View style={{
          width: "90%",
          backgroundColor: "#2c2c2e",
          borderRadius: 25,
          padding: 20,
          transform: [{ translateY: slideAnim }]
        }}>

          {/* HEADER */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}>

            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={{ color: "white", fontSize: 20 }}>{"<"}</Text>
            </TouchableOpacity>

            <Text style={{
              color: "white",
              fontSize: 18,
              fontWeight: "500",
              textTransform: "capitalize"
            }}>
              {currentDate.toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric"
              })}
            </Text>

            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={{ color: "white", fontSize: 20 }}>{">"}</Text>
            </TouchableOpacity>

          </View>

          {/* DIAS SEMANA */}
          <View style={{
            flexDirection: "row",
            marginBottom: 10
          }}>
            {["LUN","MAR","MIÉ","JUE","VIE","SÁB","DOM"].map((d, i) => (
              <Text key={i} style={{
                color: "#aaa",
                width: "14.28%",
                textAlign: "center",
                fontSize: 12
              }}>
                {d}
              </Text>
            ))}
          </View>

          {/* GRID */}
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap"
          }}>
            {days.map((day, index) => {

              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

              const hasEvent =
                day !== null &&
                Array.isArray(events[day]) &&
                events[day].length > 0;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (day !== null) setSelectedDay(day);
                  }}
                  style={{
                    width: "14.28%",
                    aspectRatio: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10
                  }}
                >

                  {/* SOLO HOY */}
                  {day !== null && isToday && (
                    <View style={{
                      position: "absolute",
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: "#3a3b40"
                    }} />
                  )}

                  <Text style={{
                    color: day ? "white" : "transparent"
                  }}>
                    {day || ""}
                  </Text>

                  {/* EVENTOS */}
                  {day !== null && hasEvent && (
                    <View style={{
                      position: "absolute",
                      bottom: 4,
                      width: 5,
                      height: 5,
                      borderRadius: 5,
                      backgroundColor: "#4da3ff"
                    }} />
                  )}

                </TouchableOpacity>
              );
            })}
          </View>

          {/* EVENTOS */}
          {selectedDay && events[selectedDay]?.length > 0 && (
            <View style={{ marginTop: 15 }}>
              <Text style={{ color: "white", fontWeight: "600", marginBottom: 5 }}>
                Eventos:
              </Text>

              {events[selectedDay].map((e: string, i: number) => (
                <Text key={i} style={{ color: "#aaa" }}>
                  • {e}
                </Text>
              ))}
            </View>
          )}

          {/* CERRAR */}
          <TouchableOpacity onPress={handleClose} style={{ marginTop: 15 }}>
            <Text style={{
              color: "#4da3ff",
              textAlign: "center",
              fontSize: 16
            }}>
              Cerrar
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </Animated.View>
    </Modal>
  );
}