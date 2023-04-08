---
title: "Czujnik temperatury DS18B20 i Arduino"
date: 2014-02-01
categories:
  - Elektronika
  - Arduino
draft: false
---
Układ DS18B20 jest scalonym czujnikiem temperatury z interfejsem 1-Wire. Jest jednym z wielu układów z tym interfejsem produkowanych przez Maxim, dawniej Dallas. Do rodziny tej należą między innymi pamięci, przetworniki analogowo-cyfrowe i potencjometry cyfrowe. Unikatową cechą magistrali 1-Wire jest możliwość zasilania podłączonych do niej układów za pomocą jedynej linii danych. Dzięki temu w bardzo prosty sposób można budować rozległe sieci czujników – to świetna wiadomość jeśli chciałbys np. monitorować temperaturę w pomieszczeniach swojego domu.

## Magistrala 1-Wire
Zanim zajmiemy się podłączeniem DS18B20 do Arduino warto zapoznać się z kilkoma faktami o magistrali 1-Wire. Podane tu ogólne informacje na pewno okażą się przydatne w przyszłości kiedy zechcesz wykorzystać inne układy z tej rodziny w swoich projektach.

Magistrala 1-Wire wykorzystuje jedno urządzenie jako kontroler (master), który komunikuje się za jej pomocą z jednym lub wieloma urządzeniami podrzędnymi (slave). 1-Wire jest interfejsem szeregowym. Dane między kontrolerem, a urządzeniami podrzędnymi i w drugą stronę przesyłane są jednym przewodem – stąd nazwa całego interfejsu.
Komunikacja za pomocą interfejsu 1-Wire rozpoczyna się od zresetowania wszystkich urządzeń podłączonych do magistrali. W tym celu kontroler wymusza stan niski na szynie danych przez co najmniej 480 µs, następnie „puszcza” magistralę i po upływie kolejnych 60 µs sprawdza, czy układ peryferyjny ściągnął szynę danych do masy. W ten sposób kontroler może wykryć czy do magistrali podłączony jest chociaż jeden układ peryferyjny.

Aby możliwe było komunikowanie się z wieloma urządzeniami podłączonymi do jednej magistrali, każdy układ 1-Wire ma w nieulotnej pamięci ROM zapisany 64 bitowy adres – numer seryjny. Producent gwarantuje unikatowość tego numeru, dzięki czemu możesz mieć pewność, że nigdy się on nie powtórzy. Najprostsze układy 1-Wire nie posiadają żadnych innych funkcji jak tylko możliwość odczytu tego unikatowego numeru. Produkowane są między innymi w postaci „pastylek” czy breloczków do kluczy i wykorzystywane np. w systemach kontroli dostępu.

Kontroler magistrali (master) może odnaleźć wszystkie urządzenia jakie są do niej podłączone wykorzystując mechanizm enumeracji. W tym celu kontroler wysyła komendę SearchROM, którą odbierają wszystkie układy. W odpowiedzi wysyłają one swoje adresy bit po bicie, poczynając od najmniej znaczącego. Proces wysyłania każdego bitu przebiega w trzech krokach:

1. Wszystkie układy wysyłają n-ty bit swojego adresu. Jeśli choć jeden z nich wyśle zero, to kontroler odczyta zero, ponieważ magistrala dzięki swoim właściwościom realizuje funkcję logiczną AND.
2. Następnie wszystkie układy wysyłają zanegowany n-ty bit adresu. Jeśli i tym razem kontroler odbierze zero, oznacza to, że do magistrali jest też podłączony układ, który na tej pozycji adresu ma bit o wartości jeden.
3. Kontroler potwierdza odebrany bit wysyłając go z powrotem do układów peryferyjnych. Jeśli jakiś układ peryferyjny odbierze inny bit niż wysłał, milknie i wyłącza się z dalszej komunikacji aż do następnego resetu magistrali. Dzięki takiej eliminacji kontroler może poznać adresy wszystkich układów peryferyjnych podłączonych do magistrali.
Znając adres układu podłączonego do magistrali możemy nawiązać z nim bezpośrednią transmisję. Kiedy kontroler wyśle adres jakiegoś układu, ten kontynuuje komunikację, podczas gdy pozostałe układy czekają na sygnał resetu.

## Układ DS18B20
DS18B20 to cyfrowy czujnik temperatury o maksymalnej rozdzielczości 12 bitów. Układ posiada również funkcję alarmu aktywowanego po przekroczeniu górnego lub dolnego progu ustawianego przez użytkownika i zapamiętywanego w nieulotnej pamięci. Zakres dopuszczalnych temperatur pracy wynosi -55°C do +125°C, zaś dokładność w przedziale -10°C do +85°C wynosi ±0,5°C.

Pomiar temperatury inicjowany jest przez kontroler wydaniem komendy ConvertT. Wykonanie tego rozkazu może trwać do 750ms (a więc dosyć długo), a w jego wyniku dwubajtowa wartość temperatury zapisywana jest w pamięci układu (tzw. scratchpad). Odczyt tej pamięci możliwy jest za pomocą komendy ReadScratchpad.

## Podłączenie DS18B20 do Arduino
Po tym przydługim wstępie teoretycznym najwyższa pora zbudować jakiś praktyczny układ. Poniższy rysunek przedstawia przykład podłączenia układu DS18B20 do Arduino.
Rezystor R1 podciąga szynę danych do dodatniego napięcia zasilania. Typowo ma on wartość ok. 4,7kΩ, ale w przypadku długich przewodów łączących czujnik z płytka Arduino można go zmniejszyć np. do 2,2kΩ, co zapewni silniejszy pull-up.

{{< image src="img/ds18b20_full-power_bb.png" title="Arduino + DS18B20 - zasilanie zewnętrzne" >}}

Linia danych może w zasadzie być podłączona do dowolnego pinu Arduino, należy to tylko uwzględnić w kodzie programu.

## Parasite power
Jak wspomniałem wcześniej, układy 1-Wire mogą być zasilane nie tylko przez bezpośrednie doprowadzenie prądu do końcówki zasilającej, ale także za pośrednictwem linii danych. Takie rozwiązanie nazywane jest parasite power, czyli zasilanie pasożytnicze. Pozwala to zredukować liczbę przewodów potrzebnych do zbudowania sieci czujników do linii danych i masy, co ma znaczący wpływ na obniżenie kosztów. Okupione jest to jednak pewnymi ograniczeniami co do szybkości przesyłania danych i długości całej magistrali.
Schemat podłączenia układu DS18B20 do Arduino w trybie zasilania pasożytniczego przedstawiony jest na poniższym rysunku.

{{< image src="img/ds18b20_parasite-power_bb.png" title="Arduino + DS18B20 – parasite power" >}}

## Przykładowy program
Na całe szczęście nie będziemy musieli zaprzątać sobie głowy implementacją obsługi 1-Wire „od zera”, dostępne są, bowiem stosowne biblioteki. Poniższy przykład wykorzystuje bibliotekę OneWire, która zapewnia podstawową obsługę magistrali oraz DallasTemperature, która zawiera specjalistyczne funkcje dla czujnika DS18B20

Program wykrywa układy podłączone do magistrali 1-Wire i cyklicznie dokonuje za ich pomocą pomiaru temperatury. Wyniki prezentowane są poprzez interfejs szeregowy.

```arduino
#include <OneWire.h>
#include <DallasTemperature.h>
  
// Data wire is plugged into pin 2 on the Arduino
#define ONE_WIRE_BUS 2
  
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
  
// Pass our oneWire reference to Dallas Temperature.
DallasTemperature sensors(&oneWire);
 
uint8_t numDevices;
  
void setup(void)
{
  // start serial port
  Serial.begin(9600);
  Serial.println("Dallas Temperature IC Control Library Demo");
  
  // Start up the library
  sensors.begin(); // IC Default 9 bit. If you have troubles consider upping it 12. Ups the delay giving the IC more time to process the temperature measurement
 
  // Use sensors.getDeviceCount() to find out how many devices are connected to the bus
  numDevices = sensors.getDeviceCount()
  Serial.print("Found ");
  Serial.print(numDevices, DEC);
  Serial.println(" devices.");
}
  
void loop(void)
{
  uint8_t i;
 
  // Use sensors.getDeviceCount() to find out how many devices are connected to the bus
  Serial.print("Found ");
  Serial.print(sensors.getDeviceCount(), DEC);
  Serial.println(" devices.");
 
  // call sensors.requestTemperatures() to issue a global temperature
  // request to all devices on the bus
  Serial.print("Requesting temperatures...");
  sensors.requestTemperatures(); // Send the command to get temperatures
  Serial.println("  DONE");
  
  for(i=0; i<numDevices;i++)
  {
    Serial.print("Temperature for Device ");
    Serial.print(i, DEC);
    Serial.print(" is: ");
    Serial.println(sensors.getTempCByIndex(i)); // 0 refers to the first IC on the wire
  }
}
```

## Warto przeczytać
*  [Nota katalogowa układu DS18B20](http://datasheets.maximintegrated.com/en/ds/DS18B20.pdf)
*  [Algorytm przeszukiwania 1-Wire](http://www.maximintegrated.com/app-notes/index.mvp/id/187)
*  [Opis zastosowania CRC w 1-Wire](http://www.maximintegrated.com/app-notes/index.mvp/id/187)
